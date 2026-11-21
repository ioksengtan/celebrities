# CMU Pronouncing Dictionary 0.7b — 來源與轉寫說明

名人詞彙（Executive English）卡片正面的 KK 音標（`cards_data.json` 的 `kk` 欄位），
是由 **卡內基美隆大學發音詞典（CMU Pronouncing Dictionary）版本 0.7b** 的美式英語
發音（ARPAbet 標音）機械轉寫而來。

## 來源

- 詞典名稱：CMU Pronouncing Dictionary（cmudict），版本 0.7b（Major Version 0.07）
- 授權：2-clause BSD（姓名標示式，見同資料夾的 [`LICENSE.txt`](LICENSE.txt)）
- 版權：Copyright (C) 1993-2015 Carnegie Mellon University
- 官方來源：卡內基美隆大學 Sphinx 語音專案
  （SourceForge：`https://svn.code.sf.net/p/cmusphinx/code/branches/cmudict/cmudict-0.7b`）

## 入庫範圍

依任務說明，**不把詞典原檔放進倉庫**；只保留：

- 轉換腳本：[`../../tools/cmu-to-kk.mjs`](../../tools/cmu-to-kk.mjs)
- 轉寫產出：`products/general-vocab/cards_data.json` 的 `kk` / `kk_source` 欄位
- 本授權全文與來源說明（本資料夾）

重跑方式（詞典原檔需自行另外下載）：

```
node tools/cmu-to-kk.mjs /path/to/cmudict-0.7b
```

## ARPAbet → KK 對照與轉寫規則

轉換腳本依下列對照表，把 CMU 的 ARPAbet 美式發音轉成 KK（Kenyon & Knott）音標：

- 母音：AA→ɑ、AE→æ、AH→ʌ（重音）／ə（非重音）、AO→ɔ、AW→aʊ、AY→aɪ、
  EH→ɛ、ER→ɝ（重音）／ɚ（非重音）、EY→e、IH→ɪ、IY→i、OW→o、OY→ɔɪ、UH→ʊ、UW→u。
- 子音：B→b、CH→tʃ、D→d、DH→ð、F→f、G→g、HH→h、JH→dʒ、K→k、L→l、M→m、
  N→n、NG→ŋ、P→p、R→r、S→s、SH→ʃ、T→t、TH→θ、V→v、W→w、Y→j、Z→z、ZH→ʒ。
- KK 慣例：詞尾非重音的 -y（CMU 的 IY0）轉為 [ɪ]（「happy 母音」）。
- 只標主重音（ˈ），依「最大音節起首（maximal onset）」原則把重音符號放在重音節起首之前；
  單音節詞不標重音。

## 留空原則（不憑空編造）

以下情況一律留空，`kk` 與 `kk_source` 皆為空字串：

1. **片語與連字號詞**（13 張，例如 inflection point、product-market fit、AI-native）：
   其重音與邊界不是單純的查典，需人工逐詞核對，故留空。
2. **CMU 0.7b 查無此詞**（6 張：dystopian、monetize、civilizational、externalities、
   reskill、onboarding）：詞典沒有就留空，不由相關詞形推測。
3. **多重主重音、難以機械判定**（1 張：underestimate，CMU 標了兩個主重音）：留空待人工核對。

## 多音字處理

多音字預設採 CMU 的第一條（未加編號的標準讀音）。少數依詞性／例句才能定奪的同形異義詞，
已在腳本中依該卡詞性釘選對應讀音：

- `combat`（動詞）→ kəmˈbæt（CMU 第 2 條；非名詞 ˈkɑmbæt）
- `advocate`（動詞）→ ˈædvəˌket（CMU 第 2 條；非名詞 ˈædvəkət）

其餘多音字的各變體僅屬細微的同位音差異，採第一條即可。
