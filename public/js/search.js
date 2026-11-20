(() => {
  // <stdin>
  var HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" };
  function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, (ch) => HTML_ESCAPES[ch]);
  }
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var POSTING_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
  var DIGIT_VALUES = new Uint8Array(128);
  for (let i = 0; i < POSTING_DIGITS.length; i++) {
    DIGIT_VALUES[POSTING_DIGITS.charCodeAt(i)] = i;
  }
  function decodePostings(text) {
    const ids = [];
    let prev = -1;
    let gap = 0;
    let shift = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code === 32) {
        prev = -1;
        continue;
      }
      const digit = DIGIT_VALUES[code];
      gap |= (digit & 31) << shift;
      if (digit & 32) {
        shift += 5;
      } else {
        prev += gap + 1;
        ids.push(prev);
        gap = 0;
        shift = 0;
      }
    }
    return ids;
  }
  function addPostings({ index, vocab, fold }, data) {
    if (typeof data?.terms !== "string" || typeof data.postings !== "string") {
      throw new Error("unsupported index format");
    }
    if (typeof data.fold === "string") {
      for (let i = 0; i + 1 < data.fold.length; i += 2) {
        fold.set(data.fold[i], data.fold[i + 1]);
      }
    }
    if (!data.terms) return;
    vocab.push(` ${data.terms} `);
    const terms = data.terms.split(" ");
    const lists = data.postings.split(" ");
    for (let i = 0; i < terms.length; i++) {
      const prior = index.get(terms[i]);
      index.set(terms[i], prior === void 0 ? lists[i] : `${prior} ${lists[i]}`);
    }
  }
  function oneEditApart(vocab, start, end, word) {
    let head = 0;
    const shorter = Math.min(end - start, word.length);
    while (head < shorter && vocab.charCodeAt(start + head) === word.charCodeAt(head)) head++;
    let termEnd = end - start;
    let wordEnd = word.length;
    while (termEnd > head && wordEnd > head && vocab.charCodeAt(start + termEnd - 1) === word.charCodeAt(wordEnd - 1)) {
      termEnd--;
      wordEnd--;
    }
    const termLeft = termEnd - head;
    const wordLeft = wordEnd - head;
    if (termLeft + wordLeft === 1 || termLeft === 1 && wordLeft === 1) return true;
    return termLeft === 2 && wordLeft === 2 && vocab.charCodeAt(start + head) === word.charCodeAt(head + 1) && vocab.charCodeAt(start + head + 1) === word.charCodeAt(head);
  }
  function initSearch() {
    const dialog = document.getElementById("searchDialog");
    const input = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("searchResults");
    const closeBtn = document.getElementById("searchClose");
    const toggleBtn = document.getElementById("searchToggle");
    const statusRegion = document.getElementById("searchStatus");
    if (!dialog || !input || !resultsContainer) {
      return;
    }
    let indexData = null;
    let docText = [];
    let coreLoad = null;
    let bodyRequested = false;
    let selectedIndex = -1;
    let currentResults = [];
    let debounceTimer = null;
    const initialHTML = resultsContainer.innerHTML;
    const { msgLoading, msgEmpty, msgCount, msgError, msgDeprecated } = dialog.dataset;
    let lastAnnouncement = "";
    let announceTimer = null;
    function announceStatus(message, query = "") {
      if (!statusRegion || !message) return;
      const key = `${query}
${message}`;
      if (key === lastAnnouncement) return;
      lastAnnouncement = key;
      clearTimeout(announceTimer);
      statusRegion.textContent = "";
      announceTimer = setTimeout(() => {
        statusRegion.textContent = message;
      }, 100);
    }
    function resetAnnouncement() {
      lastAnnouncement = "";
      if (!statusRegion) return;
      clearTimeout(announceTimer);
      statusRegion.textContent = "";
    }
    function resetCombobox() {
      selectedIndex = -1;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    }
    async function fetchJSON(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }
    function loadIndex() {
      coreLoad ??= (async () => {
        resetCombobox();
        resultsContainer.innerHTML = `<div class="search-loading">${escapeHTML(msgLoading)}</div>`;
        const loadingTimer = setTimeout(() => {
          if (dialog.open) announceStatus(msgLoading);
        }, 400);
        try {
          const raw = await fetchJSON(dialog.dataset.indexUrl);
          if (!Array.isArray(raw.docs)) throw new Error("unsupported index format");
          indexData = { docs: raw.docs, index: /* @__PURE__ */ new Map(), vocab: [], fold: /* @__PURE__ */ new Map() };
          docText = [];
          addPostings(indexData, raw);
          resultsContainer.innerHTML = initialHTML;
          return true;
        } catch (err) {
          coreLoad = null;
          resetCombobox();
          resultsContainer.innerHTML = `<div class="search-error">${escapeHTML(msgError)} (${escapeHTML(err.message)})</div>`;
          if (dialog.open) announceStatus(msgError);
          return false;
        } finally {
          clearTimeout(loadingTimer);
        }
      })();
      return coreLoad;
    }
    function scheduleBodyLoad() {
      const bodyUrl = dialog.dataset.bodyIndexUrl;
      if (bodyRequested || !bodyUrl) return;
      bodyRequested = true;
      const load = async () => {
        try {
          addPostings(indexData, await fetchJSON(bodyUrl));
          docText = [];
          if (dialog.open && input.value.trim()) performSearch(input.value);
        } catch {
          bodyRequested = false;
        }
      };
      if (window.requestIdleCallback) {
        window.requestIdleCallback(load, { timeout: 1500 });
      } else {
        setTimeout(load, 150);
      }
    }
    async function openSearch() {
      dialog.showModal();
      input.focus();
      if (!await loadIndex() || !dialog.open) return;
      scheduleBodyLoad();
      if (input.value.trim()) performSearch(input.value);
    }
    dialog.addEventListener("close", () => {
      input.value = "";
      resultsContainer.innerHTML = initialHTML;
      currentResults = [];
      resetCombobox();
      resetAnnouncement();
    });
    toggleBtn?.addEventListener("click", openSearch);
    if (!("commandForElement" in HTMLButtonElement.prototype)) {
      closeBtn?.addEventListener("click", () => dialog.close());
    }
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const outside = (e) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      dialog.addEventListener("pointerdown", (e) => {
        pressedOutside = outside(e);
      });
      dialog.addEventListener("pointerup", (e) => {
        if (pressedOutside && outside(e)) dialog.close();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "/" && !dialog.open) {
        const tag = e.target?.tagName || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA" && !e.target.isContentEditable) {
          e.preventDefault();
          openSearch();
        }
      } else if (e.key === "Escape" && dialog.open) {
        dialog.close();
      }
    });
    function foldText(text) {
      const { fold } = indexData;
      if (fold.size === 0) return text;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        out += fold.get(text[i]) ?? text[i];
      }
      return out;
    }
    function matchText(id) {
      return docText[id] ??= (({ title, summary, tags }) => ({
        title: foldText((title || "").toLowerCase()),
        summary: foldText((summary || "").toLowerCase()),
        tags: foldText((tags || []).join(" ").toLowerCase())
      }))(indexData.docs[id]);
    }
    const LATIN_WORD = /^[a-z0-9.+#]+$/;
    function findTerms(text, limit, atStart) {
      const found = /* @__PURE__ */ new Set();
      const needle = atStart ? ` ${text}` : text;
      for (const vocab of indexData.vocab) {
        let from = 0;
        while (found.size < limit) {
          const at = vocab.indexOf(needle, from);
          if (at === -1) break;
          const start = atStart ? at + 1 : vocab.lastIndexOf(" ", at) + 1;
          from = vocab.indexOf(" ", start);
          found.add(vocab.slice(start, from));
        }
      }
      return found;
    }
    const MISSPELLABLE = /^(?=.*[a-z])[a-z0-9]{4,}$/;
    function nearTerms(word, limit) {
      const found = /* @__PURE__ */ new Set();
      for (const vocab of indexData.vocab) {
        let start = 1;
        while (start < vocab.length && found.size < limit) {
          const end = vocab.indexOf(" ", start);
          if (Math.abs(end - start - word.length) <= 1 && oneEditApart(vocab, start, end, word)) {
            found.add(vocab.slice(start, end));
          }
          start = end + 1;
        }
      }
      return found;
    }
    function startsTerm(word) {
      return indexData.index.has(word) || findTerms(word, 1, true).size > 0;
    }
    function insideTerm(text) {
      return findTerms(text, 1, false).size > 0;
    }
    function extractTokens(query) {
      const q = foldText(query.trim().toLowerCase());
      if (!q) return [];
      const { index } = indexData;
      const tokens = [];
      for (const word of q.match(/[a-z0-9.+#]+/g) || []) {
        if (!/[.+#]/.test(word) || startsTerm(word)) {
          tokens.push(word);
        } else {
          tokens.push(...word.split(/[.+#]+/));
        }
      }
      const cjkChars = q.replace(/[a-z0-9_\-.+#\s]+/g, "");
      if (cjkChars) {
        const len = cjkChars.length;
        const covered = /* @__PURE__ */ new Set();
        for (let i = 0; i < len; i++) {
          for (let l = Math.min(6, len - i); l >= 2; l--) {
            const sub = cjkChars.slice(i, i + l);
            if (index.has(sub)) {
              tokens.push(sub);
              for (let k = 0; k < l; k++) covered.add(i + k);
            }
          }
        }
        for (let i = 0; i < len; i++) {
          if (covered.has(i)) continue;
          let end = i + 1;
          while (end < len && !covered.has(end)) end++;
          for (let l = end - i; l >= 2; l--) {
            const sub = cjkChars.slice(i, i + l);
            if (insideTerm(sub)) {
              tokens.push(sub);
              for (let k = 0; k < l; k++) covered.add(i + k);
              break;
            }
          }
        }
        for (let i = 0; i < len; i++) {
          const single = cjkChars.charAt(i);
          if (!covered.has(i) && index.has(single)) {
            tokens.push(single);
          }
        }
      }
      return [...new Set(tokens)].filter(Boolean);
    }
    function highlightPattern(tokens) {
      const sortedTokens = [...tokens].sort((a, b) => b.length - a.length);
      return new RegExp(`(${sortedTokens.map(escapeRegExp).join("|")})`, "gi");
    }
    function highlightText(text, pattern) {
      const written = String(text ?? "");
      let html = "";
      let last = 0;
      for (const match of foldText(written).matchAll(pattern)) {
        const end = match.index + match[0].length;
        html += `${escapeHTML(written.slice(last, match.index))}<mark>${escapeHTML(written.slice(match.index, end))}</mark>`;
        last = end;
      }
      return html + escapeHTML(written.slice(last));
    }
    function performSearch(query) {
      if (!indexData) return;
      if (!query.trim()) {
        resultsContainer.innerHTML = initialHTML;
        currentResults = [];
        resetCombobox();
        resetAnnouncement();
        return;
      }
      const cleanQuery = foldText(query.trim().toLowerCase());
      let tokens = extractTokens(query);
      if (tokens.length === 0) {
        tokens = [cleanQuery];
      }
      const scores = {};
      const docTermHits = {};
      const corrections = [];
      const docs = indexData.docs;
      const index = indexData.index;
      const idf = (df, floor) => Math.max(floor, Math.log(1 + (docs.length - df + 0.5) / (df + 0.5)));
      const addHit = (id, weight, token) => {
        scores[id] = (scores[id] || 0) + weight;
        (docTermHits[id] ??= /* @__PURE__ */ new Set()).add(token);
      };
      for (const token of tokens) {
        if (index.has(token)) {
          const ids = decodePostings(index.get(token));
          const weight = idf(ids.length, 0.6);
          for (const id of ids) addHit(id, weight, token);
        } else if (token.length >= 2) {
          const partOf = findTerms(token, 50, LATIN_WORD.test(token));
          for (const term of partOf) {
            const ids = decodePostings(index.get(term));
            const weight = 0.35 * idf(ids.length, 0.3);
            for (const id of ids) addHit(id, weight, token);
          }
          if (partOf.size === 0 && MISSPELLABLE.test(token)) {
            for (const term of nearTerms(token, 8)) {
              const ids = decodePostings(index.get(term));
              const weight = 0.2 * idf(ids.length, 0.3);
              for (const id of ids) addHit(id, weight, token);
              corrections.push(term);
            }
          }
        }
      }
      const numTokens = tokens.length;
      const fieldTokens = [...tokens, ...corrections];
      for (const idStr of Object.keys(scores)) {
        const id = Number(idStr);
        const doc = docs[id];
        const { title: titleLower, summary: summaryLower, tags: tagsLower } = matchText(id);
        if (cleanQuery.length >= 2) {
          if (titleLower === cleanQuery) {
            scores[id] += 120;
          } else if (titleLower.includes(cleanQuery)) {
            scores[id] += 60;
          }
          if (tagsLower.includes(cleanQuery)) {
            scores[id] += 45;
          }
          if (summaryLower.includes(cleanQuery)) {
            scores[id] += 25;
          }
        }
        for (const token of fieldTokens) {
          if (titleLower.includes(token)) {
            scores[id] += 18;
            if (titleLower.startsWith(token)) {
              scores[id] += 6;
            }
          }
          if (tagsLower.includes(token)) {
            scores[id] += 12;
          }
        }
        if (numTokens > 1 && docTermHits[id]) {
          const matchedCount = docTermHits[id].size;
          const coverage = matchedCount / numTokens;
          if (matchedCount === numTokens) {
            scores[id] += 35;
          }
          scores[id] *= 0.5 + 0.5 * coverage;
        }
        if (doc.deprecated) {
          scores[id] *= 0.25;
        }
      }
      const rankedIds = Object.keys(scores).map(Number);
      rankedIds.sort((a, b) => {
        const diff = scores[b] - scores[a];
        return Math.abs(diff) > 1e-3 ? diff : a - b;
      });
      currentResults = rankedIds.slice(0, 25).map((id) => docs[id]);
      renderResults(currentResults, fieldTokens);
      announceStatus(
        currentResults.length ? msgCount?.replace("{count}", currentResults.length) : msgEmpty,
        cleanQuery
      );
    }
    function renderResults(results, tokens) {
      if (results.length === 0) {
        resultsContainer.innerHTML = `<div class="search-empty">${escapeHTML(msgEmpty)}</div>`;
        resetCombobox();
        return;
      }
      const pattern = highlightPattern(tokens);
      const items = results.map((doc, idx) => {
        const titleHighlighted = highlightText(doc.title, pattern);
        const summaryHighlighted = doc.summary ? highlightText(doc.summary, pattern) : "";
        const tagsHTML = doc.tags?.length ? `<span class="search-item-tags">${doc.tags.slice(0, 3).map((t) => `<span class="search-tag">${escapeHTML(t)}</span>`).join("")}</span>` : "";
        const deprecatedBadge = doc.deprecated ? ` <span class="search-badge-deprecated">${escapeHTML(msgDeprecated)}</span>` : "";
        return `<a href="${escapeHTML(doc.url)}" class="search-item-link" role="option" id="search-opt-${idx}" aria-selected="false"><div class="search-item-header"><span class="search-item-title">${titleHighlighted}${deprecatedBadge}</span><span class="search-item-date">${escapeHTML(doc.date)}</span></div>` + (summaryHighlighted ? `<div class="search-item-summary">${summaryHighlighted}</div>` : "") + tagsHTML + "</a>";
      });
      resultsContainer.innerHTML = `<div id="searchListbox" role="listbox">${items.join("")}</div>`;
      selectedIndex = -1;
      input.setAttribute("aria-expanded", "true");
      input.removeAttribute("aria-activedescendant");
    }
    function updateSelection(newIdx) {
      const options = resultsContainer.querySelectorAll('[role="option"]');
      if (options.length === 0) return;
      options[selectedIndex]?.setAttribute("aria-selected", "false");
      selectedIndex = newIdx < 0 ? options.length - 1 : newIdx >= options.length ? 0 : newIdx;
      const current = options[selectedIndex];
      current.setAttribute("aria-selected", "true");
      input.setAttribute("aria-activedescendant", current.id);
      current.scrollIntoView({ block: "nearest" });
    }
    input.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        updateSelection(selectedIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        updateSelection(selectedIndex - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = currentResults[selectedIndex] ?? currentResults[0];
        if (target) {
          window.location.href = target.url;
        }
      }
    });
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => performSearch(input.value), 150);
    });
  }
  initSearch();
})();
