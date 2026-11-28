# References

Source data and planning docs behind the CEO/celebrity-speech products.

## Core feed (week1 / P0)

| File | Role | On this branch |
| --- | --- | --- |
| `healthy_seven_feed.json` | 7 speeches + `quotes_wall` 35 | Y |
| `quotes_index_key_quotes_migration.json` | 7 KQ → verified | Y |
| `content_review_flags.json` | 4 `speech_id` excluded from wall | Y |
| `p0_quotes_draft.json` | 16 drafts, written as verified | Y |
| `w1_continue_quotes_draft.json` | 10 drafts (JH-2025-001×5, EM-2026-004×5) | **Y — draft→verified** |
| `week2_quotes_to_merge_verified.json` | 15 verified (EM-2026-002×5, MZ-2024-001×5, SP-2025-002×5) | **Y — merged** |
| `week3_quotes_to_merge_verified.json` | 20 verified (MZ-2024-001×5, MZ-2025-001×5, SA-2026-002×5, JH-2026-006×5) | **Y — merged** |
| `week3_quotes_draft_hold.json` | 4 drafts (SA-2026-001×4)；未 verified、不上牆 | **Y — draft only** |
| `speech_aliases.json` | EM-2026-003 → EM-2026-002（同一場，不重複上架） | **Y** |
| `sa_2025_001_quotes_draft.json` | 5 Bloomberg drafts → verified | Y |
| `prod001_summary_zh_draft.json` | 4 Chinese speech summaries | Y |
| `quotes_index.json` | Merged wall/speech feed (upsert by `quote_id` or `speech_id`+quote) | Y |

Hold this round (never verified on the wall): `EM-2026-005`, `SA-2026-001`.

## Other

- `speeches_database.json` — 49 speeches/interviews (including one undated interview) metadata.
- `speeches_indexes.json` — 7 derived index views.
- `product_recommendations.json` — candidate product ideas.
- `美國大學畢業典禮名人演講專案報告（完整版）.docx` — full project report.

## Satya Nadella interview import (2026-09-19)

- `SN-UNDATED-001`: user-provided transcript; event date unknown, not the import date. Speech `verification_status` is `transcript_text_verified` (checked against a user-provided transcript, no longer stored in this repository; not video-verified).
- Timestamp index (no transcript text): `transcripts/SN-UNDATED-001.txt`; Traditional Chinese editorial: `editorials/SN-UNDATED-001.md`.
- Five timestamped quotes are in `quotes_index.json`. `SN-UNDATED-001-Q01`, `Q02`, `Q03`, and `Q04` are `verified` after matching the user-provided transcript (no longer stored in this repository) at timestamps 26:27, 11:31, 09:49, and 08:13. Q02’s English quote now includes the capability-overhang continuation. `Q05` remains `draft` (`why_notable_zh` strengthened; English quote and `quote_zh` unchanged) and stays off the verified wall. No full YouTube re-listen.
- Speech page: `products/core/speech.html?id=SN-UNDATED-001`. The default list includes featured speeches and speeches with verified quotes, so this interview now appears there via Q01 / Q02 / Q03 / Q04.

## Lip-Bu Tan interview import (2026-09-29)

- `LBT-2026-001`: A Bit Personal podcast (Jodi Shelton), published 2026-09-24. `source_type` is `publisher_auto_transcript` (Substack auto-transcript; not fully audio-verified).
- Timestamp index (no transcript text): `transcripts/LBT-2026-001.txt`; Traditional Chinese editorial: `editorials/LBT-2026-001.md`.
- Six timestamped quotes are in `quotes_index.json`. `LBT-2026-001-Q01`, `Q02`, `Q03`, `Q04`, and `Q06` are `verified` as exact substrings of the Substack auto-transcript on the episode page. `Q05` stays `draft` (reported speech from a mentor) and stays off the verified wall. Quote text and status were not edited.
- Speech page: `products/core/speech.html?id=LBT-2026-001`. Verified quotes appear on the quotes wall under speaker `lbt`.

## Jeff Bezos speeches import (2026-09-30)

