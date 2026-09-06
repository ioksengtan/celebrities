# Core UI（語錄牆＋單場演講）

GitHub Pages 核心薄片：掃語錄、複製、點原文。靜態 HTML，無建置。

## Pages 路徑

| 頁面 | 路徑 |
| --- | --- |
| **站首頁＝語錄牆** | [`/index.html`](../../index.html) → https://ioksengtan.github.io/celebrities/ |
| 語錄牆（同內容備援） | [`quotes-wall.html`](quotes-wall.html) |
| 單場列表 | [`speech.html`](speech.html) |
| 單場＋深連結 | `speech.html?id=JH-2026-005#quote-JH-2026-005-kq-1` |

Keynote Lexicon、Executive English 只在導覽列當週邊產品。

## 語錄怎麼篩（牆）

讀 [`references/quotes_index.json`](../../references/quotes_index.json) + [`references/content_review_flags.json`](../../references/content_review_flags.json)：

1. 只留 `status === "verified"`
2. 條目自身若有 truthy `content_review_flag` → 不上牆
3. `speech_id` 出現在 `content_review_flags`（避開或需審）→ **不上牆**（目前含 `EM-2026-001`）
4. Hold 場次 `EM-2026-005`、`SA-2026-001` → 不上牆

單場頁可以用 flagged 場次的語錄（例如 EM-2026-001），但牆上看不到。

## 卡片行為

- 預設：英文金句＋短中文＋講者／場合／日期
- `why_notable_zh` 摺疊
- **複製英文／複製中文**：複製「語錄正文 + 一行出處（speaker · event · year）」，不是只複製 URL
- **原文** → 外部 `source_url`；**單場** → 站內演講頁。兩個按鈕分開

## MANIFEST

見 [`references/README.md`](../../references/README.md)。`w1_continue_quotes_draft.json`（JH-2025-001×5 + EM-2026-004×5）在本次轉送時 base64 損毀，**未編造、未入庫**。
