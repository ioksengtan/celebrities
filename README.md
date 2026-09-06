# celebrities

以科技名人（Jensen Huang、Elon Musk、Sam Altman、Sundar Pichai、Mark Zuckerberg 等）2024–2026 年的演講/訪談為素材，開發一系列產品：導讀摘要、單字學習卡、資料視覺化等。團隊協作與進度都存放在這個 GitHub repo。

## 目錄結構

```
index.html           GitHub Pages 首頁＝語錄牆
references/          原始資料與規劃文件
  quotes_index.json              合併後的已核實語錄（牆／單場共用）
  content_review_flags.json      不上牆的 speech_id
  healthy_seven_feed.json        7 場優先演講＋quotes_wall
  speeches_database.json         30 場演講的完整 metadata
  speeches_indexes.json          7 種索引視圖
  product_recommendations.json   6 個候選產品（PROD-001~006）

products/
  core/                           語錄牆備援頁＋單場演講
  vocabulary-cards/               PROD-002 名人單字卡（週邊）
  general-vocab/                  Executive English CEFR 詞彙卡（週邊）

docs/
  PROGRESS.md        團隊討論與進度紀錄
```

## GitHub Pages

- **語錄牆（站首頁）**：https://ioksengtan.github.io/celebrities/
- **單場演講**：https://ioksengtan.github.io/celebrities/products/core/speech.html
- 週邊： [Keynote Lexicon](products/vocabulary-cards/keynote-lexicon.html) · [Executive English](products/general-vocab/executive-english.html)

核心產品是語錄／演講正文。牆只顯示 `verified`，並排除 `content_review_flags` 與 hold 場次。詳見 [`products/core/README.md`](products/core/README.md)。

## 目前狀態

- ✅ 資料庫與產品建議已整理進 `references/`
- ✅ **語錄牆＋單場演講**薄片已上 Pages 根目錄（見上）
- ✅ PROD-002「名人單字卡」MVP 已完成，見 [`products/vocabulary-cards`](products/vocabulary-cards)
- ✅ Executive English（一般英語 CEFR 詞彙卡）第一版已完成，見 [`products/general-vocab`](products/general-vocab)
- ⬜ 其他候選產品（長導讀、時間軸可視化、每日一句、主題深度分析、演講比較）尚未開始

## 協作方式

- 進度與討論寫在 [`docs/PROGRESS.md`](docs/PROGRESS.md)，每次有進展或決策就補一筆
- 新產品開發放在 `products/<product-name>/` 底下，各自附一份簡短 README 說明狀態與連結
- 資料如有更新（新演講、新語錄、逐字稿），更新 `references/` 下對應的 JSON 檔
