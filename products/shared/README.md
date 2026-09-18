# 共用學習核心

`learning-core.js` 是兩個純前端產品共用、且不依賴框架的瀏覽器模組。它集中管理：

- 本地日期與日期運算
- 固定日期種子的每日抽卡
- 洗牌與連續天數計算
- 跨裝置進度代碼的編解碼
- 名人詞彙（Executive English）的間隔複習排程與舊資料遷移

卡片資料仍由各產品的 `cards_data.json` 擁有，並作為唯一資料來源；共用欄位契約集中在 `content-schema.json`，由 `tools/validate-content.mjs` 驗證。執行 `npm run validate` 會檢查必填欄位、連續且唯一的 ID、重複詞條、日期、講者、分類、CEFR／稀有度映射、HTML 是否載入指定 JSON，以及間隔複習的 1／3／7 天排程。GitHub Actions 會在每次 push 與 pull request 自動執行同一套驗證。
