(function () {
  const { CoreUI } = window;
  const paths = CoreUI.resolvePaths();
  const statusEl = document.getElementById("status");
  const listEl = document.getElementById("quotes");
  const filtersEl = document.getElementById("filters");
  const countEl = document.getElementById("wall-count");
  const noteEl = document.getElementById("wall-note");

  let wallQuotes = [];
  let activeSpeaker = "all";

  function render() {
    const visible = activeSpeaker === "all"
      ? wallQuotes
      : wallQuotes.filter((q) => CoreUI.normalizeSpeaker(q.speaker) === activeSpeaker);

    const speechCount = new Set(visible.map((q) => q.speech_id)).size;
    if (countEl) {
      countEl.textContent = visible.length + " 則語錄 / " + speechCount + " 場演講";
    }

    filtersEl.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.speaker === activeSpeaker);
    });

    if (!visible.length) {
      listEl.hidden = true;
      statusEl.hidden = false;
      statusEl.className = "empty";
      statusEl.textContent = "這個講者目前沒有可上牆的已核實語錄。";
      return;
    }

    statusEl.hidden = true;
    listEl.hidden = false;
    listEl.innerHTML = visible.map((q) => CoreUI.quoteCardHtml(q, paths)).join("");
  }

  function buildFilters() {
    const keys = [];
    wallQuotes.forEach((q) => {
      const key = CoreUI.normalizeSpeaker(q.speaker);
      if (key && !keys.includes(key)) keys.push(key);
    });
    const chips = ['<button type="button" class="chip active" data-speaker="all">全部</button>']
      .concat(keys.map((key) => {
        const meta = CoreUI.speakerMeta(key);
        return (
          '<button type="button" class="chip" data-speaker="' + CoreUI.escapeHtml(key) + '">' +
            '<span class="dot" style="background: var(--' + CoreUI.escapeHtml(key) + ')"></span>' +
            CoreUI.escapeHtml(meta.name) +
          "</button>"
        );
      }));
    filtersEl.insertAdjacentHTML("beforeend", chips.join(""));
    filtersEl.hidden = false;
    filtersEl.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      activeSpeaker = chip.dataset.speaker;
      render();
    });
  }

  function mzNote(quotes) {
    const mz = quotes.filter((q) => CoreUI.normalizeSpeaker(q.speaker) === "mz");
    if (!mz.length) return "Mark Zuckerberg（MZ）尚未收錄。";
    const speeches = Array.from(new Set(mz.map((q) => q.speech_id)));
    return "Mark Zuckerberg 目前僅部分收錄（" + speeches.join("、") + "，" + mz.length + " 則）。";
  }

  CoreUI.bindCopyButtons(document);

  Promise.all([
    CoreUI.fetchJson(paths.quotes),
    CoreUI.fetchJson(paths.flags)
  ]).then(([quotes, flags]) => {
    const flagged = CoreUI.flaggedSpeechIds(flags);
    const rows = Array.isArray(quotes) ? quotes : [];
    wallQuotes = rows.filter((q) => CoreUI.isWallQuote(q, flagged));
    if (noteEl) noteEl.textContent = mzNote(wallQuotes);
    if (!wallQuotes.length) {
      statusEl.className = "empty";
      statusEl.textContent = "沒有可上牆語錄（需 verified，且 speech_id 不在 content_review_flags／hold 名單）。";
      return;
    }
    buildFilters();
    render();
  }).catch((err) => {
    statusEl.className = "error";
    statusEl.textContent = err.message + "。請用本機伺服器或 GitHub Pages 開啟（不要用 file://）。";
  });
})();
