const path = require('path')
const vscode = require('vscode')

/**
 * Cursor-only bridge: register the bundled plugin directory so Skills/Commands
 * (e.g. /dahon-ei-report) are discovered. No-op in plain VS Code.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const pluginsApi = vscode.cursor && vscode.cursor.plugins
  if (!pluginsApi || typeof pluginsApi.registerPath !== 'function') {
    console.log(
      '[DaihonEiNews] vscode.cursor.plugins.registerPath unavailable; skipping Skill registration (Cursor only).',
    )
    context.subscriptions.push(
      vscode.commands.registerCommand('daihoneiNews.showInfo', () => {
        vscode.window.showInformationMessage(
          'DaihonEiNews Skills only activate inside Cursor. Install this VSIX in Cursor, then use /dahon-ei-report.',
        )
      }),
    )
    return
  }

  const pluginsDir = path.join(context.extensionPath, 'cursor-plugins')
  pluginsApi.registerPath(pluginsDir)
  console.log(`[DaihonEiNews] registered plugin path: ${pluginsDir}`)

  context.subscriptions.push({
    dispose: () => {
      if (typeof pluginsApi.unregisterPath === 'function') {
        pluginsApi.unregisterPath(pluginsDir)
      }
    },
  })

  context.subscriptions.push(
    vscode.commands.registerCommand('daihoneiNews.showInfo', () => {
      vscode.window.showInformationMessage(
        'DaihonEiNews plugin path registered. Use /dahon-ei-report or /open-daihonei-news in Agent chat.',
      )
    }),
  )
}

function deactivate() {}

module.exports = { activate, deactivate }