- Nine original speeches, `JB-2001-001` through `JB-2020-001`. Timestamp indexes are in `transcripts/JB-*.txt`. This batch has no editorials and no Chinese summaries; the speech page already shows「此場尚無短摘要」when `summary_zh` is absent.
- `source_type` `official_transcript` (host or publisher transcript) and `platform_auto_captions` (YouTube auto-captions), plus `timestamp_precision` `caption_word_alignment`, are accepted. The content validator enumerates `source_type` only for Screen English cards (`tv_drama`, `casual_video`), not for speeches or quotes, so the schema was not changed.
- Seventeen quotes are in `quotes_index.json`. Sixteen are `verified` as exact substrings of the excerpt used at import time (the repository now keeps only timestamp indexes). `JB-2017-002-Q03` stays `draft` (filler “um”; sentence boundary not re-listened) and stays off the verified wall. Quote text and status were not edited.
- Vanity Fair (`JB-2016-001`) uses the event date 2016-10-20.
- Speech pages: `products/core/speech.html?id=JB-2010-001` (and the other `JB-*` ids). Verified quotes appear on the quotes wall under speaker `jb`.

## Eric Schmidt and Yann LeCun import (2026-10-04)

- Two original speeches: `ES-2026-001` (Inside Blackstone, 2026-09-29, `duration_minutes` 33) and `YL-2026-001` (Sciences Po Grande Conférence, 2026-09-16, French). Timestamp indexes are in `transcripts/ES-2026-001.txt` and `transcripts/YL-2026-001.txt`. `ES-2026-001` now has a Traditional Chinese editorial at `editorials/ES-2026-001.md` and a Chinese short summary (added 2026-10-08). `YL-2026-001` still has no editorial and no Chinese summary.
- Twelve quotes are in `quotes_index.json`, all `verified`, and each quote was a verbatim substring of its excerpt at import time (now replaced by a timestamp index). Quote text, translations, and status were not edited.
- Eric Schmidt quotes use `source_type` `official_transcript`. Yann LeCun quotes use `source_type` `platform_auto_captions` (French auto-captions cross-checked with a transcription). No new `source_type` value was added.
- Non-English quotes may set `quote_lang` (BCP 47; absent means `en`) and `quote_en` (required when `quote_lang` is not `en`, and absent when it is `en`). The six Yann LeCun quotes are `quote_lang: "fr"`; `quote` is the French original, and `quote_en` / `quote_zh` are translations. `tools/validate-content.mjs` checks that pair of rules.
- Speech pages: `products/core/speech.html?id=ES-2026-001` and `products/core/speech.html?id=YL-2026-001`. Verified quotes appear on the quotes wall under speakers `es` and `yl`.

## Mark Zuckerberg Cheeky Pint 入庫（2026-10-15）

- `MZ-2026-001`：Cheeky Pint 播客當集，官方標題〈Muse Wonder: Zuckerberg and Wang's $100B AI〉。YouTube 官方頻道於 2026-10-12（美國太平洋時間 14:10）發布，官方 Substack 同日刊出全文逐字稿。主持是 Stripe 共同創辦人 John Collison。來賓是 Mark Zuckerberg 與 Meta 首席人工智慧長 Alexandr Wang（領導 Meta Superintelligence Labs）。錄製日期與地點未載明。分享時流傳的標題「How Zuckerberg is building superintelligence」官方未見，只寫在 `notes_zh`，不是正式名稱。
- 時間戳記索引：`transcripts/MZ-2026-001.txt`。本批沒有導讀，也沒有中文短摘要。長度記為 135 分鐘（片長 2:14:31），`word_count_estimate` 27000 是整份逐字稿三人合計。
- 六則語錄都在 `quotes_index.json`，狀態都是 `verified`，原文照交付檔逐字寫入，沒有改任何一個字。來源類型用既有的 `official_transcript`，時間碼精度用既有的 `caption_word_alignment`。沒有新增 `source_type`。六則都不帶 `quote_lang`，等同英文。
- Mark Zuckerberg 是既有講者，沒有新增講者、沒有改講者色、沒有做詞彙卡。Alexandr Wang 本批不新增為講者。
- 單場頁：`products/core/speech.html?id=MZ-2026-001`。已核實語錄出現在語錄牆，講者代碼沿用既有的 `mz`。

## Sam Altman Vanity Fair 與 CNBC 入庫（2026-10-17）

