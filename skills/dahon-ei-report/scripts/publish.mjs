#!/usr/bin/env node

import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = new Set(process.argv.slice(2))
const shouldInit = args.has('--init')
const shouldOpen = args.has('--open')
const shouldPublish = args.has('--publish')

if (!shouldInit && !shouldPublish) {
  console.error('用法: node publish.mjs --init [--open] 或 --publish [--open] < entry.json')
  process.exit(2)
}

const outputDir = process.env.DAIHONEI_HOME || join(homedir(), '.daihonei-news')
const dataPath = join(outputDir, 'dispatches.json')
const htmlPath = join(outputDir, 'index.html')
const scriptDir = dirname(fileURLToPath(import.meta.url))
const templatePath = join(scriptDir, '..', 'assets', 'viewer.html')

const requiredFields = [
  'headline',
  'headline_ja',
  'lede',
  'lede_ja',
  'source_claim',
  'irony_tag',
]

function emptyArchive() {
  return { updated_at: new Date().toISOString(), dispatches: [] }
}

function readArchive() {
  if (!existsSync(dataPath)) return emptyArchive()
  try {
    const value = JSON.parse(readFileSync(dataPath, 'utf8'))
    if (!Array.isArray(value.dispatches)) throw new Error('dispatches 必须为数组')
    return value
  } catch (error) {
    const backupPath = `${dataPath}.corrupt-${Date.now()}`
    renameSync(dataPath, backupPath)
    console.warn(`原数据无法解析，已备份至 ${backupPath}: ${error.message}`)
    return emptyArchive()
  }
}

async function readStdin() {
  let source = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) source += chunk
  if (!source.trim()) throw new Error('--publish 需要通过 stdin 传入战报 JSON')
  return JSON.parse(source)
}

function normalizeEntry(input, now) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('战报必须是 JSON 对象')
  }
  for (const field of requiredFields) {
    if (typeof input[field] !== 'string' || !input[field].trim()) {
      throw new Error(`缺少非空字符串字段: ${field}`)
    }
  }
  return {
    id: typeof input.id === 'string' && input.id.trim()
      ? input.id.trim()
      : `dispatch-${Date.now()}`,
    created_at: typeof input.created_at === 'string' && input.created_at.trim()
      ? input.created_at.trim()
      : now,
    headline: input.headline.trim(),
    headline_ja: input.headline_ja.trim(),
    lede: input.lede.trim(),
    lede_ja: input.lede_ja.trim(),
    source_claim: input.source_claim.trim(),
    irony_tag: input.irony_tag.trim(),
    ...(typeof input.conversation_hint === 'string' && input.conversation_hint.trim()
      ? { conversation_hint: input.conversation_hint.trim() }
      : {}),
  }
}

function atomicWrite(path, contents) {
  const temporaryPath = `${path}.tmp-${process.pid}`
  writeFileSync(temporaryPath, contents, 'utf8')
  renameSync(temporaryPath, path)
}

function render(archive) {
  const template = readFileSync(templatePath, 'utf8')
  const marker = '__DAIHONEI_DATA_BASE64__'
  if (!template.includes(marker)) throw new Error('静态模板缺少数据占位符')
  const encoded = Buffer.from(JSON.stringify(archive), 'utf8').toString('base64')
  return template.replace(marker, encoded)
}

function openViewer() {
  let command
  let commandArgs
  if (process.platform === 'darwin') {
    command = 'open'
    commandArgs = [htmlPath]
  } else if (process.platform === 'win32') {
    command = 'cmd'
    commandArgs = ['/c', 'start', '', htmlPath]
  } else {
    command = 'xdg-open'
    commandArgs = [htmlPath]
  }
  const child = execFile(command, commandArgs, { windowsHide: true }, error => {
    if (error) console.warn(`无法自动打开浏览器，请手动打开 ${htmlPath}`)
  })
  child.unref()
}

mkdirSync(outputDir, { recursive: true })
const archive = readArchive()

if (shouldPublish) {
  try {
    const now = new Date().toISOString()
    const entry = normalizeEntry(await readStdin(), now)
    archive.dispatches = [
      entry,
      ...archive.dispatches.filter(item => item?.id !== entry.id),
    ].slice(0, 50)
    archive.updated_at = now
  } catch (error) {
    console.error(`出刊失败: ${error.message}`)
    process.exit(1)
  }
}

atomicWrite(dataPath, `${JSON.stringify(archive, null, 2)}\n`)
atomicWrite(htmlPath, render(archive))

if (shouldOpen) openViewer()

console.log(JSON.stringify({
  ok: true,
  count: archive.dispatches.length,
  data_path: dataPath,
  viewer_path: htmlPath,
}))
