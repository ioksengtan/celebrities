# 進度與討論紀錄

團隊共用的進度日誌，每次有新進展、決策或討論結論，往下新增一筆（新的在最上面）。

---

## 2026-09-06（核心薄片：語錄牆＋單場）

- Pages **根目錄就是語錄牆**（`index.html`），單場在 `products/core/speech.html?id=…#quote-<id>`
- 卡片：英文＋短中文＋講者／場合／日期；「複製英文／複製中文」帶一行出處（speaker · event · year）；「原文」與「單場」分開
- 牆上篩選：`verified` 且 `speech_id` 不在 `content_review_flags`（避開／需審）也不在 hold（`EM-2026-005`、`SA-2026-001`）。EM-2026-001 可進單場、不上牆
- 合併：healthy_seven 35 + KQ 7 + P0 16 + SA-2025-001 5（draft→verified）；MZ 以 MZ-2025-001 部分收錄。`w1_continue` 10 則（JH-2025-001×5、EM-2026-004×5）gzip 轉送損毀，**未編造、未入庫**
- 單場：短中文摘要（有 `prod001_summary_zh_draft` 的四場）＋語錄＋一條外連，不內嵌逐字稿。未改 CARDS／EE／Keynote 邏輯
- UX：卡片以「原文」為主按鈕，複製英／中次之；頁首／頁尾去掉說明文，方便短掃＋點來源

## 2026-09-06（EE 小遊戲 MVP：看英選中／看中選英）

- 只在 `products/general-vocab/executive-english.html` 加模式「小遊戲」；Keynote Lexicon 不動
- 第一波兩款選擇題：看英選中、看中選英；題庫用 `filteredCards()`（CEFR／講者篩選），優先抽尚未熟練的卡，每輪最多 10 題
- 干擾項優先同 CEFR，不夠再從篩選池／全卡池補；答對走既有 `applyKnowMark`（連勝＋1，滿 `MASTERY_STREAK` 熟練），答錯 `applyUnknownMark`（連勝歸 0），與測驗共用 `exec-vocab-known`
- 題目 UI 獨立，不套用滑卡／每日挑戰的 80% 手機卡面佈局；每日挑戰、深連結、稀有度、CARDS 資料未改

## 2026-09-06（測驗熟練：僅 Executive English）

- **只做 EE**：`products/general-vocab/executive-english.html` 測驗連續按「認識了」**3 次**（`MASTERY_STREAK`）才標成熟練並移出預設測驗牌組；「還不熟」連勝歸零，已熟練則取消並回到牌組
- **Keynote Lexicon 刻意不做**：那是收藏／瀏覽產品，不是測驗學習，不實作 streak／熟練移出（`keynote-lexicon.html` 維持 main 原測驗行為）
- EE 本機 key `exec-vocab-known`：舊 boolean `true` 遷移成 `{ streak: 1, mastered: false }`（不視為已熟練）；進度旁「已熟練 x 張」＋「重置熟練進度」；篩選範圍全熟練時有空狀態＋重置入口
- 每日挑戰／滑卡／整理瀏覽仍顯示全部卡片

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
