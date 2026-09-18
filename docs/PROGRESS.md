# 進度與討論紀錄

團隊共用的進度日誌，每次有新進展、決策或討論結論，往下新增一筆（新的在最上面）。

---

## 2026-09-18（共用核心、內容驗證、間隔複習）

- 新增 `products/shared/learning-core.js`，兩個產品共用日期、每日固定抽卡、洗牌、連續天數、同步代碼與複習排程邏輯；仍維持純前端、免建置部署
- 新增 `products/shared/content-schema.json` 作為兩套卡片資料的欄位契約，並新增 `npm run validate`：驗證必填欄位、ID、重複詞條、日期、講者、分類、CEFR／稀有度、HTML／JSON 同步及間隔排程
- Executive English 的測驗改成間隔複習：記得後依 1、3、7 天再逐步拉長；忘記則隔天再出現。沿用 `exec-vocab-known` 並自動遷移舊格式，不清除既有進度
- 本機瀏覽器驗收兩個產品均能載入，Executive English 答題後今日待複習數會減少，瀏覽器主控台無錯誤
- 修正 Keynote Lexicon README 的舊卡片數（20→45）
- 兩個產品的卡片都改由各自的 `cards_data.json` 載入，JSON 成為唯一資料來源；HTML 不再維護重複副本
- 新增 GitHub Actions，在每次 push／pull request 自動執行 `npm run validate`

---

## 2026-09-18（首頁改為服務入口）

- 首頁不再直接顯示語錄牆，改為說明整體服務定位：「從科技領袖的真實演講學英語與觀點」
- 第一屏加入明確價值主張、主要 CTA，以及 30 場演講／145 個進階詞彙／45 張科技主題卡的內容規模
- 新增 Executive English、Keynote Lexicon、已核實語錄三條使用路徑，補充真實語境、來源核實與間隔複習的差異化說明
- 語錄牆保留為 `products/core/quotes-wall.html` 獨立頁面，並修正導覽與 `CoreUI` 的語錄牆連結
- 已以桌面與 390×844 手機 viewport 驗收首頁資訊層級與響應式排版

## 2026-09-16（EE 測驗：認識了／還不熟即時連勝回饋）

- 只改 `products/general-vocab/executive-english.html` 測驗模式。`MASTERY_STREAK=3`、`exec-vocab-known` schema、小遊戲、每日挑戰、篩選、重置熟練、Keynote Lexicon 都不動
- 按「認識了」／「還不熟」後立刻 toast：連勝 n／3、連勝已歸零、剛熟練則「已熟練，下一輪測驗會移出」。本輪仍留在牌組，下一輪 `resetQuiz` 才依既有 `quizPool()` 移出
- 剛達熟練時「已熟練 N 張」HUD 會跳一下。測驗 chrome 多「這張連勝 n／3」，方便看到目前這張的進度

---

## 2026-09-16（每日挑戰：點日曆可回看當天牌組）

- Keynote Lexicon 與 Executive English：日曆格子原本只顯示 ✓／今天框、沒有 click handler；`renderDaily()` 也一律畫「今天」。現在可點**今天**，或點有紀錄的過去日期，在每日挑戰 UI 看該日牌組
- 沿用既有本機 key，沒加新 schema：完成日 `keynote-lexicon-daily` / `exec-vocab-daily`（`{ "YYYY-MM-DD": true }`）；已開卡 `keynote-lexicon-daily-opened` / `exec-vocab-daily-opened`（`{ "YYYY-MM-DD": [id, …] }`）。牌組仍用日期種子（`hashStr(date) + mulberry32`）重建
- 未來日、從未開過也從未完成的日子：格子維持不可點。點「每日挑戰」會回到今天（今日抽卡、連續天數、同步匯出/匯入不變）
- **無法還原的日期**：沒有完成旗標、也沒有 `daily-opened` 的日子無法回看。同步代碼的 `o` 只帶「今天已開卡」；從別台合併進來的歷史完成日若沒有開卡 id，會用**當前卡池**的日期種子重建（Keynote 會再排除目前已封存的卡）。卡池之後有增減、或封存集合變了，重建結果可能和當天實際抽到的不一樣；若該日有留下 `daily-opened`，Keynote 會優先用那些 id

---

## 2026-09-15（Keynote Lexicon：個人封存／左滑退出牌組）

- 只改 `products/vocabulary-cards/keynote-lexicon.html`：單機個人管理薄片，無帳號、無後端。CARDS 資料不刪；Executive English／語錄牆不動
- **滑卡左滑** = 封存（可還原）。滑動時卡片左移、右側露出「封存」。本機 key：`keynote-lexicon-archived`（id 陣列）。既有 `keynote-lexicon-daily`／`keynote-lexicon-daily-opened`／`keynote-lexicon-known` 不改
- **整理瀏覽**多「進行中／已封存」；誤滑可在「已封存」按「還原」。封存卡立刻退出預設滑卡牌組
- **每日挑戰規則**：抽卡池排除已封存。若某張卡**當天已經抽進今日牌組**（本頁 session 快取）或**今天已經開過**，即使隨後封存，今天仍留在每日挑戰讓你開完並計入進度；明天起不再進入抽卡池。預設滑卡則立刻不再出現
- **同步代碼**升為 `v: 2`，多一個 `a`（封存 id 清單）。舊 `v: 1` 仍可匯入。合併用聯集：完成日、今日已開卡、封存 id 都是 union，不會清掉另一台裝置的封存

