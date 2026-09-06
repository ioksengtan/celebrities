# Keynote Lexicon（名人單字卡）

雙語詞彙卡與語錄，取材自 [`references/speeches_database.json`](../../references/speeches_database.json)（Jensen Huang、Elon Musk、Sam Altman、Sundar Pichai、Mark Zuckerberg 2024–2026 年的 30 場演講/訪談）。對應報告中的 **PROD-002**。

- 線上版本：https://claude.ai/code/artifact/14bb1f0b-4845-4b8f-8006-08415e87639f
- 原始碼：[`keynote-lexicon.html`](keynote-lexicon.html)（單一 HTML 檔，無需建置，本機用瀏覽器打開即可）

## 功能

- 20 張詞彙卡，分 4 類：AI 技術術語、商業與經濟、名人語錄、新創詞彙
- **每日挑戰模式**（預設）：仿 Pokemon 開卡包的體驗——每天固定 3 張卡（用日期算出，同一天大家看到的一樣），卡片一開始蓋著，點擊「開卡」才翻開；全部開完當天就算完成，累積連續天數，並有月曆檢視歷史紀錄（存在瀏覽器本機）
- **稀有度**：每張卡有普通 / 稀有 / 傳說三種稀有度，傳說卡（例如黃仁勳「Very good to be home」、馬斯克「Let's enjoy the ride」）有金色鑲邊卡框，開卡瞬間還有金色閃光特效
- **三面卡**：點卡片翻面，依序看到「詞彙 → 解釋＋原句 → 出處與延伸背景」，第三面補充場合、日期與這段話為什麼重要的背景說明
- 滑卡模式：手機直式單卡動態，上滑看下一張，每張卡可一鍵分享（原生分享或複製連結），設計給社群引流用——連結分享出去後對方直接落在可滑的卡片動態，而不是整理式的清單
- 整理瀏覽模式：網格檢視 + 依類別 / 講者篩選
- 測驗模式：認識 / 還不熟，本機記錄進度
- 分享連結支援深連結到指定卡片（`#card-<id>`）

## 本機預覽

專案根目錄已經有 `.claude/launch.json`，用 Claude Code 打開時可以直接用內建瀏覽器預覽（會用 `python -m http.server` 起一個本機伺服器）。單純用瀏覽器打開 `.html` 檔也看得到畫面，但因為是用 `file://` 開啟、JavaScript 在某些預覽環境下不會執行，建議還是透過本機伺服器測試互動功能。

## 待辦 / 可擴充方向

- [ ] 卡片數量擴充（目前 20 張，資料庫共 30 場演講，還有未收錄的詞彙），每日挑戰的卡池也會跟著變大
- [ ] 抓取完整逐字稿後補上更多語錄（目前僅 7 條，見 `product_recommendations.json` 的 data_enrichment_recommendations）
- [ ] 發音音檔
- [ ] 與 PROD-005（每日一句）共用語錄資料
- [ ] 評估做成可安裝的 PWA（加到手機主畫面、離線瀏覽）—— 需要獨立網域部署（例如 GitHub Pages），Artifact 預覽環境本身無法承載 service worker
- [ ] 每張卡的社群分享圖（og:image），目前只有純文字的連結預覽
- [ ] 連續天數/開卡紀錄目前只存在單一裝置的瀏覽器裡，換裝置或清瀏覽器資料就會歸零——之後如果要跨裝置延續，需要帳號系統
