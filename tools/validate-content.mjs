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

if (errors.length) {
  console.error(`內容驗證失敗（${errors.length} 項）：`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`內容驗證通過：Executive English ${executive.cards.length} 張；Keynote Lexicon ${keynote.cards.length} 張；間隔複習規則正常。`);
