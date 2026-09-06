(function (global) {
  const SPEAKERS = {
    jh: { key: "jh", db: "jensen_huang", name: "Jensen Huang", short: "黃仁勳", company: "NVIDIA" },
    em: { key: "em", db: "elon_musk", name: "Elon Musk", short: "馬斯克", company: "Tesla / xAI" },
    sa: { key: "sa", db: "sam_altman", name: "Sam Altman", short: "奧特曼", company: "OpenAI" },
    sp: { key: "sp", db: "sundar_pichai", name: "Sundar Pichai", short: "皮查伊", company: "Google" },
    mz: { key: "mz", db: "mark_zuckerberg", name: "Mark Zuckerberg", short: "祖克柏", company: "Meta" }
  };

  const FEATURED_SPEECH_IDS = [
    "JH-2026-005",
    "JH-2026-002",
    "EM-2026-006",
    "EM-2026-001",
    "SA-2026-003",
    "SP-2026-001",
    "SP-2025-001"
  ];

  const HOLD_SPEECH_IDS = ["EM-2026-005", "SA-2026-001"];

  function resolvePaths() {
    const configured = global.CORE_PATHS || {};
    const inCore = /\/products\/core\/[^/]*$/.test(location.pathname);
    const prefix = inCore ? "../../" : "";
    const corePrefix = inCore ? "" : "products/core/";
    return {
      quotes: configured.quotes || prefix + "references/quotes_index.json",
      flags: configured.flags || prefix + "references/content_review_flags.json",
      speechesDb: configured.speechesDb || prefix + "references/speeches_database.json",
      healthy: configured.healthy || prefix + "references/healthy_seven_feed.json",
      summaries: configured.summaries || prefix + "references/prod001_summary_zh_draft.json",
      home: configured.home || (inCore ? "../../index.html" : "index.html"),
      speech: configured.speech || corePrefix + "speech.html",
      wall: configured.wall || (inCore ? "../../index.html" : "index.html"),
      lexicon: configured.lexicon || (inCore ? "../vocabulary-cards/keynote-lexicon.html" : "products/vocabulary-cards/keynote-lexicon.html"),
      ee: configured.ee || (inCore ? "../general-vocab/executive-english.html" : "products/general-vocab/executive-english.html")
    };
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeSpeaker(value) {
    if (!value) return "";
    const raw = String(value).toLowerCase();
    if (SPEAKERS[raw]) return raw;
    for (const meta of Object.values(SPEAKERS)) {
      if (meta.db === raw) return meta.key;
    }
    return raw;
  }

  function speakerMeta(value) {
    return SPEAKERS[normalizeSpeaker(value)] || {
      key: normalizeSpeaker(value) || "unknown",
      name: value || "Unknown",
      short: value || "",
      company: ""
    };
  }

  function speakerLabel(value) {
    const meta = speakerMeta(value);
    return meta.short ? meta.name + "（" + meta.short + "）" : meta.name;
  }

  function yearOf(date) {
    if (!date) return "";
    return String(date).slice(0, 4);
  }

  function formatDate(value) {
    if (!value) return "";
    const parts = String(value).split("-");
    if (parts.length !== 3) return value;
    return parts[0] + "年" + Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function attributionLine(entry) {
    const meta = speakerMeta(entry.speaker);
    return [meta.name, entry.event, yearOf(entry.date)].filter(Boolean).join(" · ");
  }

  function copyPayload(body, entry) {
    const line = attributionLine(entry);
    return String(body || "").trim() + (line ? "\n\n" + line : "");
  }

  function flaggedSpeechIds(flagRows) {
    const ids = new Set(HOLD_SPEECH_IDS);
    (flagRows || []).forEach((row) => {
      if (row && row.speech_id) ids.add(row.speech_id);
    });
    return ids;
  }

  function isWallQuote(entry, flaggedIds) {
    if (!entry || entry.status !== "verified") return false;
    if (entry.content_review_flag) return false;
    if (flaggedIds && flaggedIds.has(entry.speech_id)) return false;
    return true;
  }

  function isSpeechQuote(entry) {
    if (!entry || entry.status !== "verified") return false;
    if (entry.content_review_flag) return false;
    return true;
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("無法讀取 " + url + "（HTTP " + res.status + "）");
    return res.json();
  }

  function quoteAnchor(entry) {
    return "quote-" + (entry.quote_id || entry.speech_id || "unknown");
  }

  function speechHref(paths, speechId, quoteId) {
    const base = paths.speech + "?id=" + encodeURIComponent(speechId || "");
    return quoteId ? base + "#quote-" + encodeURIComponent(quoteId) : base;
  }

  function getSpeechIdFromLocation() {
    const params = new URLSearchParams(location.search);
    if (params.get("id")) return params.get("id").trim();
    const hash = decodeURIComponent((location.hash || "").slice(1));
    if (hash && !hash.startsWith("quote-")) return hash.trim();
    return "";
  }

  function getQuoteHashId() {
    const hash = decodeURIComponent((location.hash || "").slice(1));
    if (hash.indexOf("quote-") === 0) return hash.slice("quote-".length);
    return "";
  }

  async function copyText(text) {
    const value = String(text || "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }

  function bindCopyButtons(root) {
    root.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-copy]");
      if (!btn) return;
      let text = btn.getAttribute("data-copy") || "";
      try { text = decodeURIComponent(text); } catch (err) { /* keep raw */ }
      copyText(text).then(() => {
        const prev = btn.textContent;
        btn.textContent = "已複製";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = prev;
          btn.classList.remove("copied");
        }, 1400);
      }).catch(() => {
        btn.textContent = "複製失敗";
      });
    });
  }

  function highlightQuoteFromHash() {
    const id = getQuoteHashId();
    if (!id) return false;
    const el = document.getElementById("quote-" + id);
    if (!el) return false;
    document.querySelectorAll(".quote-card.highlight").forEach((node) => node.classList.remove("highlight"));
    el.classList.add("highlight");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    return true;
  }

  function scheduleHighlight() {
    const tryHighlight = () => highlightQuoteFromHash();
    requestAnimationFrame(() => {
      if (!tryHighlight()) setTimeout(tryHighlight, 60);
    });
  }

  function quoteCardHtml(entry, paths, opts) {
    const options = opts || {};
    const speaker = normalizeSpeaker(entry.speaker);
    const meta = speakerMeta(speaker);
    const qid = entry.quote_id || "";
    const anchor = quoteAnchor(entry);
    const attr = attributionLine(entry);
    const copyEn = copyPayload(entry.quote, entry);
    const copyZh = copyPayload(entry.quote_zh, entry);
    const speechLink = entry.speech_id
      ? speechHref(paths, entry.speech_id, qid)
      : "";
    const source = entry.source_url
      ? '<a class="btn action source" href="' + escapeHtml(entry.source_url) + '" target="_blank" rel="noopener noreferrer">原文</a>'
      : "";
    const speechBtn = speechLink && !options.hideSpeech
      ? '<a class="btn action" href="' + escapeHtml(speechLink) + '">單場</a>'
      : "";

    return (
      '<article class="quote-card" id="' + escapeHtml(anchor) + '" data-speaker="' + escapeHtml(speaker) + '" data-quote-id="' + escapeHtml(qid) + '">' +
        "<blockquote class=\"quote-en\">" + escapeHtml(entry.quote) + "</blockquote>" +
        (entry.quote_zh ? "<p class=\"quote-zh\">" + escapeHtml(entry.quote_zh) + "</p>" : "") +
        '<div class="quote-meta">' +
          '<span class="speaker-name">' + escapeHtml(meta.name) + "</span>" +
          (entry.event ? "<span>" + escapeHtml(entry.event) + "</span>" : "") +
          (entry.date ? "<span>" + escapeHtml(formatDate(entry.date)) + "</span>" : "") +
        "</div>" +
        (entry.why_notable_zh
          ? "<details class=\"why\"><summary>備註</summary><p>" + escapeHtml(entry.why_notable_zh) + "</p></details>"
          : "") +
        '<div class="card-actions">' +
          source +
          '<button type="button" class="btn action" data-copy="' + encodeURIComponent(copyEn) + '">複製英文</button>' +
          (entry.quote_zh
            ? '<button type="button" class="btn action" data-copy="' + encodeURIComponent(copyZh) + '">複製中文</button>'
            : "") +
          speechBtn +
        "</div>" +
        '<p class="sr-only">出處：' + escapeHtml(attr) + "</p>" +
      "</article>"
    );
  }

  global.CoreUI = {
    SPEAKERS,
    FEATURED_SPEECH_IDS,
    HOLD_SPEECH_IDS,
    resolvePaths,
    escapeHtml,
    normalizeSpeaker,
    speakerMeta,
    speakerLabel,
    yearOf,
    formatDate,
    attributionLine,
    copyPayload,
    flaggedSpeechIds,
    isWallQuote,
    isSpeechQuote,
    fetchJson,
    quoteAnchor,
    speechHref,
    getSpeechIdFromLocation,
    getQuoteHashId,
    copyText,
    bindCopyButtons,
    highlightQuoteFromHash,
    scheduleHighlight,
    quoteCardHtml
  };
})(window);
