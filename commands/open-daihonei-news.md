---
name: open-daihonei-news
description: 打开当前用户本机的 DaihonEiNews 战报档案。
---

# 打开 DaihonEiNews

找到插件内 `skills/dahon-ei-report/scripts/publish.mjs` 的绝对路径，然后执行：

```bash
node "<脚本绝对路径>" --init --open
```

成功后只需告诉用户本地战报已打开。若浏览器未自动打开，同时给出脚本输出的 `viewer_path`。
