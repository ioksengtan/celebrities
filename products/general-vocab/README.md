# Executive English（一般英語進階詞彙）

從 Jensen Huang、Elon Musk、Sundar Pichai 2025–2026 年演講/訪談逐字稿中萃取的**一般英語**詞彙卡——刻意排除 AI/晶片黑話，只留下他們談話時順口用出來、對一般英語學習者有用的進階字（如 exponential、inflection point、geopolitical、guardrails）。依 CEFR（A2–C1）分級，卡片形式沿用 [`../vocabulary-cards`](../vocabulary-cards) 的機制，但把「類別＋講者」的篩選軸換成「CEFR 難度＋講者」。

- 原始碼：[`executive-english.html`](executive-english.html)（單一 HTML 檔，機制同 vocabulary-cards）
- 詞彙資料：[`cards_data.json`](cards_data.json)（145 字，僅供參考／備份，實際資料內嵌在 html 裡）

## 資料怎麼來的

1. 抓取 14 場公開逐字稿全文（rev.com、singjupost.com、stratechery.com、blog.google 等，CNBC/Bloomberg/Axios 等站點會擋爬蟲，暫時抓不到；第 14 場為 Jensen Huang 在 2026-09-02 G20 Innovation Ministerial 的爐邊對談，來自 YouTube 新聞英語頻道的逐字稿）
2. 用字頻比對排除常見兩萬字（Google 10000-word 英語常用詞表）找出候選字
3. 人工篩選：排除純技術黑話（token、qubit、gigawatt...）、排除不當內容（Elon Musk 訪談裡的政治爭議句與髒話），只留有一般教學價值的字
4. 為每個字補上詞性、CEFR 猜測難度、中文翻譯、英文釋義、同義詞，並保留原句作為例句

## 功能（沿用 vocabulary-cards 的機制）

- 每日挑戰：每天固定 5 張卡（依日期做種子），開卡包動畫，C1 難度字有金色特效，累積連續天數
- 三面卡：字 → 定義＋原話例句 → 出處（講者/場合/日期）與同義詞
- 滑卡模式、整理瀏覽（可依 CEFR／講者篩選）、測驗模式（認識/還不熟，存在瀏覽器本機）
- 「稀有度」直接對應 CEFR 難度：A2/B1＝普通，B2＝稀有，C1＝傳說

## 待辦 / 可擴充方向

- [ ] CEFR 分級目前是常識估計，未對照權威詞表（如 English Vocabulary Profile）校正
- [ ] Sam Altman、Mark Zuckerberg 的逐字稿目前抓不到（CNBC/Bloomberg/Axios/dealroom.co 擋爬蟲），詞庫暫時只有三位講者
- [ ] 例句是原話輕微清理過的版本，不是逐字稿的機器摘要，但也還沒有人工二次校對
- [ ] 與 [`../vocabulary-cards`](../vocabulary-cards) 目前各自獨立記錄每日挑戰進度（不同 localStorage key），尚未實作「兩個 app 部署同網域＋共用 streak」
- [ ] 評估做成可安裝 PWA、跨裝置同步進度
