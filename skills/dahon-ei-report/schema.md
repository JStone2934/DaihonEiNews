# 战报数据 Schema

Agent 写入 [`data/dispatches.json`](../../data/dispatches.json) 时必须遵守本约定。

## 根对象

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `updated_at` | string (ISO-8601) | 是 | 最近一次出刊时间（UTC 或带时区） |
| `dispatches` | array | 是 | 战报列表；**最新在前**（prepend） |

## Dispatch 条目

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 唯一 ID。推荐 `dispatch-` + 时间戳，或 UUID |
| `created_at` | string (ISO-8601) | 是 | 本条出刊时间 |
| `headline` | string | 是 | 中文战报标题，约 16–28 字，句末多「！！」 |
| `headline_ja` | string | 是 | 标题日语译文（戦報体／文語調可） |
| `lede` | string | 是 | 中文本文，4–6 句，约 150–280 字，供小字栏排满 |
| `lede_ja` | string | 是 | 本文日语译文，紧跟中文正文之后展示；口吻同大本营发表 |
| `source_claim` | string | 是 | 原文主张（尽量原话），供「前线实报」对照 |
| `irony_tag` | string | 是 | 短标签：如 `速胜` / `无损` / `必然` / `万全` |
| `conversation_hint` | string | 否 | 一句短摘要；**勿**粘贴敏感全文或密钥 |

## 写入规则

1. 读取现有 JSON；解析失败则重建为 `{ "updated_at": "...", "dispatches": [] }`。
2. 新条目插入 `dispatches` **数组头部**。
3. 同步更新根级 `updated_at`。
4. 保留历史；若超过 **50** 条，截断尾部，只留前 50。
5. 保持合法 JSON（2 空格缩进），UTF-8，无尾逗号。
6. 只改 `data/dispatches.json`，不要改前端源码来「硬编码」新战报。
7. **必写** `headline_ja` 与 `lede_ja`，内容须对应中文标题/本文，勿留空。

## 写入前自检

- [ ] `headline` / `headline_ja` / `lede` / `lede_ja` / `source_claim` / `irony_tag` 均非空
- [ ] `source_claim` 能对照到对话中的乐观主张
- [ ] `headline` 明显夸张于 `source_claim`
- [ ] 日语译文与中文战报语义对应，口吻为戦報体
- [ ] 新条目在数组第 0 位
- [ ] `dispatches.length <= 50`