- `SA-2026-007`：Vanity Fair「Fair Game」〈Sam Altman Sees the Future. Are We In It? (Part 1 of 2)〉。官方頁面於 2026-10-05 刊出影片與全文逐字稿（頁面註明經輕度編輯）。官方說明有 9/11 與 10/2 兩次錄製，第一集未註明是哪一次。YouTube 片長 49:29，記為 49 分鐘。時間戳記索引：`transcripts/SA-2026-007.txt`。`source_type` 用既有的 `official_transcript`。五則語錄全部 `verified`，原文照交付檔逐字寫入。
- `SA-2026-008`（2026-11-16 補上導讀 `editorials/SA-2026-008.md` 與中文短摘要）：CNBC「Halftime Report」記者 Kate Rooney 於 OpenAI DevDay 2026 現場專訪，日期 2026-09-29，長度記 10 分鐘。CNBC 網站同日刊出的逐字稿標示為 unofficial transcript。影片分兩段：第 1 段放 `video_url`，第 2 段放既有欄位 `audio_url`。時間戳記索引：`transcripts/SA-2026-008.txt`。五則語錄全部 `verified`，原文照交付檔逐字寫入。每則 `source_url` 指向所在那一段，`timestamp` 為該段影片內時間。
- 新增值 `source_type`：`broadcaster_unofficial_transcript`。意思是廣播媒體自己的逐字稿，並標示為非官方，語錄已對音訊逐字核對（a broadcaster's own transcript labelled unofficial, with quotes verified word for word against the audio）。SA-2026-008 使用這個值。內容驗證器目前只對追劇英語卡片檢查 `source_type` 列舉，演講庫與語錄索引沒有列舉檢查，因此這次沒有改 `tools/validate-content.mjs`。
- Sam Altman 是既有講者（`sam_altman`／語錄牆代碼 `sa`）。沒有新增講者，沒有改講者色，沒有做詞彙卡。
- 單場頁：`products/core/speech.html?id=SA-2026-007`、`products/core/speech.html?id=SA-2026-008`。已核實語錄出現在語錄牆，講者代碼沿用既有的 `sa`。

## Sam Altman Cheeky Pint 入庫（2026-11-12）

- `SA-2026-009`：Cheeky Pint 播客當集，官方標題〈Why Sam Altman is against a single superintelligence〉。YouTube 官方頻道與官方 Substack 於 2026-10-29（美國發布日）刊出影片與全文逐字稿。主持是 Stripe 共同創辦人 John Collison，來賓是 OpenAI 執行長 Sam Altman。錄製日期與地點未載明。片長 52:45，記為 53 分鐘；逐字稿約 10000 詞。
- 時間戳記索引：`transcripts/SA-2026-009.txt`。導讀：`editorials/SA-2026-009.md`（五段，含文末中文短摘要），`prod001_summary_zh_draft.json` 最後加上本場中文短摘要一列。
- 六則語錄都在 `quotes_index.json`，狀態都是 `verified`，原文照交付檔逐字寫入，沒有改任何一個字。六則都是 `quote_lang: "en"`，不帶 `quote_en`。來源類型用既有的 `official_transcript`，時間碼精度用既有的 `caption_word_alignment`。沒有新增 `source_type`。
- Sam Altman 是既有講者（`sam_altman`／語錄牆代碼 `sa`）。沒有新增講者，沒有改講者色，沒有做詞彙卡。
- 單場頁：`products/core/speech.html?id=SA-2026-009`。

## Satya Nadella The Pragmatic Engineer 入庫（2026-11-19）

