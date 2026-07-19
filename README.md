# FightNews · 大本営発表

把 Cursor Agent 过于乐观的估计，戏仿成「大本营发表」式战报，在本仓库新闻站出刊。

**仅 Skill 触发**：不会自动拦截每次回答；需你主动调用。

## 快速开始

### 1. 启动新闻站

```bash
cd web
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

### 2. 在 Cursor 中出刊

任选其一：

- 输入 `/dahon-ei-report`
- 自然语言：「发大本营战报」「出刊」「大本营发表」

Agent 会从**当前对话**抽取最乐观主张，夸张成标题，**prepend** 写入 [`data/dispatches.json`](data/dispatches.json)。刷新新闻站即可看到新头条（开发模式下改 JSON 通常会热更新）。

聊天里只会收到简短确认，整版报纸在网页上。

### 3. 本地安装为 Cursor Plugin（可选）

把本仓库链到 Cursor 本地插件目录，便于跨项目发现 Skill：

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)" ~/.cursor/plugins/local/fight-news
```

也可把 [`skills/dahon-ei-report`](skills/dahon-ei-report) 复制到某项目的 `.cursor/skills/dahon-ei-report/`，仅在该项目可用。

## 仓库结构

```text
FightNews/
├── .cursor-plugin/plugin.json
├── skills/dahon-ei-report/     # Skill：抽取 → 夸张 → 写 JSON
├── data/dispatches.json        # 战报源数据
└── web/                        # Vite + React 新闻站
```

## Skill 说明

| 文件 | 作用 |
|------|------|
| `skills/dahon-ei-report/SKILL.md` | 出刊步骤 |
| `skills/dahon-ei-report/style.md` | 战报文风 |
| `skills/dahon-ei-report/schema.md` | JSON 字段与写入规则 |

## 不做的事

- 无 `afterAgentResponse` hook 自动出刊
- 无 Canvas / MCP / 后端登录

## 验收自测

1. 先与 Agent 聊一段含乐观估计的对话（如「两小时就能搞定」）
2. 调用 `/dahon-ei-report`
3. 确认 `data/dispatches.json` 顶部出现新条目，且含 `source_claim`
4. 新闻站头条与「前线实报」对照可见
