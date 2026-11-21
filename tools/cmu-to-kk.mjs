// Convert the American-English pronunciations in the CMU Pronouncing
// Dictionary 0.7b (2-clause BSD licence) into KK (Kenyon & Knott) phonetic
// symbols, and write them into products/general-vocab/cards_data.json as the
// `kk` / `kk_source` fields.
//
// Rules (see products/general-vocab/README.md and the task brief):
//   * Only single-word, non-hyphenated entries are transcribed. Phrases and
//     hyphenated words are left empty (their stress/boundaries are not a
//     straight dictionary lookup).
//   * Words absent from CMU 0.7b are left empty — never guessed or derived
//     from a related form.
//   * Multi-pronunciation entries default to CMU's first (canonical) variant;
//     genuine part-of-speech homographs are pinned to the variant that matches
//     the card's part of speech and example (see HOMOGRAPH_PICKS below).
//
// Usage:
//   node tools/cmu-to-kk.mjs /path/to/cmudict-0.7b   # download separately
//
// The raw dictionary file is NOT committed; only this script, the generated
// data, and the licence/source note under references/cmu-pronouncing-dictionary/
// live in the repository.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = path.join(root, "products/general-vocab/cards_data.json");

const KK_SOURCE =
  "CMU Pronouncing Dictionary 0.7b（2-clause BSD 授權）；ARPAbet 美式發音經對照表轉寫為 KK 音標";

// Part-of-speech homographs whose CMU variants carry different stress/vowels.
// Each card here is pinned to the ARPAbet variant that matches its POS+example.
//   combat   (verb)  kəmˈbæt   -> variant (1), not the noun ˈkɑmbæt
//   advocate (verb)  ˈædvəˌket -> variant (1), not the noun ˈædvəkət
// (transform verb already matches CMU's first variant, so no override needed.)
const HOMOGRAPH_PICKS = {
  combat: "K AH0 M B AE1 T",
  advocate: "AE1 D V AH0 K EY2 T",
};

// ---- ARPAbet -> KK symbol tables -----------------------------------------
const CONS = {
  B: "b", CH: "tʃ", D: "d", DH: "ð", F: "f", G: "g", HH: "h", JH: "dʒ",
  K: "k", L: "l", M: "m", N: "n", NG: "ŋ", P: "p", R: "r", S: "s", SH: "ʃ",
  T: "t", TH: "θ", V: "v", W: "w", Y: "j", Z: "z", ZH: "ʒ",
};
const VOWEL = {
  AA: "ɑ", AE: "æ", AO: "ɔ", AW: "aʊ", AY: "aɪ",
  EH: "ɛ", EY: "e", IH: "ɪ", IY: "i", OW: "o", OY: "ɔɪ",
  UH: "ʊ", UW: "u",
  // AH and ER depend on stress, handled in code.
};
const VOWEL_BASES = new Set([...Object.keys(VOWEL), "AH", "ER"]);

// Legal English syllable onsets (KK symbols), for maximal-onset stress
// placement. Single consonants are legal onsets except ŋ.
const ONSET2 = new Set([
  "pr", "br", "tr", "dr", "kr", "gr", "fr", "θr", "ʃr",
  "pl", "bl", "kl", "gl", "fl", "sl",
  "tw", "dw", "kw", "gw", "θw", "sw",
  "sp", "st", "sk", "sm", "sn",
  "pj", "bj", "kj", "gj", "fj", "vj", "mj", "hj",
]);
const ONSET3 = new Set(["spr", "str", "skr", "spl", "skw", "spj", "stj", "skj", "skl"]);

function isLegalOnset(symbols) {
  if (symbols.length === 0) return true;
  if (symbols.length === 1) return symbols[0] !== "ŋ";
  const joined = symbols.join("");
  if (symbols.length === 2) return ONSET2.has(joined);
  if (symbols.length === 3) return ONSET3.has(joined);
  return false;
}

function parseCmu(dictPath) {
  const dict = new Map();
  const text = fs.readFileSync(dictPath, "latin1");
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith(";;;")) continue;
    const m = line.match(/^(\S+)\s+(.+)$/);
    if (!m) continue;
    const base = m[1].replace(/\(\d+\)$/, "").toUpperCase();
    if (!dict.has(base)) dict.set(base, []);
    dict.get(base).push(m[2].trim());
  }
  return dict;
}

