import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const schema = JSON.parse(fs.readFileSync(path.join(root, "products/shared/content-schema.json"), "utf8"));

function extractLiteral(source, declaration) {
  const marker = `const ${declaration} = `;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`找不到 ${declaration}`);
  const literalStart = start + marker.length;
  const opening = source[literalStart];
  const closing = opening === "[" ? "]" : "}";
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = literalStart; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") { quote = char; continue; }
    if (char === opening) depth += 1;
    if (char === closing) depth -= 1;
    if (depth === 0) return source.slice(literalStart, i + 1);
  }
  throw new Error(`${declaration} 結構不完整`);
}

function readProduct(relativePath, dataPath) {
  const file = path.join(root, relativePath);
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes(`loadCards("./${path.basename(dataPath)}")`)) {
    errors.push(`${relativePath}: 未載入指定的 JSON 單一資料來源`);
  }
  return {
    file: relativePath,
    cards: JSON.parse(fs.readFileSync(path.join(root, dataPath), "utf8")),
    speakers: vm.runInNewContext(`(${extractLiteral(source, "SPEAKERS")})`),
  };
}

function requireFields(product, fields) {
  product.cards.forEach((card, index) => {
    fields.forEach(field => {
      if (card[field] === undefined || card[field] === null || card[field] === "") {
        errors.push(`${product.file}: 第 ${index + 1} 張卡缺少 ${field}`);
      }
    });
  });
}

