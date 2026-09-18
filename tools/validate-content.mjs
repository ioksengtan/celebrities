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

function readProduct(relativePath, dataPath, schedulePath) {
  const file = path.join(root, relativePath);
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes(`loadCards("./${path.basename(dataPath)}")`)) {
    errors.push(`${relativePath}: 未載入指定的 JSON 單一資料來源`);
  }
  if (!source.includes(`"./${path.basename(schedulePath)}"`)) {
    errors.push(`${relativePath}: 未載入每日挑戰行程 ${path.basename(schedulePath)}`);
  }
  if (/dailySelection\(|ensureDailyPack\(/.test(source)) {
    errors.push(`${relativePath}: 每日挑戰不可再用日期種子抽卡`);
  }
  const sizeMatch = source.match(/const DAILY_SIZE = (\d+)/);
  return {
    file: relativePath,
    source,
    cards: JSON.parse(fs.readFileSync(path.join(root, dataPath), "utf8")),
    schedule: JSON.parse(fs.readFileSync(path.join(root, schedulePath), "utf8")),
    speakers: vm.runInNewContext(`(${extractLiteral(source, "SPEAKERS")})`),
    dailySize: sizeMatch ? Number(sizeMatch[1]) : null,
  };
}

function scheduleIssues(schedule, cards, size, label) {
  const issues = [];
  if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) {
    issues.push(`${label}: daily_schedule.json 必須是日期對 id 陣列的物件`);
    return issues;
  }
  const cardIds = new Set(cards.map(card => card.id));
  const dates = Object.keys(schedule).filter(key => !key.startsWith("_")).sort();
  if (dates.length < schema.dailySchedule.minDays) {
    issues.push(`${label}: 行程至少應排 ${schema.dailySchedule.minDays} 天（目前 ${dates.length} 天）`);
  }
  dates.forEach(date => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      issues.push(`${label}: 無效日期鍵 ${date}`);
      return;
    }
    const ids = schedule[date];
    if (!Array.isArray(ids)) {
      issues.push(`${label}: ${date} 應為 id 陣列`);
      return;
    }
    if (ids.length !== size) {
      issues.push(`${label}: ${date} 應有恰好 ${size} 張，實際 ${ids.length}`);
    }
    const seen = new Set();
    ids.forEach(id => {
      if (!Number.isInteger(id) || id <= 0) issues.push(`${label}: ${date} 無效 id ${id}`);
      else if (!cardIds.has(id)) issues.push(`${label}: ${date} 找不到卡片 id ${id}`);
      else if (seen.has(id)) issues.push(`${label}: ${date} 同一天重複 id ${id}`);
      seen.add(id);
    });
  });
  return issues;
}

function validateSchedule(product, size, label) {
  if (product.dailySize !== size) {
    errors.push(`${product.file}: DAILY_SIZE 應為 ${size}`);
  }
  scheduleIssues(product.schedule, product.cards, size, label).forEach(issue => errors.push(issue));
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

const executive = readProduct(
  "products/general-vocab/executive-english.html",
  "products/general-vocab/cards_data.json",
  "products/general-vocab/daily_schedule.json"
);
const keynote = readProduct(
  "products/vocabulary-cards/keynote-lexicon.html",
  "products/vocabulary-cards/cards_data.json",
  "products/vocabulary-cards/daily_schedule.json"
);

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
validateSchedule(executive, schema.dailySchedule.executiveEnglish.size, executive.file);
validateSchedule(keynote, schema.dailySchedule.keynoteLexicon.size, keynote.file);
const countIssues = scheduleIssues({ "2026-09-18": [1, 2] }, [{ id: 1 }, { id: 2 }, { id: 3 }], 3, "行程檢查");
if (!countIssues.some(issue => issue.includes("恰好 3 張"))) {
  errors.push("行程驗證：張數不符時應回報錯誤");
}

if (!core.isViewableDailyDate("2026-09-17", "2026-09-18")) errors.push("每日挑戰：過去日期格式應可通過日期檢查");
if (!core.isViewableDailyDate("2026-09-18", "2026-09-18")) errors.push("每日挑戰：今天應可通過日期檢查");
if (core.isViewableDailyDate("2026-09-19", "2026-09-18")) errors.push("每日挑戰：未來日期不應可查看");
if (core.canOpenDailyDate("2026-09-19", "2026-09-18", { scheduled: true })) {
  errors.push("每日挑戰：已排程的未來日期不應可提前開啟");
}
if (!core.canOpenDailyDate("2026-09-18", "2026-09-18", { scheduled: true })) {
  errors.push("每日挑戰：今天已排程應可開啟");
}
if (!core.canOpenDailyDate("2026-09-17", "2026-09-18", { scheduled: true })) {
  errors.push("每日挑戰：過去已排程日期應可回看");
}
if (core.canOpenDailyDate("2026-09-16", "2026-09-18", {})) {
  errors.push("每日挑戰：未排程且無進度的過去日期不應開啟");
}
if (!core.canOpenDailyDate("2026-09-16", "2026-09-18", { hasProgress: true })) {
  errors.push("每日挑戰：過去已完成日期應可回看");
}

const packCards = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
const resolved = core.scheduledCards(packCards, [3, 99, 1, 3]);
if (resolved.map(card => card.id).join() !== "3,1") {
  errors.push("每日牌組：應依行程 id 還原，缺卡略過且不重抽");
}
const grown = packCards.concat({ id: 99 });
if (core.scheduledCards(grown, [3, 1]).map(card => card.id).join() !== "3,1") {
  errors.push("每日牌組：卡池變大不應改已排程的 id");
}
if (core.dailySelection) errors.push("每日牌組：不應再匯出日期種子抽卡 dailySelection");

const encoded = core.encodeProgress({ "2026-09-18": true }, { "2026-09-18": [1, 2] }, new Date(2026, 8, 18), {
  archived: [4, 2],
});
const decoded = core.decodeProgress(encoded);
if (decoded.v !== 2) errors.push("同步代碼：含封存時版本應為 2");
if (decoded.p) errors.push("同步代碼：牌組來自 shipped JSON，不應再帶 p");
if (!Array.isArray(decoded.a) || decoded.a.join() !== "2,4") errors.push("同步代碼：Keynote 封存清單應排序後寫入 a");
schema.progressSync.fields.forEach(field => {
  if (decoded[field] === undefined) errors.push("同步代碼：缺少欄位 " + field);
});
const legacy = core.decodeProgress(Buffer.from(JSON.stringify({ v: 1, d: ["2026-09-01"], o: [1] })).toString("base64"));
if (!legacy.d.includes("2026-09-01")) errors.push("同步代碼：舊版 v1 仍應可匯入");
const legacyV2 = core.decodeProgress(Buffer.from(JSON.stringify({ v: 2, d: ["2026-09-01"], o: [1], a: [3] })).toString("base64"));
if (!legacyV2.a || legacyV2.a[0] !== 3) errors.push("同步代碼：舊版 v2 仍應可匯入");

if (errors.length) {
  console.error(`內容驗證失敗（${errors.length} 項）：`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`內容驗證通過：Executive English ${executive.cards.length} 張；Keynote Lexicon ${keynote.cards.length} 張；間隔複習規則正常。`);
