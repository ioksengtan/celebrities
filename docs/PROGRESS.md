# 進度與討論紀錄

團隊共用的進度日誌，每次有新進展、決策或討論結論，往下新增一筆（新的在最上面）。

---

## 2026-09-06（手機卡片加大）

- Keynote Lexicon 與 Executive English：窄螢幕（≤480px）滑卡／每日挑戰用 flex + `dvh`/`svh` 讓卡片吃掉 chrome 以外的空間
- 390×844 實測：每日挑戰卡片 **83.9%** viewport、滑卡 **89%**；430×932 每日 **85.4%**。桌面／整理瀏覽卡高仍為 230px
- 正面詞彙約 35px、解釋 18px／行高 1.55；長文仍可在卡片內捲動
- 未改 CARDS、localStorage key、`#card-<id>`、翻面／開卡／稀有度、DAILY_SIZE

## 2026-09-06（卡池擴充／Pages 上線）

- GitHub Pages 已上線，可直接給社群用這三個網址：
  - https://ioksengtan.github.io/celebrities/
  - https://ioksengtan.github.io/celebrities/products/vocabulary-cards/keynote-lexicon.html
  - https://ioksengtan.github.io/celebrities/products/general-vocab/executive-english.html
- 卡池擴充：Keynote CARDS 20→45；Executive English 100→130（並同步 `cards_data.json`）
- 新建 `references/quotes_index.json`（33 則 `status === "verified"` 且尚未入庫的語錄；此檔為新建，repo 原本沒有 `quotes_index`）
- Executive English 補上 Sam Altman（`sa`）講者色票與 SPEAKERS，與 Keynote Lexicon 的綠色系一致

## 2026-09-06（晚上）

- 修掉一個 bug：分享出去的連結重新打開時會停在上次滑到的卡片（瀏覽器快取捲動位置），現在強制每次開啟都回到第一張，除非帶著 `#card-<id>` 深連結
- 加入「每日挑戰」：仿 Pokemon 開卡包體驗，每天固定 3 張卡（用日期算出，同一天大家看到一樣的卡），點擊開卡才翻開，全部開完算完成一天，累積連續天數＋月曆檢視歷史（存在本機瀏覽器）
- 加入卡片稀有度（普通／稀有／傳說），傳說卡（例如黃仁勳「Very good to be home」、馬斯克「Let's enjoy the ride」）有金色鑲邊＋開卡金光特效
- 卡片從兩面擴充成三面：詞彙 → 解釋＋原句 → 出處與延伸背景（場合、日期、為什麼這段話重要）
- 加了 `.claude/launch.json`，之後要在本機測試互動功能可以用 Claude Code 內建瀏覽器直接跑（`python -m http.server`），不用只靠 `file://` 打開
- 待決定：連續天數目前只存在單一裝置本機，換裝置會歸零。GitHub Pages 已上線（見上方 2026-09-06 卡池擴充紀錄）

## 2026-09-06（下午）

- 討論定調：單字卡適合「零碎時間瀏覽」的資訊載體（通勤、排隊等），先以社群引流 + 網頁滑卡為主，暫緩原生 App，之後視使用量再評估做成 PWA
- 把單字卡預設畫面改成手機版滑卡動態（上滑切下一張、點卡翻面、每張卡可一鍵分享），整理瀏覽/測驗模式移到切換鈕裡
- GitHub Pages 已上線：https://ioksengtan.github.io/celebrities/（含 Keynote Lexicon 與 Executive English；不再只靠 Claude Artifact）

## 2026-09-06

- 建立 repo 結構：`references/`（原始資料）、`products/`（各產品原型）、`docs/`（本檔案）
- 匯入資料庫：30 場演講/訪談（Jensen Huang ×10、Elon Musk ×8、Sam Altman ×7、Sundar Pichai ×3、Mark Zuckerberg ×2），時間範圍 2024-03 至 2026-09
- 完成 **PROD-002 名人單字卡** 第一版雛形（20 張卡，4 類詞彙，瀏覽 + 測驗模式），見 [`products/vocabulary-cards`](../products/vocabulary-cards)
- 討論方向：導讀（PROD-001）、單字卡（PROD-002）、可視化（PROD-003）三個是目前主要想做的產品；報告建議優先做 PROD-002 或 PROD-005（每日一句），因為資料需求最低
- 待決定：下一個要做哪個產品？資料補齊（完整逐字稿、更多語錄）誰來負責？
