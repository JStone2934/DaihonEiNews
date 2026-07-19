# 战报数据 Schema

Agent 交给 [`scripts/publish.mjs`](scripts/publish.mjs) 的战报 JSON 必须遵守本约定。发布器负责维护用户本机 `~/.daihonei-news/dispatches.json`，Agent 不直接编辑该文件。

## 根对象

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `updated_at` | string (ISO-8601) | 是 | 最近一次出刊时间（UTC 或带时区） |
| `dispatches` | array | 是 | 战报列表；**最新在前**（prepend） |

## Dispatch 条目

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 否 | 唯一 ID；省略时由发布器生成 |
| `created_at` | string (ISO-8601) | 否 | 本条出刊时间；省略时由发布器生成 |
| `headline` | string | 是 | 中文战报标题，约 16–28 字，句末多「！！」 |
| `headline_ja` | string | 是 | 标题日语译文（戦報体／文語調可） |
| `lede` | string | 是 | 中文本文，4–6 句，约 150–280 字，供小字栏排满 |
| `lede_ja` | string | 是 | 本文日语译文，紧跟中文正文之后展示；口吻同大本营发表 |
| `source_claim` | string | 是 | 原文主张（尽量原话），供「前线实报」对照 |
| `irony_tag` | string | 是 | 短标签：如 `速胜` / `无损` / `必然` / `万全` |
| `conversation_hint` | string | 否 | 一句短摘要；**勿**粘贴敏感全文或密钥 |

## 写入规则

1. Agent 只生成单条 Dispatch JSON，并通过 quoted heredoc 传给 `publish.mjs --publish --open`。
2. **必写** `headline_ja` 与 `lede_ja`，内容须对应中文标题/本文，勿留空。
3. 发布器负责生成 `id` / `created_at`、prepend 新条目并更新根级 `updated_at`。
4. 发布器只保留最近 **50** 条，并同时原子更新 JSON 与单文件 HTML。
5. 本机目录默认是 `~/.daihonei-news/`；可通过环境变量 `DAIHONEI_HOME` 覆盖。
6. 若历史 JSON 损坏，发布器会先将原文件改名备份，再创建新档案。
7. 不得在当前工作区或只读插件安装目录内写入用户战报。

## 写入前自检

- [ ] `headline` / `headline_ja` / `lede` / `lede_ja` / `source_claim` / `irony_tag` 均非空
- [ ] `source_claim` 能对照到对话中的乐观主张
- [ ] `headline` 明显夸张于 `source_claim`
- [ ] 日语译文与中文战报语义对应，口吻为戦報体
- [ ] 传给发布器的是单个 JSON 对象，不含 Markdown 代码围栏