- `SN-2026-001`：The Pragmatic Engineer 播客當集，官方標題〈Software engineering after code becomes cheap with Satya Nadella〉，Gergely Orosz 主持，來賓 Microsoft 執行長 Satya Nadella。官方節目頁日期 2026-11-16，註記錄製於 Redmond；片長約 62 分 40 秒，記為 63 分鐘。主要出處為官方節目頁 https://newsletter.pragmaticengineer.com/p/software-engineering-after-code-becomes 與官方影片 https://www.youtube.com/watch?v=0NE89Nzfk20 。合併前已重查主線編號，主線先前只有 `SN-UNDATED-001`，未撞號。
- 講者 `satya_nadella` 主檔與索引職稱由「Chairman & CEO (as identified in supplied transcript)」改為「Chairman & CEO」，依據官方節目頁。沒有新增講者、沒有改講者色、本場未做詞彙卡。
- 本輪語錄牆只收兩則：`SN-2026-001-Q02`、`SN-2026-001-Q06`。文字取自官方節目頁 takeaways 第 11、12 點中、由主持人 Gergely Orosz 以引號整理呈現的句子（Q06 的 talk／do 依官方頁用 curly 引號、句尾為「I would.」），屬節目頁筆記而非講者逐字口語，卡片標示「據 The Pragmatic Engineer 節目頁筆記」。`source_url` 指向官方節目頁；`timestamp` 與影片 `&t=` 連結僅供定位對應段落。`status` 為 `pending_human_check`。
- 新增 `source_type` 值 `host_page_note`（主持人節目頁筆記）。這次更新了內容驗證器：`products/shared/content-schema.json` 新增 `quotesIndex.sourceTypes` 列舉，`tools/validate-content.mjs` 對 `quotes_index.json` 的 `source_type` 逐筆檢查並附自我測試（`host_page_note` 應收、未知值應擋、未填不報錯）。既有五種語錄來源類型維持不變。
- Q01、Q03、Q04、Q05 本輪不進 `quotes_index.json`；`transcripts/SN-2026-001.txt` 只存時間戳記索引（語錄編號、時間碼、官方章節與連結），不含逐字稿文字；導讀：`editorials/SN-2026-001.md`（六段，含文末中文短摘要）。
- 單場頁：`products/core/speech.html?id=SN-2026-001`。兩則語錄出現在語錄牆，講者代碼沿用既有的 `sn`。語錄牆與單場頁的呈現條件放寬：`host_page_note` 語錄即使狀態尚未升級，只要已標示來源即可呈現（`products/core/core.js`）。

## Satya Nadella × Young Sohn XTC AI:360 Summit 入庫（2026-11-26）

- `SN-2026-002`：Extreme Tech Challenge（官方簡稱 XTC）2026 年 AI:360 Summit 的開場對談（virtual fireside chat），Microsoft 董事長暨執行長 Satya Nadella 與 Walden Catalyst Ventures 創始管理合夥人、XTC 共同創辦人 Young Sohn 對談。官方活動頁 https://extremetechchallenge.org/news/introducing-the-ai360-summit/ 寫日期 Thursday, November 19, 2026、地點 Palo Alto, California、邀請制，Nadella 標 Virtual（遠距）。`date` 採活動日 2026-11-19。紀錄影片由 Walden Catalyst 官方 YouTube 頻道發布（https://www.youtube.com/watch?v=K5OtollKubk ，上傳 2026-11-23 本地時間、台北時間 2026-11-24 03:54，片長 644 秒＝10 分 44 秒，進位 11 分鐘）。開拉取請求前已重查主線編號，主線先前只有 `SN-UNDATED-001`、`SN-2026-001`，`SN-2026-002` 未撞號。
- 對談者 Young Sohn 以新增的 `interlocutor` 欄位記錄（另有 `interlocutor_title`），並顯示在 `event` 標題與單場頁 meta 行（`products/core/speech.html` 的 metaLine 新增「對談者：…」）。沒有把 Young Sohn 新增為講者，語錄也不收 Young Sohn。
- **本場收 6 則只屬 Satya Nadella 的語錄**（`SN-2026-002-Q01`…`Q06`）：沒有官方逐字稿、沒有 YouTube 官方章節、說明欄亦無章節時間戳記；唯一字幕為 English (auto-generated)（`kind: asr`）平台自動字幕。時間碼改採「官方頁『字幕記錄』面板的肉眼抄錄＋面板截圖對照」（未下載影片、音訊或字幕檔，未請求 YouTube timedtext，未使用第三方轉寫站）；每則時間碼為該語錄所在自動字幕段的「段起點」（Q01=01:52、Q02=02:53、Q03=03:00、Q04=08:17、Q05=09:45、Q06=10:19）。語錄文字為該平台自動字幕的逐字子字串，牆／卡片引文僅去除 uh、you know 等贅字並以「…」標省略，未改字。據此另做詞彙卡：金句（Keynote Lexicon）3 張、名人詞彙（Executive English）6 張。
- `source_type` 誠實標 `platform_auto_captions`（唯一存在的字幕來源），不標 `official_transcript`。`verification_status` 為 `transcript_text_verified`：6 則已對官方頁面板自動字幕逐字核對為子字串，但時間碼僅到字幕段起點、且未對影片全片校聽，非 fully verified。平台自動字幕可標 verified 的依據：本庫既有 `JB-2015-001-Q01`（`source_type` 同為 `platform_auto_captions` 且 `status` 為 `verified`）為同類先例。
- 時間戳記索引（只存語錄編號、時間碼、官方影片定位連結，無逐字稿文字）：`transcripts/SN-2026-002.txt`；繁體中文導讀：`editorials/SN-2026-002.md`（引用這 6 則並標時間碼與來源限制）；短摘要：`prod001_summary_zh_draft.json` 的 `SN-2026-002`。
- 單場頁：`products/core/speech.html?id=SN-2026-002`（顯示 6 則語錄與時間碼）。逐則牆／卡片引文、自動字幕原文、時間點、來源網址（含 `&t=`）與查核時間的完整出處對照表另存於工作區草稿目錄，不提交進本庫。

