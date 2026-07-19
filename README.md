# DaihonEiNews · 大本営発表

<img src="assets/logo.png" alt="DaihonEiNews 图标" width="160">

Agent 有时回答得过于乐观，仿佛问题马上就能解决——那口吻活像夸夸其谈的「大本营发表」。于是，本工具索性把 Agent 的乐观估计，改写成一纸浮夸的大本营战报公开「出刊」。

**仅 Skill 触发**：不会自动拦截每次回答，需你主动调用。

## 运行要求

- **Cursor**（需支持 Plugins / Skills；本扩展在普通 VS Code 中安装后无功能）
- Node.js 18 或更高版本（出刊脚本用）
- macOS、Windows 或带 `xdg-open` 的 Linux 桌面环境

## 快速开始（推荐：VSIX）

### 1. 安装扩展

从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=JStone2934.daihonei-news) 在 **Cursor** 中安装 `DaihonEiNews`，或手动安装仓库发布的 `.vsix`：

```sh
# 在 Cursor 中：Extensions → … → Install from VSIX…
# 或命令行：
cursor --install-extension daihonei-news-2.0.2.vsix
```

扩展激活后会通过 `vscode.cursor.plugins.registerPath` 注册捆绑的 Skill；重启或 `Developer: Reload Window` 后即可使用 `/dahon-ei-report`。

若你曾用本地软链安装过同一插件，请先移除以免重复：

```sh
rm -f ~/.cursor/plugins/local/daihonei-news ~/.cursor/plugins/local/fight-news
```

### 2. 出刊

在任意 Agent 对话中任选其一：

- 输入 `/dahon-ei-report`
- 自然语言说「发大本营战报」「出刊」「大本营发表」

Agent 会从当前对话抽取最乐观的主张，生成中日双语战报，写入 `~/.daihonei-news/` 并自动打开报纸。无需 clone 新闻站、安装 npm 依赖或运行本地服务器。

### 3. 再次打开档案

输入 `/open-daihonei-news`。也可以直接用浏览器打开：

```text
~/.daihonei-news/index.html
```

每位用户的数据只保存在自己的设备上；默认保留最近 50 条。设置 `DAIHONEI_HOME` 可覆盖存储目录。

## 其他安装方式

### 本地 Cursor Plugin 目录

```sh
git clone https://github.com/JStone2934/DaihonEiNews.git
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/DaihonEiNews" ~/.cursor/plugins/local/daihonei-news
```

完成后 `Developer: Reload Window`。

### Cursor Marketplace

也可将公开 Git 仓库提交至 [Cursor Marketplace](https://cursor.com/marketplace/publish)（与 VSIX 渠道独立，可并存）。

## 发布与打包（维护者）

本仓库同时是：

1. **Cursor Plugin**（`.cursor-plugin/plugin.json` + `skills/` + `commands/`）
2. **VS Code / Cursor 扩展**（根目录 `package.json` + `extension.js`，打包为 `.vsix`）

扩展在 Cursor 中激活时，把 `cursor-plugins/` 注册为插件源；普通 VS Code 无 `vscode.cursor.plugins` API，会静默跳过。

### 本地打 VSIX

```sh
npm install
npm run package   # = bundle + vsce package
```

产物：`daihonei-news-<version>.vsix`。修改 Skill 后请重新 `npm run bundle`（或 `npm run package`），以同步 `cursor-plugins/`。

### 发布到 VS Code Marketplace

Publisher：`JStone2934`。需要在 [Azure DevOps](https://dev.azure.com) 创建 Personal Access Token，勾选 **Marketplace → Manage**，然后在本机执行（**不要把 PAT 发到聊天或提交进仓库**）：

```sh
npx @vscode/vsce login JStone2934
# 按提示粘贴 PAT
npm run publish
```

也可：

```sh
npx @vscode/vsce publish --no-dependencies -p <PAT>
```

## 仓库结构

```text
DaihonEiNews/
├── package.json                 # VS Code 扩展清单（Marketplace / VSIX）
├── extension.js                 # Cursor registerPath 桥接
├── .cursor-plugin/plugin.json   # Cursor Plugin 清单（源）
├── assets/logo.png
├── commands/
├── skills/dahon-ei-report/
├── cursor-plugins/daihonei-news/  # 由 npm run bundle 生成，打进 VSIX
└── scripts/build-vsix-bundle.mjs
```

## Skill 说明

- `skills/dahon-ei-report/SKILL.md`：抽取、生成与出刊步骤
- `skills/dahon-ei-report/style.md`：战报文风
- `skills/dahon-ei-report/schema.md`：字段与本地写入规则
- `skills/dahon-ei-report/scripts/publish.mjs`：校验、归档、渲染和打开报纸

## 不做的事

- 无 `afterAgentResponse` hook 自动出刊
- 无 Vite / React 运行时
- 无云端同步、后端登录或遥测
- 不将对话或战报写入当前工作区
- 不在普通 VS Code 中复刻 Agent Skill（仅 Cursor 生效）

## 许可证

[MIT](LICENSE)

## 验收自测

1. 在 Cursor 中安装本扩展的 VSIX，Reload Window
2. 先与 Agent 聊一段含乐观估计的对话（如「两小时就能搞定」）
3. 调用 `/dahon-ei-report`
4. 确认浏览器自动打开 `~/.daihonei-news/index.html`
5. 确认 `~/.daihonei-news/dispatches.json` 顶部出现新条目，且含 `source_claim`
6. 再次调用后，确认新头条置顶，「既往發表」仅显示上两条

## 免责声明

本项目纯属虚构、**仅供娱乐**。它戏仿的对象是「过于乐观的进度估计」这一软件开发文化现象，与任何真实历史事件、组织或个人无关。

作者**坚决反对一切战争、侵略与暴行**，并对历史上一切战争暴行的受害者致以哀悼与尊重。此处借用「战报」修辞仅为反讽，绝无美化战争或军国主义之意。请勿将本工具用于宣扬仇恨、暴力或历史修正主义。