---

## 2026-09-15（語錄牆：入庫 week3 ×20；SA-2026-001 僅 draft）

- `week3_quotes_verified_for_wall` 20 則寫入 `quotes_index.json`，`status=verified`，可上牆：MZ-2024-001×5（加厚）、MZ-2025-001×5（加厚）、SA-2026-002×5、JH-2026-006×5。依 `quote_id`／英文原句去重，無碰撞
- `week3_quotes_draft_hold` 的 SA-2026-001×4 **只**放 sidecar（`status=draft`），**未**標 verified、**不上**語錄牆。EM-2026-005 仍排除（0 則）
- Hold 未動：`EM-2026-005`、`SA-2026-001`。牆篩選仍只收 `verified`，並排除 `content_review_flags`／hold
- `quotes_index` 86→106；牆 82→102 則／17→19 場。本 PR 未改 Keynote Lexicon／Executive English 產品 HTML

## 2026-09-13（語錄牆：入庫 week2 ×15，去重 EM-2026-003）

- `week2_quotes_to_merge_verified` 15 則（EM-2026-002×5、MZ-2024-001×5、SP-2025-002×5）寫入 `quotes_index.json`，`status=verified`，可上牆
- **未**加入 EM-2026-003 複本；`speech_aliases.json` 記同一場達沃斯對談（語錄只掛 EM-2026-002）。單場頁會顯示這則說明
- Hold 未動：`EM-2026-005`、`SA-2026-001`。牆篩選仍只收 `verified`，並排除 `content_review_flags`／hold
- `quotes_index` 71→86；牆 67→82 則／14→17 場。本 PR 未改 Keynote Lexicon／Executive English 產品 HTML

## 2026-09-13（語錄牆 PR #5：rebase + 入庫 w1_continue×10）

- 分支 rebase 到最新 `main`（`9861293`，含已合併的 EE 小遊戲 PR #6）
- `w1_continue` 10 則（JH-2025-001×5、EM-2026-004×5）draft→verified 寫入 `quotes_index.json` 且可上牆；未拿掉、未編造替換句
- `quotes_index` 61→71；牆 57→67 則／13→14 場。JH-2025-001 另保留既有 KQ×1（共 6）；EM-2026-004 = 5
- 本 PR 未改 `executive-english.html`／Keynote

## 2026-09-12（每日挑戰連續天數跨裝置同步：匯出/匯入代碼）

- Keynote Lexicon 與 Executive English 都加了「同步」按鈕（在日曆按鈕旁），純前端方案、不加後端／不用註冊帳號
- 代碼內容：已完成的日期清單 + 今天已開的卡片 id，`JSON.stringify` 後 `btoa` 成一段文字；貼到另一台裝置按「合併」，用聯集方式合併（已完成的日期用聯集，不會蓋掉任一邊的紀錄），可重複匯入不會重複計算
- 兩產品各自獨立（不同 localStorage key，沿用原本各自為政的設計），沒有做成「跨產品共用 streak」；純匯出/匯入，不是自動同步，換裝置要手動做一次
- 待評估：如果之後要做「自動」跨裝置同步（不用手動複製貼上），需要導入帳號＋後端（Firebase/Supabase 等），目前先用零基礎設施的方案起步

## 2026-09-12（EE 卡池擴充：G20 爐邊對談 + 分支同步）

- Executive English 卡池 130→145：新增 Jensen Huang 在 2026-09-02 G20 Innovation Ministerial 爐邊對談的 15 個字（逐字稿來源改為 YouTube 新聞英語頻道，因原本慣用的 rev.com/singjupost.com 等站尚未收錄這場）
- 這批字是在本機分支落後 origin/main 12 個 commit 時累積的離線改動，與同期合併的三個 PR（小遊戲、測驗熟練、手機卡片加大）撞到同一批 id（101–115 重複），rebase 時手動把新字重新編號到 131–145，已確認全卡池 id 連續無重複
- 同步更新 README 字數統計（115→145，改成合併後的正確值）

## 2026-09-06（小遊戲加「不熟」）

- 只改 Executive English 小遊戲（看英選中／看中選英）：每題在四個選項旁加「不熟」，不必硬猜錯
- 按「不熟」不計分、短暫標出正確答案後進下一題，連勝走既有 `applyUnknownMark`（歸 0）；結算分開計 對／錯／不熟
- 測驗模式「還不熟」未改；CARDS、每日挑戰、深連結、稀有度、80% 卡面未動

## 2026-09-06（核心薄片：語錄牆＋單場）

- Pages **根目錄就是語錄牆**（`index.html`），單場在 `products/core/speech.html?id=…#quote-<id>`
- 卡片：英文＋短中文＋講者／場合／日期；「複製英文／複製中文」帶一行出處（speaker · event · year）；「原文」與「單場」分開
- 牆上篩選：`verified` 且 `speech_id` 不在 `content_review_flags`（避開／需審）也不在 hold（`EM-2026-005`、`SA-2026-001`）。EM-2026-001 可進單場、不上牆
- 合併：healthy_seven 35 + KQ 7 + P0 16 + SA-2025-001 5（draft→verified）；MZ 以 MZ-2025-001 部分收錄。`w1_continue` 10 則（JH-2025-001×5、EM-2026-004×5）已於 2026-09-13 入庫（見上）
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