function validateCommon(product, labelField) {
  const ids = new Set();
  const labels = new Set();
  product.cards.forEach((card, index) => {
    if (!Number.isInteger(card.id) || card.id <= 0) errors.push(`${product.file}: 無效 id ${card.id}`);
    if (ids.has(card.id)) errors.push(`${product.file}: id ${card.id} 重複`);
    ids.add(card.id);
    const label = String(card[labelField] || "").trim().toLocaleLowerCase();
    if (labels.has(label)) errors.push(`${product.file}: ${labelField}「${label}」重複`);
    labels.add(label);
    if (!product.speakers[card.speaker]) errors.push(`${product.file}: id ${card.id} 使用未知講者 ${card.speaker}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(card.date) || Number.isNaN(Date.parse(`${card.date}T00:00:00Z`))) {
      errors.push(`${product.file}: id ${card.id} 日期格式錯誤：${card.date}`);
    }
    if (index > 0 && card.id !== product.cards[index - 1].id + 1) {
      errors.push(`${product.file}: id ${product.cards[index - 1].id} 後不是連續編號`);
    }
  });
}

const executive = readProduct("products/general-vocab/executive-english.html", "products/general-vocab/cards_data.json");
const keynote = readProduct("products/vocabulary-cards/keynote-lexicon.html", "products/vocabulary-cards/cards_data.json");

requireFields(executive, [...schema.common.required, ...schema.executiveEnglish.required]);
validateCommon(executive, "word");
const rarityByCefr = schema.executiveEnglish.cefrRarity;
executive.cards.forEach(card => {
  if (!rarityByCefr[card.cefr]) errors.push(`${executive.file}: id ${card.id} CEFR 無效：${card.cefr}`);
  else if (card.rarity !== rarityByCefr[card.cefr]) errors.push(`${executive.file}: id ${card.id} rarity 與 CEFR 不一致`);
});

requireFields(keynote, [...schema.common.required, ...schema.keynoteLexicon.required]);
validateCommon(keynote, "term");
keynote.cards.forEach(card => {
  if (!schema.keynoteLexicon.categories.includes(card.cat)) errors.push(`${keynote.file}: id ${card.id} 類別無效：${card.cat}`);
  if (!schema.keynoteLexicon.rarities.includes(card.rarity)) errors.push(`${keynote.file}: id ${card.id} 稀有度無效：${card.rarity}`);
});

const sandbox = { window: {}, btoa: value => Buffer.from(value).toString("base64"), atob: value => Buffer.from(value, "base64").toString() };
vm.runInNewContext(fs.readFileSync(path.join(root, "products/shared/learning-core.js"), "utf8"), sandbox);
const core = sandbox.window.LearningCore;
let review = core.review(null, true, "2026-09-18");
if (review.due !== "2026-09-19") errors.push("間隔複習：第一次答對應排在 1 天後");
review = core.review(review, true, "2026-09-19");
if (review.due !== "2026-09-22") errors.push("間隔複習：第二次答對應排在 3 天後");
review = core.review(review, true, "2026-09-22");
if (review.due !== "2026-09-29" || !review.mastered) errors.push("間隔複習：第三次答對應排在 7 天後並標成熟練");
review = core.review(review, false, "2026-09-29");
if (review.due !== "2026-09-30" || review.mastered) errors.push("間隔複習：答錯應在隔天重排並取消熟練");
if (!core.isViewableDailyDate("2026-09-17", "2026-09-18")) errors.push("每日挑戰：過去日期應可查看");
if (!core.isViewableDailyDate("2026-09-18", "2026-09-18")) errors.push("每日挑戰：今天應可查看");
if (core.isViewableDailyDate("2026-09-19", "2026-09-18")) errors.push("每日挑戰：未來日期不應可查看");

const packCards = Array.from({ length: 8 }, (_, index) => ({ id: index + 1 }));
const seeded = core.dailySelection(packCards, "2026-09-18", 3).map(card => card.id);
const firstLock = core.ensureDailyPack(packCards, "2026-09-18", 3, {}, {});
if (firstLock.ids.join() !== seeded.join() || !firstLock.persist) {
  errors.push("每日牌組：首次產生應沿用日期種子且寫入鎖定");
}
const grown = packCards.concat({ id: 99 });
const lockedAfterGrowth = core.ensureDailyPack(grown, "2026-09-18", 3, { "2026-09-18": firstLock.ids }, {});
if (lockedAfterGrowth.ids.join() !== firstLock.ids.join() || lockedAfterGrowth.persist) {
  errors.push("每日牌組：鎖定後卡池變大不應改牌");
}
const shrunk = packCards.filter(card => card.id !== firstLock.ids[1]);
const lockedAfterShrink = core.ensureDailyPack(shrunk, "2026-09-18", 3, { "2026-09-18": firstLock.ids }, {});
if (lockedAfterShrink.ids[0] !== firstLock.ids[0] || lockedAfterShrink.ids[1] === firstLock.ids[1]) {
  errors.push("每日牌組：缺卡時應保留其餘鎖定 id，不得整日重抽");
}
if (lockedAfterShrink.ids.length !== 3 || new Set(lockedAfterShrink.ids).size !== 3) {
  errors.push("每日牌組：缺卡後應補滿原長度且不重複");
}
const archivedCreate = core.ensureDailyPack(packCards, "2026-09-18", 3, {}, { excludeIds: [seeded[0]] });
if (archivedCreate.ids.includes(seeded[0])) errors.push("每日牌組：首次產生應排除封存卡");
const archivedLock = core.ensureDailyPack(packCards, "2026-09-18", 3, { "2026-09-18": firstLock.ids }, {
  excludeIds: firstLock.ids,
  fillExcludeIds: firstLock.ids,
});
if (archivedLock.ids.join() !== firstLock.ids.join()) {
  errors.push("每日牌組：鎖定後不應因封存而抽掉當日牌");
}
const preferred = core.generateDailyPackIds(packCards, "2026-09-18", 3, { preferIds: [7] });
if (preferred[0] !== 7) errors.push("每日牌組：首次產生應優先保留已開卡 id");
const mergedPacks = core.mergeLockedPacks(
  { "2026-09-18": [1, 2, 3] },
  { "2026-09-18": [4, 5, 6], "2026-09-17": [7, 8, 9] }
);
if (mergedPacks["2026-09-18"].join() !== "1,2,3") errors.push("每日牌組：合併時本機已鎖定的日期不得被覆蓋");
if (mergedPacks["2026-09-17"].join() !== "7,8,9") errors.push("每日牌組：合併時應補上本機沒有的歷史鎖定");

const encoded = core.encodeProgress({ "2026-09-18": true }, { "2026-09-18": [1, 2] }, new Date(2026, 8, 18), {
  packs: { "2026-09-18": firstLock.ids, "2026-09-17": [7, 8, 9] },
  archived: [4, 2],
});
const decoded = core.decodeProgress(encoded);
if (decoded.v !== schema.progressSync.version) errors.push("同步代碼：版本應為 " + schema.progressSync.version);
if (!decoded.p || decoded.p["2026-09-18"].join() !== firstLock.ids.join()) errors.push("同步代碼：應帶鎖定牌組 p");
if (!Array.isArray(decoded.a) || decoded.a.join() !== "2,4") errors.push("同步代碼：Keynote 封存清單應排序後寫入 a");
schema.progressSync.fields.forEach(field => {
  if (decoded[field] === undefined) errors.push("同步代碼：缺少欄位 " + field);
});
const legacy = core.decodeProgress(Buffer.from(JSON.stringify({ v: 1, d: ["2026-09-01"], o: [1] })).toString("base64"));
if (!legacy.d.includes("2026-09-01")) errors.push("同步代碼：舊版 v1 仍應可匯入");
const legacyV2 = core.decodeProgress(Buffer.from(JSON.stringify({ v: 2, d: ["2026-09-01"], o: [1], a: [3] })).toString("base64"));
if (!legacyV2.a || legacyV2.a[0] !== 3) errors.push("同步代碼：舊版 v2 仍應可匯入");
if (schema.progressSync.dailyPackStorage.keynoteLexicon !== "keynote-lexicon-daily-packs") {
  errors.push("schema：Keynote 鎖定牌組 key 不符");
}
if (schema.progressSync.dailyPackStorage.executiveEnglish !== "exec-vocab-daily-packs") {
  errors.push("schema：Executive English 鎖定牌組 key 不符");
}

if (errors.length) {
  console.error(`內容驗證失敗（${errors.length} 項）：`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`內容驗證通過：Executive English ${executive.cards.length} 張；Keynote Lexicon ${keynote.cards.length} 張；間隔複習規則正常。`);
