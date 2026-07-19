# DaihonEiNews · 大本営発表

<img src="assets/logo.png" alt="DaihonEiNews 图标" width="160">

把 Cursor Agent 过于乐观的估计戏仿成「大本营发表」式战报，并保存为用户自己的本地报纸。

**仅 Skill 触发**：不会自动拦截每次回答；需你主动调用。

## 免责声明

本项目纯属虚构、**仅供娱乐**。它戏仿的对象是「过于乐观的进度估计」这一软件开发文化现象，与任何真实历史事件、组织或个人无关。

作者**坚决反对一切战争、侵略与暴行**，并对历史上一切战争暴行的受害者致以哀悼与尊重。此处借用「战报」修辞仅为反讽，绝无美化战争或军国主义之意。请勿将本工具用于宣扬仇恨、暴力或历史修正主义。

## 运行要求

- Cursor（需支持 Plugins / Skills）
- Node.js 18 或更高版本
- macOS、Windows 或带 `xdg-open` 的 Linux 桌面环境

## 快速开始

### 1. 安装插件

从 Cursor Marketplace 安装 `DaihonEiNews`（发布审核通过后可用）。本地开发测试可将仓库放入插件目录：

```sh
git clone https://github.com/JStone2934/DaihonEiNews.git
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/DaihonEiNews" ~/.cursor/plugins/local/daihonei-news
```

完成后重启 Cursor，或执行 `Developer: Reload Window`。本地发布器需要系统可执行 `node`。

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

## 发布与分发

本项目是 **Cursor Plugin**，Cursor Marketplace 直接从公开 Git 仓库读取 `.cursor-plugin/plugin.json` 及其声明的资源，不需要生成 `.vsix`、npm 包或 zip：

1. 将最新版本推送到公开 GitHub 仓库。
2. 在 [Cursor Marketplace 发布页](https://cursor.com/marketplace/publish) 提交仓库 URL。
3. 审核通过后，用户可直接从 Cursor Marketplace 安装。

`.vsix` 属于 **VS Code Extension** 的分发格式。VS Code 不识别 Cursor 的 Skill、Command 和 `.cursor-plugin/plugin.json`；若要发布到 VS Code Marketplace，需要另建扩展入口、`package.json` contribution、Webview/命令实现，并使用 `@vscode/vsce` 打包。这不是当前插件的发布目标。

## 仓库结构

```text
DaihonEiNews/
├── .cursor-plugin/plugin.json
├── assets/logo.png
├── commands/
│   └── open-daihonei-news.md
└── skills/dahon-ei-report/
    ├── SKILL.md
    ├── style.md
    ├── schema.md
    ├── scripts/publish.mjs     # 本地档案与 HTML 生成器
    └── assets/viewer.html      # 无依赖单文件报纸模板
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

## 许可证

[MIT](LICENSE)

## 验收自测

1. 先与 Agent 聊一段含乐观估计的对话（如「两小时就能搞定」）
2. 调用 `/dahon-ei-report`
3. 确认浏览器自动打开 `~/.daihonei-news/index.html`
4. 确认 `~/.daihonei-news/dispatches.json` 顶部出现新条目，且含 `source_claim`
5. 再次调用后，确认新头条置顶且旧战报进入「既往发表」
