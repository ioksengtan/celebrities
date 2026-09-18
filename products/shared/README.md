# 共用學習核心

`learning-core.js` 是兩個純前端產品共用、且不依賴框架的瀏覽器模組。它集中管理：

- 本地日期與日期運算
- 依 `daily_schedule.json` 還原某日挑戰牌組（不使用日期種子抽卡）
- 洗牌與連續天數計算
- 跨裝置進度代碼的編解碼（完成日、今日已開卡、金句封存）
- 名人詞彙（Executive English）的間隔複習排程與舊資料遷移

卡片資料仍由各產品的 `cards_data.json` 擁有；每日挑戰行程在旁邊的 `daily_schedule.json`（日期 → 卡片 id）。共用欄位契約集中在 `content-schema.json`，由 `tools/validate-content.mjs` 驗證。執行 `npm run validate` 會檢查必填欄位、連續且唯一的 ID、重複詞條、日期、講者、分類、CEFR／稀有度映射、HTML 是否載入指定 JSON、間隔複習的 1／3／7 天排程，以及每日行程的張數／id／重複。GitHub Actions 會在每次 push 與 pull request 自動執行同一套驗證。

編輯下一個月的每日挑戰：在對應產品的 `daily_schedule.json` 新增 `"YYYY-MM-DD": [id, …]`（金句恰好 3 張、名人詞彙恰好 5 張，id 須存在且當天不重複），然後跑 `npm run validate`。
