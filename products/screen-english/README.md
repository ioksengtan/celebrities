# 追劇英語（Screen English）

「名人詞彙」的姐妹作品，但素材不是名人演講，而是**影集台詞、遊戲節目與 YouTube／Podcast 等休閒影片**——教的是角色、主持人實際說出口的道地口語、俚語、流行語，跟名人詞彙的「正式場合進階字」互為對照。例句由本站自編；原句只短摘。依 CEFR（A2–C1）分級，機制沿用 [`../general-vocab`](../general-vocab)。

- 原始碼：[`screen-english.html`](screen-english.html)（介面與互動邏輯）
- 詞彙資料：[`cards_data.json`](cards_data.json)（6 字，唯一資料來源；不要再把卡片複製進 HTML）
- 每日挑戰行程：[`daily_schedule.json`](daily_schedule.json)（日期 → 3 個卡片 id）

**目前狀態：種子／試水溫階段（6 張卡，2 個來源）**，尚未連到首頁導覽，先驗證框架跑得通，再決定要不要擴充、要不要上首頁。

## 資料怎麼來的

1. 來源分三類（`source_type` 欄位標記）：`tv_drama`（影集台詞）、`game`（遊戲節目）、`casual_video`（YouTube／Podcast 等休閒影片）
2. `example` 一律是本站自編例句，用來練習單字，不把原句當例句。原句若要保留，放在 `quote`（沒有原句就留空字串）。同一部影集的同一集，全部卡片的 `quote` 加總最多兩句，避免拼回一整段獨白。每張卡都有版權聲明（`copyright`）與 `line_verified`：只有對過官方字幕才設為 `true`，否則為 `false`
3. 影集卡不放影片連結。改記 `season`、`episode`、`episode_title`。三個欄位要嘛都已核對，要嘛都填 `待查`，不猜。已核對時附上 `episode_sources`，其中必須有維基百科。`date` 用該集首播日
4. 第一批 3 字（`tv_drama`）來自 *Silicon Valley*（HBO，台灣譯名《矽谷群瞎傳》）第 5 季第 5 集 *Facial Recognition*（2018-04-22 首播）。季數、集數、集名與首播日依[維基百科第五季條目](https://en.wikipedia.org/wiki/Silicon_Valley_(season_5))；糞肥類比出現在該集 Emily Chang 的虛構 Bloomberg 訪談，依 [Vulture 該集劇評](https://www.vulture.com/2018/04/silicon-valley-recap-season-5-episode-5.html)。manure、flocking 各留一句既有原句，obliterate 不再收錄原句。原句尚未對照官方字幕，`line_verified` 為 `false`。不再連結非官方剪輯頻道
5. 第二批 3 字（`game`，不是影集）來自 Founders Fund 出品的遊戲節目 *MAFIA the GAME* 第一集（Sam Altman、Palmer Luckey、Bryan Johnson 等人真人參與，主持人 Mike 旁白）：riddled with、unanimous、charred。官方頻道連結保留，原句改放 `quote`，例句改為自編，且不寫死亡、槍擊或燒焦遺體。`date` 仍是官方頻道上片日期（2026-06-04）。主持人姓氏未經一手來源證實，卡片只標「Mike」，不補上未證實的姓氏。原句尚未對照官方字幕，`line_verified` 為 `false`
6. 每個字另有詞性、CEFR 猜測難度、中文翻譯、英文釋義、同義詞

## 功能（沿用 general-vocab 的機制，暫不含小遊戲）

- 每日挑戰：每天 3 張卡由編輯排在 `daily_schedule.json`，開卡包動畫，累積連續天數。未來已排程日不能提前開啟；沒排到的日子顯示「尚未公布」
- 三面卡：字 → 定義＋自編例句（有原句才另附短摘） → 角色／作品／季集或官方連結／版權聲明／同義詞
- 滑卡模式、整理瀏覽（可依 CEFR／角色篩選）、間隔複習模式（記得／忘記，存在瀏覽器本機；依 1、3、7 天與動態延長的間隔再次出現）
- 「稀有度」直接對應 CEFR 難度：A2/B1＝普通，B2＝稀有，C1＝傳說
- 跨裝置連續天數同步：匯出／匯入代碼（與名人詞彙／金句同一套 `LearningCore`，各產品 localStorage key 不同）
- 刻意**不做**小遊戲（EN-ZH／ZH-EN 選擇題）：那是名人詞彙的既有決定，這裡先不跟進，等內容量夠再評估

## 待辦 / 可擴充方向

- [ ] 只有 6 張種子卡、2 個角色（Jared Dunn、Mike）、2 部作品——下一步是擴充到 15–20 張再評估要不要上首頁
- [x] 補遊戲來源（`game`）。*MAFIA the GAME* 由休閒影片改標為遊戲，官方連結保留（2026-11-04）
- [x] Silicon Valley 第 5 季第 5 集 *Facial Recognition* 已依維基百科與 Vulture 該集劇評核對；影集卡不再附非官方影片連結，同一集原句最多兩句（2026-11-04）
- [ ] MAFIA the GAME 主持人的姓氏未經一手來源證實，暫只標「Mike」；逐字稿裡玩家台詞也因為說話者標記缺失，這批先只取旁白（主持人）台詞，沒有把台詞歸到 Sam Altman／Palmer Luckey／Bryan Johnson 等真人名下，避免誤植真人發言
- [ ] 版權立場：影集不放影片、同一集最多兩句原句，其餘例句自編；遊戲保留官方連結，原句與自編例句分開。兩類都附版權聲明，並標明原句尚未對照官方字幕。劇本對白與遊戲旁白是創作內容，維持保守作法
- [ ] 評估要不要在首頁加第三張產品卡片、要不要跟另外兩個產品共用導覽

加下一個月的每日挑戰：編輯 [`daily_schedule.json`](daily_schedule.json)，每個日期寫恰好 3 個不重複、且存在於 `cards_data.json` 的 id，存檔後跑 `npm run validate`。
