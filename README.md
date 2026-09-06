# celebrities

以科技名人（Jensen Huang、Elon Musk、Sam Altman、Sundar Pichai、Mark Zuckerberg 等）2024–2026 年的演講/訪談為素材，開發一系列產品：導讀摘要、單字學習卡、資料視覺化等。團隊協作與進度都存放在這個 GitHub repo。

## 目錄結構

```
references/          原始資料與規劃文件
  speeches_database.json         30 場演講的完整 metadata
  speeches_indexes.json          7 種索引視圖（主題／時間軸／類型...）
  product_recommendations.json   6 個候選產品（PROD-001~006）與技術棧建議
  美國大學畢業典禮名人演講專案報告（完整版）.docx   完整專案報告

products/            各產品的原型與原始碼，一個產品一個資料夾
  vocabulary-cards/               PROD-002 名人單字卡（已有可運行雛形）
  general-vocab/                  Executive English：從演講逐字稿萃取的一般英語 CEFR 分級詞彙卡

docs/
  PROGRESS.md        團隊討論與進度紀錄
```

## 目前狀態

- ✅ 資料庫與產品建議已整理進 `references/`
- ✅ PROD-002「名人單字卡」MVP 已完成，見 [`products/vocabulary-cards`](products/vocabulary-cards)
- ✅ Executive English（一般英語 CEFR 詞彙卡）第一版已完成，見 [`products/general-vocab`](products/general-vocab)
- ⬜ 其他候選產品（導讀摘要、時間軸可視化、每日一句、主題深度分析、演講比較）尚未開始

## 協作方式

- 進度與討論寫在 [`docs/PROGRESS.md`](docs/PROGRESS.md)，每次有進展或決策就補一筆
- 新產品開發放在 `products/<product-name>/` 底下，各自附一份簡短 README 說明狀態與連結
- 資料如有更新（新演講、新語錄、逐字稿），更新 `references/` 下對應的 JSON 檔