// Convert one ARPAbet pronunciation string to KK.
function arpabetToKk(arpabet) {
  const tokens = arpabet.trim().split(/\s+/);
  const segs = tokens.map((tok) => {
    const stressMatch = tok.match(/(\d)$/);
    const stress = stressMatch ? Number(stressMatch[1]) : null;
    const base = tok.replace(/\d$/, "");
    return { tok, base, stress, isVowel: VOWEL_BASES.has(base) };
  });

  // Map each segment to its KK symbol.
  segs.forEach((seg, i) => {
    if (!seg.isVowel) {
      seg.kk = CONS[seg.base];
      if (seg.kk === undefined) throw new Error("未知子音 " + seg.base);
      return;
    }
    if (seg.base === "AH") {
      seg.kk = seg.stress === 1 || seg.stress === 2 ? "ʌ" : "ə";
    } else if (seg.base === "ER") {
      seg.kk = seg.stress === 1 || seg.stress === 2 ? "ɝ" : "ɚ";
    } else if (seg.base === "IY" && seg.stress === 0 && i === segs.length - 1) {
      // KK convention: word-final unstressed -y is [ɪ] (the "happy" vowel).
      seg.kk = "ɪ";
    } else {
      seg.kk = VOWEL[seg.base];
      if (seg.kk === undefined) throw new Error("未知母音 " + seg.base);
    }
  });

  const vowelIdx = segs.map((s, i) => (s.isVowel ? i : -1)).filter((i) => i >= 0);
  // Monosyllables carry no stress mark in KK.
  let stressPos = -1; // segment index before which to insert the primary-stress mark
  if (vowelIdx.length >= 2) {
    const primary = segs.findIndex((s) => s.isVowel && s.stress === 1);
    if (primary >= 0) {
      // Consonants immediately preceding the stressed vowel.
      let start = primary;
      while (start - 1 >= 0 && !segs[start - 1].isVowel) start -= 1;
      const cluster = segs.slice(start, primary); // consonant run before vowel
      const isFirstVowel = !segs.slice(0, primary).some((s) => s.isVowel);
      if (isFirstVowel) {
        // Word-initial onset: the whole leading cluster belongs to this syllable.
        stressPos = start;
      } else {
        // Maximal legal onset: longest suffix of the cluster that is a legal onset.
        let onsetStart = primary; // default: no onset consonants (mark before vowel)
        for (let k = Math.min(3, cluster.length); k >= 1; k -= 1) {
          const cand = cluster.slice(cluster.length - k).map((s) => s.kk);
          if (isLegalOnset(cand)) { onsetStart = primary - k; break; }
        }
        stressPos = onsetStart;
      }
    }
  }

  let out = "";
  segs.forEach((seg, i) => {
    if (i === stressPos) out += "ˈ";
    out += seg.kk;
  });
  return out;
}

function main() {
  const dictPath = process.argv[2];
  if (!dictPath) {
    console.error("用法：node tools/cmu-to-kk.mjs <cmudict-0.7b 路徑>");
    process.exit(1);
  }
  const dict = parseCmu(dictPath);
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

  const stats = { filled: 0, empty: 0, reasons: {} };
  const bump = (reason) => { stats.reasons[reason] = (stats.reasons[reason] || 0) + 1; };
  const emptyLog = [];

  for (const card of cards) {
    const word = card.word;
    const isMultiToken = /\s/.test(word) || /-/.test(word);
    if (isMultiToken) {
      card.kk = "";
      card.kk_source = "";
      stats.empty += 1; bump("片語或連字號詞");
      emptyLog.push(card.id + "\t" + word + "\t片語或連字號詞");
      continue;
    }
    const key = word.toUpperCase();
    const prons = dict.get(key);
    if (!prons || prons.length === 0) {
      card.kk = "";
      card.kk_source = "";
      stats.empty += 1; bump("CMU 0.7b 查無此詞");
      emptyLog.push(card.id + "\t" + word + "\tCMU 0.7b 查無此詞");
      continue;
    }
    let arpabet;
    if (HOMOGRAPH_PICKS[word.toLowerCase()]) {
      arpabet = HOMOGRAPH_PICKS[word.toLowerCase()];
    } else {
      // Default to CMU's first (canonical, unsuffixed) variant. Remaining
      // multi-variant entries differ only in minor allophonic detail.
      arpabet = prons[0];
    }
    // CMU entries that carry two primary (1) stresses are ambiguous to place
    // mechanically — leave them empty rather than guess the main stress.
    if ((arpabet.match(/1(?=\s|$)/g) || []).length > 1) {
      card.kk = "";
      card.kk_source = "";
      stats.empty += 1; bump("多重主重音需人工核對");
      emptyLog.push(card.id + "\t" + word + "\t多重主重音需人工核對");
      continue;
    }
    card.kk = arpabetToKk(arpabet);
    card.kk_source = KK_SOURCE;
    stats.filled += 1;
  }

  fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2) + "\n", "utf8");

  console.error("已填 " + stats.filled + " 張；留空 " + stats.empty + " 張");
  console.error("留空原因：" + JSON.stringify(stats.reasons, null, 2));
  if (process.env.EMPTY_LOG) fs.writeFileSync(process.env.EMPTY_LOG, emptyLog.join("\n") + "\n");
}

main();
