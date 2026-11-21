# 名人詞彙（Executive English）

從 Jensen Huang、Elon Musk、Sundar Pichai、Mark Zuckerberg 等人 2025–2026 年演講/訪談逐字稿中萃取的**一般英語**詞彙卡——刻意排除 AI/晶片黑話，只留下他們談話時順口用出來、對一般英語學習者有用的進階字（如 exponential、inflection point、geopolitical、guardrails）。依 CEFR（A2–C1）分級，卡片形式沿用 [`../vocabulary-cards`](../vocabulary-cards) 的機制，但把「類別＋講者」的篩選軸換成「CEFR 難度＋講者」。

- 原始碼：[`executive-english.html`](executive-english.html)（介面與互動邏輯）
- 詞彙資料：[`cards_data.json`](cards_data.json)（195 字，唯一資料來源；不要再把卡片複製進 HTML）
- 每日挑戰行程：[`daily_schedule.json`](daily_schedule.json)（日期 → 5 個卡片 id）

## 資料怎麼來的

1. 抓取 14 場公開逐字稿全文（rev.com、singjupost.com、stratechery.com、blog.google 等，CNBC/Bloomberg/Axios 等站點會擋爬蟲，暫時抓不到；第 14 場為 Jensen Huang 在 2026-09-02 G20 Innovation Ministerial 的爐邊對談，來自 YouTube 新聞英語頻道的逐字稿）
2. 用字頻比對排除常見兩萬字（Google 10000-word 英語常用詞表）找出候選字
3. 人工篩選：排除純技術黑話（token、qubit、gigawatt...）、排除不當內容（Elon Musk 訪談裡的政治爭議句與髒話），只留有一般教學價值的字
4. 為每個字補上詞性、CEFR 猜測難度、中文翻譯、英文釋義、同義詞，並保留原句作為例句

## 功能（沿用 vocabulary-cards 的機制）

- 每日挑戰：每天 5 張卡由編輯排在 `daily_schedule.json`，開卡包動畫，C1 難度字有金色特效，累積連續天數。未來已排程日不能提前開啟；沒排到的日子顯示「尚未公布」
- 三面卡：字 → 定義＋原話例句 → 出處（講者/場合/日期）與同義詞
- 滑卡模式、整理瀏覽（可依 CEFR／講者篩選）、間隔複習模式（記得／忘記，存在瀏覽器本機；依 1、3、7 天與動態延長的間隔再次出現）
- 「稀有度」直接對應 CEFR 難度：A2/B1＝普通，B2＝稀有，C1＝傳說

## 本機標記（星號／太簡單）

- 每張卡附「星號」與「太簡單」兩個鈕，互斥、可取消，存在這台裝置的瀏覽器
  （`localStorage` 鍵 `exec-vocab-marks`，值為 `{ "<卡片id>": "star" | "easy" }`）。不進帳號、不進「同步」代碼。
- 整理瀏覽、測驗、小遊戲多一列「標記」篩選：全部／星號／太簡單／未標記（單選，可與 CEFR、講者併用）。
- 測驗與小遊戲（含疊字方塊）會略過「太簡單」卡，並讓「星號」卡優先或較常出現。
- 每日挑戰仍完全依 `daily_schedule.json` 顯示當天 5 張，不因標記而隱藏、抽換或加卡；開卡後才顯示標記鈕。
- 「重置複習進度」只清複習資料（`exec-vocab-known`），不清標記。

## KK 音標與發音

- 卡片正面在英文詞下方顯示 KK 音標（`cards_data.json` 的 `kk` 欄位，有內容才顯示，長音標會換行）。
- 英文詞旁有喇叭圖示，點一下用瀏覽器內建 `speechSynthesis` 以美式英語（`en-US`）朗讀該詞（片語則朗讀整句）；
  不支援語音合成或偵測不到英語語音時，喇叭圖示隱藏。不新增、不下載任何音檔，不呼叫外部發音服務。
- 音標來源與轉寫方式見 [`../../references/cmu-pronouncing-dictionary/`](../../references/cmu-pronouncing-dictionary/)：
  由 CMU Pronouncing Dictionary 0.7b（2-clause BSD）美式發音經 ARPAbet→KK 對照表轉寫，附授權全文與來源說明。
  片語、連字號詞、CMU 查無、或難以機械判定重音者一律留空（`kk`、`kk_source` 皆為空字串），不憑空編造。
  補齊或修訂音標的流程：`node tools/cmu-to-kk.mjs <cmudict-0.7b 路徑>`，存檔後再跑 `npm run validate`。

## 待辦 / 可擴充方向

- [ ] CEFR 分級目前是常識估計，未對照權威詞表（如 English Vocabulary Profile）校正
- [ ] Sam Altman 的逐字稿目前抓不到（CNBC/Bloomberg/Axios/dealroom.co 擋爬蟲）。Mark Zuckerberg 已收 Cheeky Pint Podcast（2026-10-12）6 張卡（id 188–193）
- [ ] 例句是原話輕微清理過的版本，不是逐字稿的機器摘要，但也還沒有人工二次校對
- [ ] 與 [`../vocabulary-cards`](../vocabulary-cards) 目前各自獨立記錄每日挑戰進度（不同 localStorage key），尚未實作「兩個 app 部署同網域＋共用 streak」
- [ ] 評估做成可安裝 PWA、跨裝置同步進度

加下一個月的每日挑戰：編輯 [`daily_schedule.json`](daily_schedule.json)，每個日期寫恰好 5 個不重複、且存在於 `cards_data.json` 的 id，存檔後跑 `npm run validate`。
