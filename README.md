# DaihonEiNews · 大本営発表

把 Cursor Agent 过于乐观的估计戏仿成「大本营发表」式战报，并保存为用户自己的本地报纸。

**仅 Skill 触发**：不会自动拦截每次回答；需你主动调用。

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

## 仓库结构

```text
DaihonEiNews/
├── .cursor-plugin/plugin.json
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

## 验收自测

1. 先与 Agent 聊一段含乐观估计的对话（如「两小时就能搞定」）
2. 调用 `/dahon-ei-report`
3. 确认浏览器自动打开 `~/.daihonei-news/index.html`
4. 确认 `~/.daihonei-news/dispatches.json` 顶部出现新条目，且含 `source_claim`
5. 再次调用后，确认新头条置顶且旧战报进入「既往发表」
