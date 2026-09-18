(function (global) {
  "use strict";

  function localDate(date) {
    const d = date || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function addDays(dateString, days) {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return localDate(date);
  }

  function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(items, random) {
    const result = items.slice();
    const rng = random || Math.random;
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function normalizeCardIds(ids) {
    if (!Array.isArray(ids)) return [];
    const seen = new Set();
    const result = [];
    ids.forEach(value => {
      const id = Number(value);
      if (!Number.isInteger(id) || id <= 0 || seen.has(id)) return;
      seen.add(id);
      result.push(id);
    });
    return result;
  }

  function normalizeSchedule(schedule) {
    const result = {};
    if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) return result;
    Object.keys(schedule).forEach(date => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      const ids = normalizeCardIds(schedule[date]);
      if (ids.length) result[date] = ids;
    });
    return result;
  }

  function scheduledIds(schedule, dateString) {
    return normalizeCardIds(schedule && schedule[dateString]);
  }

  function scheduledCards(cards, ids) {
    const byId = new Map();
    (cards || []).forEach(card => {
      if (card && Number.isInteger(card.id)) byId.set(card.id, card);
    });
    return normalizeCardIds(ids).map(id => byId.get(id)).filter(Boolean);
  }

  function isViewableDailyDate(dateString, today) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString || "") && dateString <= (today || localDate());
  }

  function canOpenDailyDate(dateString, today, options) {
    const now = today || localDate();
    if (!isViewableDailyDate(dateString, now)) return false;
    if (dateString === now) return true;
    options = options || {};
    return !!(options.scheduled || options.hasProgress);
  }

  function streak(record, now) {
    let count = 0;
    const date = now ? new Date(now) : new Date();
    if (!record[localDate(date)]) date.setDate(date.getDate() - 1);
    while (record[localDate(date)]) {
      count += 1;
      date.setDate(date.getDate() - 1);
    }
    return count;
  }

  function encodeProgress(record, opened, now, extras) {
    extras = extras || {};
    const dates = Object.keys(record).filter(date => record[date]).sort();
    const payload = {
      v: Array.isArray(extras.archived) ? 2 : 1,
      d: dates,
      o: opened[localDate(now)] || [],
    };
    if (Array.isArray(extras.archived)) {
      payload.a = normalizeCardIds(extras.archived).slice().sort((left, right) => left - right);
    }
    return btoa(JSON.stringify(payload));
  }

  function decodeProgress(code) {
    let payload;
    try { payload = JSON.parse(atob(code.trim())); }
    catch (error) { throw new Error("代碼格式錯誤"); }
    if (!payload || !Array.isArray(payload.d)) throw new Error("代碼格式錯誤");
    return payload;
  }

  function normalizeReview(value, today) {
    const base = { streak: 0, mastered: false, repetitions: 0, intervalDays: 0, ease: 2.5, due: today, lastReviewed: null };
    if (value === true) return { ...base, streak: 1 };
    if (!value || typeof value !== "object" || Array.isArray(value)) return base;
    const streak = Math.max(0, Math.floor(Number(value.streak) || 0));
    const repetitions = Math.max(0, Math.floor(Number(value.repetitions) || 0));
    const intervalDays = Math.max(0, Math.floor(Number(value.intervalDays) || 0));
    const ease = Math.min(3, Math.max(1.3, Number(value.ease) || 2.5));
    return {
      ...base,
      ...value,
      streak,
      repetitions,
      intervalDays,
      ease,
      mastered: !!value.mastered || streak >= 3,
      due: /^\d{4}-\d{2}-\d{2}$/.test(value.due || "") ? value.due : today,
      lastReviewed: /^\d{4}-\d{2}-\d{2}$/.test(value.lastReviewed || "") ? value.lastReviewed : null,
    };
  }

  function review(value, remembered, today) {
    const date = today || localDate();
    const previous = normalizeReview(value, date);
    // A card can also appear in a mini-game on the same day. Do not let repeated
    // correct answers artificially jump through several review intervals.
    if (remembered && previous.lastReviewed === date) return previous;
    if (!remembered) {
      return { ...previous, streak: 0, mastered: false, repetitions: 0, intervalDays: 1,
        ease: Math.max(1.3, previous.ease - 0.2), due: addDays(date, 1), lastReviewed: date };
    }
    const repetitions = previous.repetitions + 1;
    const intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : repetitions === 3
      ? 7 : Math.max(8, Math.round(previous.intervalDays * previous.ease));
    const streakValue = previous.streak + 1;
    return { ...previous, streak: streakValue, mastered: streakValue >= 3 || previous.mastered,
      repetitions, intervalDays, ease: Math.min(3, previous.ease + 0.05),
      due: addDays(date, intervalDays), lastReviewed: date };
  }

  function isDue(value, today) {
    return normalizeReview(value, today || localDate()).due <= (today || localDate());
  }

  global.LearningCore = Object.freeze({
    localDate, addDays, hashString, seededRandom, shuffled, streak,
    normalizeCardIds, normalizeSchedule, scheduledIds, scheduledCards,
    encodeProgress, decodeProgress, normalizeReview, review, isDue,
    isViewableDailyDate, canOpenDailyDate,
  });
}(window));