## Reid Hoffman「AI-Native」對談入庫（2026-11-27）

- `RH-2026-001`：由 Aishwarya Srinivasan 自己發布的訪談（非轉載合輯），她在官方 Substack 稱此節目為 podcast「Ctrl + Alt + AI」，官方標題〈How to Future-Proof Your Career and Become AI-Native | Reid Hoffman〉。錄製場合為 Masters of Scale Summit 2026 現場，受訪者 Reid Hoffman（LinkedIn 共同創辦人、Greylock 合夥人）。官方活動頁 https://www.summit.mastersofscale.com/info 寫活動日期 2026-10-20 至 2026-10-22、地點舊金山 The Presidio Theatre、邀請與申請制。**日期寫法：錄於 Masters of Scale Summit 2026（2026-10-20 至 10-22，確切日期不明），2026-11-14 發布。** 本片 YouTube 觀看頁 `publishDate`／`uploadDate` 為 2026-11-13T23:01:33-08:00（台北時間 2026-11-14 15:01:33），片長 1844 秒＝30 分 44 秒（進位 31 分鐘）。`date` 採**已核實的發布日 2026-11-14（非錄製日）**；新增 `date_kind: "publish"`，頁面據此把此日期顯示成「2026年11月14日發布」（單場列表卡、單場詳情 meta、語錄牆／單場語錄卡），`formatDate` 全局行為不變、其他活動日場次不受影響。入庫前已重查主線編號，`RH-2026-001` 未撞號。
- 新增講者 `reid_hoffman`（本庫新講者）：代碼 `rh`，色票淺 `#1F5F7A`／深 `#6FB7CC`；`executive-english.html` 與 `keynote-lexicon.html` 補 `rh` 講者色。對談者 Aishwarya Srinivasan 以 `interlocutor`／`interlocutor_title` 記錄，顯示於 `event` 標題與單場頁 meta 行，未新增為講者，語錄也只收 Reid Hoffman。
- **本場收 6 則只屬 Reid Hoffman 的語錄**（`RH-2026-001-Q01`…`Q06`）：本場未找到官方逐字稿；有官方說明欄／播放器官方章節與官方 Substack 節目筆記時間點，但官方章節只作場次結構，不把章節起始秒數當語錄句子時間點。本片觀看頁字幕軌僅一條 English (auto-generated)（`kind: asr`）平台自動字幕。時間碼採「官方頁『字幕記錄』自動字幕面板各句所在字幕段的段起點＋面板截圖對照」（未下載影片、音訊或字幕檔，未請求 YouTube timedtext，未使用第三方轉寫站）；每則時間碼為字幕段起點（Q01=02:17＝137s、Q02=07:39＝459s、Q03=22:45＝1365s、Q04=23:25＝1405s、Q05=25:16＝1516s、Q06=28:56＝1736s）。語錄文字為該平台自動字幕的逐字子字串，牆／卡片引文僅去除 uh、you know、um、right? 等贅字並以「…」標省略，未改字；片頭 0:00–1:04 為剪輯預告（主持人所說不收，Q04 同句雖在預告約 0:54 出現仍採正片 23:25）。據此另做詞彙卡：金句（Keynote Lexicon）3 張、名人詞彙（Executive English）5 張。
- `source_type` 誠實標 `platform_auto_captions`（唯一存在的字幕來源），不標 `official_transcript`。`verification_status` 為 `transcript_text_verified`：6 則已對官方頁面板自動字幕逐字核對為子字串，但時間碼僅到字幕段起點、且未對影片全片校聽，非 fully verified。平台自動字幕可標 verified 的依據：本庫既有 `JB-2015-001-Q01`（`source_type` 同為 `platform_auto_captions` 且 `status` 為 `verified`）為同類先例。
- 時間戳記索引（只存語錄編號、時間碼、官方影片定位連結，無逐字稿文字）：`transcripts/RH-2026-001.txt`；繁體中文導讀：`editorials/RH-2026-001.md`（引用這 6 則並標時間碼與來源限制）；短摘要：`prod001_summary_zh_draft.json` 的 `RH-2026-001`。
- 詞彙卡排程：金句 id 78–80 排 2026-11-28，名人詞彙 id 202–206 排 2026-11-29，接續既有排程、不改動已排的 2026-11-27／2026-11-28。
- 單場頁：`products/core/speech.html?id=RH-2026-001`（顯示 6 則語錄與時間碼）。逐則牆／卡片引文、自動字幕原文、時間點、來源網址（含 `&t=`）與查核時間的完整出處對照表另存於工作區草稿目錄，不提交進本庫。本次只開拉取請求、不合併。

