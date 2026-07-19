#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = join(root, 'cursor-plugins')
const outPlugin = join(outRoot, 'daihonei-news')

const copies = [
  ['.cursor-plugin', '.cursor-plugin'],
  ['skills', 'skills'],
  ['commands', 'commands'],
  ['assets/logo.png', 'assets/logo.png'],
  ['LICENSE', 'LICENSE'],
  ['README.md', 'README.md'],
]

rmSync(outRoot, { recursive: true, force: true })
mkdirSync(outPlugin, { recursive: true })

for (const [fromRel, toRel] of copies) {
  const from = join(root, fromRel)
  const to = join(outPlugin, toRel)
  if (!existsSync(from)) {
    throw new Error(`缺少捆绑源文件: ${fromRel}`)
  }
  mkdirSync(dirname(to), { recursive: true })
  cpSync(from, to, { recursive: true })
}

console.log(`已生成 VSIX 插件捆绑目录: ${outPlugin}`)