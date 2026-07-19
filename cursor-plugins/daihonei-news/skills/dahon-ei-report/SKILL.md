---
name: dahon-ei-report
description: >-
  从当前对话抽取最乐观主张，夸张为大本营战报并发布到本机 DaihonEiNews。
  在用户要求发大本营战报、战报、出刊、讽刺乐观估计，或提到大本营发表时使用。
---

# 大本营战报

把 Agent 过于乐观的估计戏仿成「大本营发表」式战报，写入用户本机档案并直接用浏览器展示。无需项目仓库、前端构建或本地服务器。

## 何时使用

- 用户说：发大本营战报、出刊、战报、大本营发表
- 用户想讽刺刚才（或本对话中）过于乐观的估计

## 步骤（必须按序执行）

1. **锁定素材**  
   以本轮对话中「用户问题 + Agent 已给出的回答」为主。若用户 `@` 了某段消息，优先用该段。

2. **抽取最好的消息**  
   选出一条最乐观、最像胜利宣告的主张：完成承诺、耗时低估、风险否定、「很容易 / 很快 / 没问题」等。  
   若对话偏悲观或失败，仍可按文风反向夸张成「战果辉煌」（见 [style.md](style.md)）。

3. **夸张成战报**  
   按 [style.md](style.md) 产出：
   - `headline` / `headline_ja`（中文标题 + 日语译）
   - `lede` / `lede_ja`（中文本文 4–6 句 + 对应日语译，用以填满版面）
   - `source_claim`（原文主张）
   - `irony_tag`

4. **发布到本机档案**
   找到与本文件同目录的 `scripts/publish.mjs`，使用其**绝对路径**执行以下命令。不要直接修改插件目录内的文件，也不要在当前工作区创建战报数据。

   ```bash
   node "<本 Skill 目录绝对路径>/scripts/publish.mjs" --publish --open <<'DAIHONEI_JSON'
   {
     "headline": "...",
     "headline_ja": "...",
     "lede": "...",
     "lede_ja": "...",
     "source_claim": "...",
     "irony_tag": "...",
     "conversation_hint": "..."
   }
   DAIHONEI_JSON
   ```

   JSON 字段须按 [schema.md](schema.md) 填写。脚本会校验内容、将新条目 prepend 到 `~/.daihonei-news/dispatches.json`，生成可通过 `file://` 直接打开的 `~/.daihonei-news/index.html`，并保留最近 50 条。不得用字符串拼接或 `echo` 代替上述 quoted heredoc。

5. **回复用户（简短）**  
   脚本成功后只确认：战报标题 +「已出刊」+「本地报纸已打开」。若自动打开失败，再补充脚本输出的 `viewer_path`。
   **不要**在聊天里贴整版报纸或完整 JSON。

## 额外资源

- 文风与标题模板：[style.md](style.md)
- 字段与写入校验：[schema.md](schema.md)
- 本地发布器：[`scripts/publish.mjs`](scripts/publish.mjs)
