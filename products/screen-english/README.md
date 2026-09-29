# 追劇英語（Screen English）

「名人詞彙」的姐妹作品，但素材不是名人演講，而是**美劇台詞與 YouTube／Podcast 等休閒影片**——教的是角色、主持人實際說出口的道地口語、俚語、流行語，跟名人詞彙的「正式場合進階字」互為對照。依 CEFR（A2–C1）分級，機制沿用 [`../general-vocab`](../general-vocab)。

- 原始碼：[`screen-english.html`](screen-english.html)（介面與互動邏輯）
- 詞彙資料：[`cards_data.json`](cards_data.json)（3 字，唯一資料來源；不要再把卡片複製進 HTML）
- 每日挑戰行程：[`daily_schedule.json`](daily_schedule.json)（日期 → 3 個卡片 id）

**目前狀態：種子／試水溫階段（3 張卡，1 部作品）**，尚未連到首頁導覽，先驗證框架跑得通，再決定要不要擴充、要不要上首頁。

## 資料怎麼來的

1. 來源分兩類（`source_type` 欄位標記）：`tv_drama`（美劇台詞）、`casual_video`（YouTube／Podcast 等休閒影片）
2. 每張卡只引用**單句對白／短句**，不放整段場景或連續多句劇本；附劇名／影片、平台、出處連結（`show` / `platform` / `source_url`，可選 `timestamp`），非商業教育用途
3. 第一批 3 字來自 *Silicon Valley*（HBO）第 5 季一段虛構 Bloomberg 訪談橋段（Jared Dunn 的「馬糞類比」）：manure、flocking、obliterate。逐字稿與角色由使用者提供的 YouTube 剪輯（`lol Valley` 頻道）核對；`date` 欄位是**該剪輯的 YouTube 發布日期（2018-04-24）**，不是原劇集播出日——原播出集數尚未逐一核對，暫不作為事實標註
4. 為每個字補上詞性、CEFR 猜測難度、中文翻譯、英文釋義、同義詞，並保留原句作為例句

## 功能（沿用 general-vocab 的機制，暫不含小遊戲）

- 每日挑戰：每天 3 張卡由編輯排在 `daily_schedule.json`，開卡包動畫，累積連續天數。未來已排程日不能提前開啟；沒排到的日子顯示「尚未公布」
- 三面卡：字 → 定義＋原句引用 → 角色／劇名／平台／出處連結／同義詞
- 滑卡模式、整理瀏覽（可依 CEFR／角色篩選）、間隔複習模式（記得／忘記，存在瀏覽器本機；依 1、3、7 天與動態延長的間隔再次出現）
- 「稀有度」直接對應 CEFR 難度：A2/B1＝普通，B2＝稀有，C1＝傳說
- 跨裝置連續天數同步：匯出／匯入代碼（與名人詞彙／金句同一套 `LearningCore`，各產品 localStorage key 不同）
- 刻意**不做**小遊戲（EN-ZH／ZH-EN 選擇題）：那是名人詞彙的既有決定，這裡先不跟進，等內容量夠再評估

## 待辦 / 可擴充方向

- [ ] 只有 3 張種子卡、1 個角色（Jared Dunn）、1 部作品（Silicon Valley）——下一步是擴充到 10–15 張再評估要不要上首頁
- [ ] 補第二類來源（`casual_video`：YouTube／Podcast），驗證兩種來源在同一套 schema 下都好用
- [ ] Silicon Valley 這段台詞的原劇集季集尚未逐一核對，只用 YouTube 剪輯發布日期當出處日期；之後若要标注正式集數，需要對照官方或字幕組資料源
- [ ] 版權立場：短句引用＋標明出處＋非商業教育用途（跟語錄牆／名人詞彙的公開演講引用不同，劇本對白是創作內容，版權風險層級較高，維持保守作法）
- [ ] 評估要不要在首頁加第三張產品卡片、要不要跟另外兩個產品共用導覽

加下一個月的每日挑戰：編輯 [`daily_schedule.json`](daily_schedule.json)，每個日期寫恰好 3 個不重複、且存在於 `cards_data.json` 的 id，存檔後跑 `npm run validate`。
