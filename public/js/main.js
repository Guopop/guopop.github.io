(() => {
  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/events.js
  var THEME_CHANGE_EVENT = "chaos:themechange";
  var CODE_VARS_CHANGE_EVENT = "chaos:codevarschange";

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/announce.js
  var region = document.getElementById("theme-announcement");
  var timer = null;
  var ANNOUNCE_DELAY = 100;
  function announce(message) {
    if (!region || !message) return;
    clearTimeout(timer);
    region.textContent = "";
    timer = setTimeout(() => {
      region.textContent = message;
    }, ANNOUNCE_DELAY);
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/theme.js
  var THEME_AUTO = "auto";
  var THEME_DARK = "dark";
  var THEME_LIGHT = "light";
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  var storageKey = "theme-mode";
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  var labels = btn?.dataset ?? {};
  var NEXT_LABEL = { [THEME_DARK]: labels.labelToDark, [THEME_LIGHT]: labels.labelToLight, [THEME_AUTO]: labels.labelToAuto };
  var ANNOUNCEMENT = { [THEME_DARK]: labels.announceDark, [THEME_LIGHT]: labels.announceLight, [THEME_AUTO]: labels.announceAuto };
  function systemTheme() {
    return systemDark.matches ? THEME_DARK : THEME_LIGHT;
  }
  function getEffectiveTheme(mode) {
    return mode === THEME_AUTO ? systemTheme() : mode;
  }
  function getCurrentMode() {
    const stored = getStoredTheme();
    return stored === THEME_DARK || stored === THEME_LIGHT ? stored : THEME_AUTO;
  }
  function getNextMode(currentMode) {
    const system = systemTheme();
    const opposite = system === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    if (currentMode === THEME_AUTO) return opposite;
    return currentMode === opposite ? system : THEME_AUTO;
  }
  function applyTheme(mode) {
    const effectiveTheme = getEffectiveTheme(mode);
    const isDark = effectiveTheme === THEME_DARK;
    root.classList.toggle(THEME_DARK, isDark);
    document.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, {
      detail: { mode, theme: effectiveTheme }
    }));
    if (btn) {
      btn.textContent = mode === THEME_AUTO ? "\u{1F313}" : isDark ? "\u{1F319}" : "\u2600\uFE0F";
      const nextLabel = NEXT_LABEL[getNextMode(mode)];
      if (nextLabel) btn.setAttribute("aria-label", nextLabel);
    }
  }
  function announceTheme(mode) {
    announce(ANNOUNCEMENT[mode]);
  }
  function syncRemark42Theme() {
    const theme = getEffectiveTheme(getCurrentMode());
    if (window.remark_config) window.remark_config.theme = theme;
    window.REMARK42?.changeTheme?.(theme);
  }
  function watchRemark42Ready() {
    let origin;
    try {
      origin = new URL(window.remark_config?.host).origin;
    } catch {
      return;
    }
    const controller = new AbortController();
    window.addEventListener("message", (event) => {
      if (event.origin !== origin || typeof event.data?.height !== "number") return;
      controller.abort();
      syncRemark42Theme();
    }, { signal: controller.signal });
  }
  function getStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }
  function setStoredTheme(mode) {
    try {
      if (mode === THEME_AUTO) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, mode);
      }
    } catch {
    }
  }
  function initTheme() {
    const initialMode = getCurrentMode();
    applyTheme(initialMode);
    watchRemark42Ready();
    systemDark.addEventListener("change", () => {
      if (getCurrentMode() === THEME_AUTO) {
        applyTheme(THEME_AUTO);
        syncRemark42Theme();
      }
    });
    window.addEventListener("storage", (e) => {
      if (e.key === storageKey || e.key === null) {
        applyTheme(getCurrentMode());
        syncRemark42Theme();
      }
    });
    btn?.addEventListener("click", () => {
      const nextMode = getNextMode(getCurrentMode());
      applyTheme(nextMode);
      setStoredTheme(nextMode);
      announceTheme(nextMode);
      syncRemark42Theme();
    });
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/overlay.js
  function setupOverlayToggle(button, overlay, openClass) {
    if (!button || !overlay) return;
    const closeOverlay = () => {
      overlay.classList.remove(openClass);
      button.setAttribute("aria-expanded", "false");
    };
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = overlay.classList.toggle(openClass);
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    overlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeOverlay);
    });
    const onFocusOut = (e) => {
      if (!overlay.classList.contains(openClass)) return;
      const next = e.relatedTarget;
      if (next && !overlay.contains(next) && !button.contains(next)) {
        closeOverlay();
      }
    };
    overlay.addEventListener("focusout", onFocusOut);
    button.addEventListener("focusout", onFocusOut);
    return { overlay, button, openClass, closeOverlay };
  }
  function initOverlays() {
    const skipLink = document.querySelector(".skip-link");
    const main = document.getElementById("main-content");
    if (skipLink && main) {
      skipLink.addEventListener("click", () => {
        main.setAttribute("tabindex", "-1");
        main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
        main.focus({ preventScroll: true });
      });
    }
    const menuOverlay = setupOverlayToggle(
      document.getElementById("menuToggle"),
      document.getElementById("mainNav"),
      "menu-open"
    );
    const tocOverlay = setupOverlayToggle(
      document.getElementById("tocToggle"),
      document.getElementById("tableOfContents"),
      "toc-open"
    );
    const overlays = [menuOverlay, tocOverlay].filter(Boolean);
    if (overlays.length > 0) {
      document.addEventListener("click", (e) => {
        overlays.forEach(({ overlay, button, openClass, closeOverlay }) => {
          if (overlay.classList.contains(openClass)) {
            if (!button.contains(e.target) && !overlay.contains(e.target)) {
              closeOverlay();
            }
          }
        });
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          overlays.forEach(({ overlay, button, openClass, closeOverlay }) => {
            if (overlay.classList.contains(openClass)) {
              closeOverlay();
              button.focus();
            }
          });
        }
      });
    }
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/scrollspy.js
  var root2 = document.documentElement;
  function setupScrollSpy(navContainer, targetSelector) {
    if (!navContainer) return;
    const targets = document.querySelectorAll(targetSelector);
    if (targets.length === 0) return;
    let currentActive = null;
    const navHeight = getComputedStyle(root2).getPropertyValue("--nav-height").trim() || "80px";
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const navLink = navContainer.querySelector(`a[href="#${CSS.escape(id)}"]`);
        if (navLink && entry.isIntersecting) {
          if (currentActive && currentActive !== navLink) {
            currentActive.classList.remove("active");
          }
          navLink.classList.add("active");
          currentActive = navLink;
        }
      });
    }, {
      rootMargin: `-${navHeight} 0px -70% 0px`,
      threshold: 0
    });
    targets.forEach((target) => observer.observe(target));
  }
  function initScrollSpy() {
    setupScrollSpy(document.getElementById("tableOfContents"), "article h2[id], article h3[id], article h4[id]");
    setupScrollSpy(document.querySelector(".sidebar-tag-nav"), "#hot-tags, .tag-letter-group[id]");
    setupScrollSpy(document.querySelector(".sidebar-year-list"), ".archive-year-section[id]");
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/print-footnotes.js
  var printNotes = document.getElementById("print-references");
  var articlePost = document.querySelector("article.post");
  var BACK = "\u21A9\uFE0E";
  var restore = [];
  function undo() {
    restore.reverse().forEach((step) => step());
    restore = [];
    printNotes.replaceChildren();
  }
  function footnoteSection() {
    return articlePost.querySelector(".footnotes");
  }
  var [OPEN, CLOSE] = /^(zh|ja|ko)\b/i.test(document.documentElement.lang) ? ["\uFF08", "\uFF09"] : [" (", ")"];
  var BARE_URL_RE = /^[a-z][a-z0-9+.-]*:\/\//i;
  var HTTPS_ORIGIN_RE = /^https:\/\/([^/@:?#]+)(?:\/?$|([/?#].*))/;
  var CHROME_SELECTOR = ".meta, .footnotes, .series-nav, .post-footer, .print-only, #remark42, .pager";
  var displayUrl = (url) => url.replace(HTTPS_ORIGIN_RE, "$1$2");
  function isNoteLink(link, pageUrl) {
    return Boolean(link.textContent.trim()) && /^(https?:|ftp:|telnet:)/i.test(link.protocol) && link.href.split("#")[0] !== pageUrl;
  }
  function urlLink(link) {
    const a = document.createElement("a");
    a.className = "print-url";
    a.href = link.href;
    a.textContent = displayUrl(link.href);
    return a;
  }
  function footnoteBody(item, pageUrl) {
    const copy = item.cloneNode(true);
    copy.querySelectorAll(".footnote-backref").forEach((back) => {
      const before = back.previousSibling;
      if (before?.nodeType === Node.TEXT_NODE) {
        before.textContent = before.textContent.replace(/[\s\u00A0]+$/, "");
      }
      back.remove();
    });
    copy.querySelectorAll("a[href]").forEach((link) => {
      if (!isNoteLink(link, pageUrl)) return;
      if (displayUrl(link.textContent.trim()) === displayUrl(link.href)) {
        link.replaceWith(urlLink(link));
      } else {
        link.after(OPEN, urlLink(link), CLOSE);
      }
    });
    copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    return [...copy.childNodes];
  }
  function numberNotes() {
    const notes = [];
    const footnoteNumbers = /* @__PURE__ */ new Map();
    const pageUrl = location.href.split("#")[0];
    for (const mark of articlePost.querySelectorAll("a[href]")) {
      if (mark.closest(CHROME_SELECTOR)) continue;
      if (mark.classList.contains("footnote-ref")) {
        const target = mark.getAttribute("href");
        let num2 = footnoteNumbers.get(target);
        if (num2 === void 0) {
          const item = articlePost.querySelector(`.footnotes li[id="${CSS.escape(target.slice(1))}"]`);
          if (!item) continue;
          num2 = notes.length + 1;
          footnoteNumbers.set(target, num2);
          notes.push({ backId: mark.parentElement.id, body: footnoteBody(item, pageUrl) });
        }
        const text = mark.textContent;
        mark.textContent = String(num2);
        mark.setAttribute("href", `#print-note-${num2}`);
        restore.push(() => {
          mark.textContent = text;
          mark.setAttribute("href", target);
        });
        continue;
      }
      if (!isNoteLink(mark, pageUrl)) continue;
      const isBareUrl = BARE_URL_RE.test(mark.textContent.trim());
      if (isBareUrl) mark.classList.add("print-url");
      const num = notes.length + 1;
      const backId = `print-note-ref-${num}`;
      const sup = document.createElement("sup");
      sup.id = backId;
      sup.className = "print-note-ref";
      const ref = document.createElement("a");
      ref.href = `#print-note-${num}`;
      ref.textContent = String(num);
      sup.append(ref);
      mark.after(sup);
      restore.push(() => {
        sup.remove();
        if (isBareUrl) mark.classList.remove("print-url");
      });
      notes.push({ backId, body: [urlLink(mark)] });
    }
    return notes;
  }
  function initPrintFootnotes() {
    window.addEventListener("beforeprint", () => {
      if (!printNotes || !articlePost) return;
      undo();
      const notes = numberNotes();
      if (notes.length === 0) return;
      const heading = document.createElement("h2");
      heading.textContent = printNotes.dataset.heading;
      const list = document.createElement("ol");
      list.append(...notes.map(({ backId, body }, index) => {
        const li = document.createElement("li");
        li.id = `print-note-${index + 1}`;
        const back = document.createElement("a");
        back.href = `#${backId}`;
        back.className = "print-note-backref";
        back.textContent = BACK;
        li.append(...body);
        const last = body.findLast((node) => node.nodeType === Node.ELEMENT_NODE);
        (last?.tagName === "P" ? last : li).append(" ", back);
        return li;
      }));
      printNotes.replaceChildren(heading, list);
      const section = footnoteSection();
      if (section) {
        section.hidden = true;
        restore.push(() => {
          section.hidden = false;
        });
      }
    });
    window.addEventListener("afterprint", () => {
      if (printNotes) undo();
    });
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/clipboard.js
  var { copiedLabel, copyFailedLabel } = document.body.dataset;
  var timers = /* @__PURE__ */ new WeakMap();
  async function copyWithFeedback(text, el, idleLabel, applyLabel) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
    }
    const label = ok ? copiedLabel : copyFailedLabel;
    el.classList.toggle("copied", ok);
    el.classList.toggle("failed", !ok);
    applyLabel(el, label);
    announce(label);
    clearTimeout(timers.get(el));
    timers.set(el, setTimeout(() => {
      el.classList.remove("copied", "failed");
      applyLabel(el, idleLabel);
    }, 2e3));
    return ok;
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/code-copy.js
  var setText = (el, label) => {
    el.textContent = label;
  };
  function initCodeCopy() {
    const blocks = document.querySelectorAll(".highlight");
    if (!blocks.length) return;
    const { copyLabel } = document.body.dataset;
    const scrollers = [];
    const syncOnBlur = (e) => syncTabStop(e.currentTarget);
    const syncTabStop = (pre) => {
      if (pre.scrollWidth > pre.clientWidth) {
        pre.tabIndex = 0;
      } else if (document.activeElement === pre) {
        pre.addEventListener("blur", syncOnBlur, { once: true });
      } else {
        pre.removeAttribute("tabindex");
      }
    };
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => syncTabStop(entry.target));
    });
    const rows = /* @__PURE__ */ new WeakMap();
    let activePair = null;
    const setPair = (next) => {
      if (next === activePair) return;
      activePair?.forEach((el) => el.classList.remove("is-hovered"));
      activePair = next;
      activePair?.forEach((el) => el.classList.add("is-hovered"));
    };
    const clearHover = () => setPair(null);
    const onLineOver = (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target.closest(".line, .lnt");
      if (el && !rows.has(el)) {
        const nums = e.currentTarget.querySelectorAll(".lntd:first-child .lnt");
        const lines = e.currentTarget.querySelectorAll(".lntd:last-child > pre > code > .line");
        if (nums.length === lines.length) {
          nums.forEach((num, i) => {
            const pair = [num, lines[i]];
            rows.set(num, pair);
            rows.set(lines[i], pair);
          });
        } else {
          rows.set(el, null);
        }
      }
      setPair(el ? rows.get(el) : null);
    };
    blocks.forEach((block) => {
      const lntable = block.querySelector(".lntable");
      const scroller = lntable?.querySelector(".lntd:last-child pre") || block.querySelector("pre");
      block.querySelectorAll("pre[tabindex]").forEach((pre) => {
        if (pre !== scroller) pre.removeAttribute("tabindex");
      });
      if (scroller) {
        scrollers.push(scroller);
        resizeObserver.observe(scroller);
      }
      if (lntable) {
        lntable.addEventListener("pointerover", onLineOver);
        lntable.addEventListener("pointerleave", clearHover);
      }
      const code = scroller || block.querySelector("code");
      const hasInlineLn = Boolean(code?.querySelector(".ln"));
      const btn2 = document.createElement("button");
      btn2.type = "button";
      btn2.className = "code-copy-btn";
      btn2.textContent = copyLabel;
      btn2.addEventListener("click", () => {
        const text = hasInlineLn ? Array.from(code.querySelectorAll(".cl"), (el) => el.textContent).join("") : code?.textContent ?? "";
        copyWithFeedback(text, btn2, copyLabel, setText);
      });
      block.append(btn2);
    });
    if (scrollers.length > 0) {
      const syncAll = () => scrollers.forEach(syncTabStop);
      document.fonts.ready.then(syncAll);
      document.addEventListener(CODE_VARS_CHANGE_EVENT, syncAll);
    }
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/heading-copy.js
  var setTitle = (el, label) => {
    el.title = label;
  };
  function initHeadingCopy() {
    const article = document.querySelector("article.post");
    const { headingLinkLabel } = document.body.dataset;
    if (!article || !headingLinkLabel) return;
    let decorated = false;
    article.querySelectorAll(":is(h2, h3, h4, h5, h6)[id]").forEach((heading, idx) => {
      if (heading.closest("#remark42, .footnotes")) return;
      decorated = true;
      const labelId = `heading-label-${idx}`;
      const span = document.createElement("span");
      span.id = labelId;
      span.append(...heading.childNodes);
      const anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = `#${heading.id}`;
      anchor.title = headingLinkLabel;
      anchor.setAttribute("aria-label", headingLinkLabel);
      anchor.setAttribute("aria-describedby", labelId);
      heading.setAttribute("aria-labelledby", labelId);
      heading.append(span, anchor);
    });
    if (!decorated) return;
    article.addEventListener("click", async (e) => {
      const anchor = e.target.closest(".heading-anchor");
      if (!anchor || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const hash = anchor.getAttribute("href");
      const url = new URL(hash, window.location.href);
      try {
        window.history.replaceState(null, "", url);
      } catch {
      }
      if (!await copyWithFeedback(url.href, anchor, headingLinkLabel, setTitle)) {
        window.location.hash = hash;
      }
    });
  }

  // ns-hugo-imp:/Users/guopop/Developer/Apps/guopop.github.io/themes/chaos/assets/js/modules/bilingual-select.js
  function initBilingualSelect() {
    const lists = document.querySelectorAll("dl.bilingual");
    if (!lists.length) return;
    const setCol = (col) => {
      for (const dl of lists) {
        if (col) {
          dl.dataset.selectCol = col;
        } else {
          delete dl.dataset.selectCol;
        }
      }
    };
    document.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (e.altKey) {
        setCol("");
        return;
      }
      const target = e.target instanceof Element ? e.target : null;
      const cell = target?.closest("dl.bilingual > dt, dl.bilingual > dd");
      const sideBySide = cell && getComputedStyle(cell.parentElement).display === "grid";
      setCol(sideBySide ? cell.tagName.toLowerCase() : "");
    });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        setCol("");
      }
    });
  }

  // <stdin>
  initTheme();
  initOverlays();
  initScrollSpy();
  initPrintFootnotes();
  initCodeCopy();
  initHeadingCopy();
  initBilingualSelect();
})();