## Alan Kay《The Peterman Pod》訪談入庫（2026-11-28）

- `AK-2026-001`：Ryan Peterman 的節目 The Peterman Pod 第 E076 集，受訪者為圖靈獎得主 Alan Kay。YouTube 頁面標題〈Alan Kay (Turing Award Winner): Xerox PARC, Steve Jobs, Dijkstra〉；集數頁 https://www.developing.dev/p/e076-alan-kay 與 Apple Podcasts 另用〈Alan Kay: Steve Jobs, Xerox PARC, Marijuana〉，記於 `alternate_title`。**日期寫法：2026-11-23 發布，錄製日期不明（錄製地點亦不明）。** `date` 採已核實的發布日 2026-11-23（非錄製日），`date_kind: "publish"`，頁面顯示「2026年11月23日發布」；另以 `date_note_zh: "錄製日期不明"` 顯示於單場頁 meta 行（`speech.html` 新增讀取此欄，未設此欄的場次不受影響）。片長 3940 秒（播放器顯示 1:05:39），記 66 分鐘。入庫前已重查主線編號，`AK-2026-001` 未撞號。
- 新增講者 `alan_kay`（本庫新講者）：代碼 `ak`，色票淺 `#7B3F96`／深 `#E0A6F0`（原擬 `#5B4A8C`／`#A99BD6` 與 Sundar Pichai 的 `sp`（`#6B5B95`／`#A996D8`）過近，改用鄰近的紫羅蘭色）；`executive-english.html` 與 `keynote-lexicon.html` 補 `ak` 講者色。對談者 Ryan Peterman 以 `interlocutor`／`interlocutor_title` 記錄，未新增為講者，語錄只收 Alan Kay。
- **本場收 2 則只屬 Alan Kay 的語錄**：`AK-2026-001-Q01`（33:42＝2022s）、`AK-2026-001-Q02`（33:22＝2002s）。本場未找到官方逐字稿；時間碼採官方頁「字幕記錄」自動字幕面板各句所在字幕段的段起點＋面板截圖對照（未下載影片、音訊或字幕檔，未請求 YouTube timedtext，未使用第三方轉寫站）。Q01 只把重複的「when he」縮成一次、不含開頭「Yes, absolutely.」；Q02 只去掉 um 與重複的 it。`source_type` 為 `platform_auto_captions`，`verification_status` 為 `transcript_text_verified`（時間碼僅到字幕段起點、未對影片全片校聽，非 fully verified；同類先例 `JB-2015-001-Q01`）。
- 背景：Q01 提到的《財星》評語見 Fortune 2008-03-05 Peter Elkind〈The trouble with Steve Jobs〉，該文只有「Steve understands desire」一句；只寫進導讀作背景出處，不另建條目。
- 時間戳記索引（只存語錄編號、時間碼、官方影片定位連結，無逐字稿文字）：`transcripts/AK-2026-001.txt`；繁體中文導讀：`editorials/AK-2026-001.md`；短摘要：`prod001_summary_zh_draft.json` 的 `AK-2026-001`。
- 詞彙卡排程：金句 id 81–83 排 2026-11-29，名人詞彙 id 207–211 排 2026-11-30，接續既有排程、不改動已排的 2026-11-28／2026-11-29。
- 單場頁：`products/core/speech.html?id=AK-2026-001`（顯示 2 則語錄與時間碼）。
