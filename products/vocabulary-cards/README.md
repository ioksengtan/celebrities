# Keynote Lexicon（名人單字卡）

雙語詞彙卡與語錄，取材自 [`references/speeches_database.json`](../../references/speeches_database.json)（Jensen Huang、Elon Musk、Sam Altman、Sundar Pichai、Mark Zuckerberg 2024–2026 年的 30 場演講/訪談）。對應報告中的 **PROD-002**。

- 線上版本：https://claude.ai/code/artifact/14bb1f0b-4845-4b8f-8006-08415e87639f
- 原始碼：[`keynote-lexicon.html`](keynote-lexicon.html)（單一 HTML 檔，無需建置，本機用瀏覽器打開即可）

## 功能

- 20 張詞彙卡，分 4 類：AI 技術術語、商業與經濟、名人語錄、新創詞彙
- 依類別 / 講者篩選
- 瀏覽模式（卡片翻面看解釋 + 原句出處）與測驗模式（認識 / 還不熟，本機記錄進度）

## 待辦 / 可擴充方向

- [ ] 卡片數量擴充（目前 20 張，資料庫共 30 場演講，還有未收錄的詞彙）
- [ ] 抓取完整逐字稿後補上更多語錄（目前僅 7 條，見 `product_recommendations.json` 的 data_enrichment_recommendations）
- [ ] 發音音檔
- [ ] 與 PROD-005（每日一句）共用語錄資料
