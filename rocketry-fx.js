(() => {
  if (window.__uwaFx) return;
  window.__uwaFx = true;
  const AMBER = "oklch(0.82 0.15 80)";
  const MONO = "inherit"; // site font; numbers use tabular figures so counters don't jiggle
  const TARGET_FT = 328084; // Kármán line, 100 km
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const done = new WeakSet();
  const css = (el, s) => (Object.assign(el.style, s), el);
  const mk = (tag, s, html) => { const e = css(document.createElement(tag), s); if (html) e.innerHTML = html; return e; };
  const scrollMax = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const supportsAdd = (() => { try { const a = document.documentElement.animate([{ transform: "none" }, { transform: "none" }], { duration: 1, composite: "add" }); const ok = a.effect && a.effect.composite === "add"; a.cancel(); return ok; } catch (e) { return false; } })();

  // ---- Altitude gauge ----
  let gauge, fill, marker, label, idle;
  function buildGauge() {
    gauge = mk("div", { position: "fixed", right: "26px", top: "50%", transform: "translateY(-50%)", height: "min(66vh, 580px)", width: "2px", background: "oklch(0.3 0 0)", zIndex: "40", pointerEvents: "none", transition: "opacity .4s" });
    for (let i = 0; i <= 10; i++) {
      const major = i % 5 === 0;
      gauge.appendChild(mk("div", { position: "absolute", bottom: i * 10 + "%", right: "0", width: major ? "12px" : "7px", height: "1px", background: major ? "oklch(0.6 0 0)" : "oklch(0.42 0 0)" }));
      if (major) gauge.appendChild(mk("div", { position: "absolute", bottom: i * 10 + "%", left: "8px", transform: "translateY(50%)", fontFamily: MONO, fontVariantNumeric: "tabular-nums", fontSize: "10px", letterSpacing: "0.06em", color: "oklch(0.62 0 0)" }, i === 0 ? "0" : i === 10 ? "100 KM" : i * 10 + " KM"));
    }
    fill = mk("div", { position: "absolute", bottom: "0", left: "-0.5px", width: "3px", height: "0%", background: `linear-gradient(to top, oklch(0.82 0.15 80 / 0.1), ${AMBER})`, boxShadow: "0 0 10px oklch(0.82 0.15 80 / 0.6)" });
    marker = mk("div", { position: "absolute", bottom: "0%", left: "-6px", width: "0", height: "0", borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: `14px solid ${AMBER}`, transform: "translateY(50%)", filter: "drop-shadow(0 0 6px oklch(0.82 0.15 80 / 0.8))" });
    label = mk("div", { position: "absolute", right: "18px", bottom: "0", transform: "translateY(50%)", fontFamily: MONO, fontVariantNumeric: "tabular-nums", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", color: AMBER, whiteSpace: "nowrap", background: "oklch(0.12 0 0 / 0.9)", border: "1px solid oklch(0.82 0.15 80 / 0.4)", padding: "4px 8px", borderRadius: "3px", transition: "opacity .35s", opacity: "0.55" });
    gauge.append(fill, marker, label);
    gauge.setAttribute("aria-hidden", "true");
    document.body.appendChild(gauge);
  }
  function updateGauge(fromScroll) {
    if (!gauge) return;
    gauge.style.display = innerWidth >= 1000 ? "block" : "none";
    const p = Math.min(1, Math.max(0, scrollY / scrollMax()));
    const pct = (p * 100).toFixed(2) + "%";
    fill.style.height = pct; marker.style.bottom = pct; label.style.bottom = pct;
    label.textContent = p >= 0.995 ? "100 KM \u00b7 SPACE" : "ALT " + Math.round(p * TARGET_FT).toLocaleString("en-AU") + " FT";
    if (fromScroll) { label.style.opacity = "1"; clearTimeout(idle); idle = setTimeout(() => (label.style.opacity = "0.55"), 1400); }
  }

  // ---- Launch (back to top) button ----
  let btn, flying = false;
  function buildButton() {
    btn = mk("button", { position: "fixed", right: "22px", bottom: "22px", width: "54px", height: "54px", borderRadius: "999px", border: "1px solid oklch(0.82 0.15 80 / 0.6)", background: "oklch(0.15 0 0 / 0.92)", color: AMBER, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: "45", opacity: "0", transform: "translateY(12px)", pointerEvents: "none", transition: "opacity .3s, transform .3s, border-color .2s", padding: "0" });
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2.5c3 2.6 4.4 6 4.4 10v4.2H7.6v-4.2c0-4 1.4-7.4 4.4-10z"/><path d="M7.6 13.5 5 16.2v2.3l2.6-1.1M16.4 13.5l2.6 2.7v2.3l-2.6-1.1"/><circle cx="12" cy="9.5" r="1.6"/></svg>';
    const trail = mk("span", { position: "absolute", top: "100%", left: "50%", width: "6px", height: "0", marginLeft: "-3px", borderRadius: "3px", filter: "blur(1px)", boxShadow: "0 0 14px oklch(0.82 0.15 80 / 0.8)", background: `linear-gradient(oklch(0.97 0.05 90), ${AMBER} 25%, oklch(0.82 0.15 80 / 0))`, pointerEvents: "none" });
    btn.appendChild(trail);
    btn.onmouseenter = () => { btn.style.borderColor = AMBER; if (!flying && !reduced) btn.animate([{ transform: "translateY(0)" }, { transform: "translateY(-1.5px) translateX(0.8px)" }, { transform: "translateY(0.5px) translateX(-0.8px)" }, { transform: "translateY(0)" }], { duration: 160, iterations: 3 }); };
    btn.onmouseleave = () => (btn.style.borderColor = "oklch(0.82 0.15 80 / 0.6)");
    btn.onclick = () => {
      if (flying) return;
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (reduced) return;
      flying = true;
      trail.animate([{ height: "0px", opacity: 1 }, { height: "140px", opacity: 1 }, { height: "260px", opacity: 0 }], { duration: 1100, easing: "ease-out", fill: "forwards" });
      const a = btn.animate([{ transform: "translateY(0)" }, { transform: "translateY(3px) translateX(-2px)", offset: 0.08 }, { transform: "translateY(4px) translateX(2px)", offset: 0.16 }, { transform: "translateY(2px) translateX(-1px)", offset: 0.24 }, { transform: "translateY(-110vh)" }], { duration: 1100, easing: "cubic-bezier(.55,0,.8,.4)", fill: "forwards" });
      a.onfinish = () => setTimeout(() => { a.cancel(); trail.getAnimations().forEach((x) => x.cancel()); flying = false; updateButton(); }, 400);
    };
    document.body.appendChild(btn);
  }
  function updateButton() {
    if (!btn || flying) return;
    const show = scrollY > 600;
    btn.style.opacity = show ? "1" : "0";
    btn.style.transform = show ? "none" : "translateY(12px)";
    btn.style.pointerEvents = show ? "auto" : "none";
  }

  // ---- In-view helper ----
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); e.target.__fxRun && e.target.__fxRun(); } }), { rootMargin: "0px 0px -8% 0px" });

  // ---- Mono labels type in ----
  function armTyping(el) {
    const node = el.firstChild;
    if (!node || node.nodeType !== 3 || el.childNodes.length !== 1) return;
    const text = node.nodeValue;
    if (!text.trim() || text.includes("{{")) return;
    el.style.minHeight = el.offsetHeight + "px";
    node.nodeValue = "\u00a0";
    el.__fxRun = () => {
      let i = 0;
      const step = () => {
        i += 1;
        node.nodeValue = text.slice(0, i) + (i < text.length ? "\u258C" : "");
        if (i < text.length) setTimeout(step, 38);
        else { el.style.minHeight = ""; let b = 0; const blink = setInterval(() => { node.nodeValue = text + (b % 2 ? "" : "\u258C"); if (++b > 5) { clearInterval(blink); node.nodeValue = text; } }, 260); }
      };
      setTimeout(step, 120);
    };
    io.observe(el);
  }

  // ---- Telemetry counters ----
  function armCounter(el) {
    const node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    const text = node.nodeValue;
    el.__fxRun = () => {
      const t0 = performance.now(), dur = 1600;
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const lock = Math.floor(k * text.length);
        node.nodeValue = text.replace(/\d/g, (d, idx) => (idx < lock ? d : String((Math.random() * 10) | 0)));
        if (k < 1) requestAnimationFrame(tick); else node.nodeValue = text;
      };
      requestAnimationFrame(tick);
    };
    io.observe(el);
  }

  // ---- Hero push-in / countdown ----
  function pushIn(img, delay) {
    if (!img || reduced || !supportsAdd) return;
    img.animate([{ transform: "scale(1.16)" }, { transform: "scale(1)" }], { duration: 3200, delay: delay || 0, easing: "cubic-bezier(.2,.7,.2,1)", composite: "add", fill: "backwards" });
  }
  function shake(img) {
    if (!img || reduced || !supportsAdd) return;
    const f = []; for (let i = 0; i < 18; i++) f.push({ transform: `translate(${(Math.random() * 14 - 7).toFixed(1)}px, ${(Math.random() * 14 - 7).toFixed(1)}px)` });
    f.push({ transform: "translate(0,0)" });
    img.animate(f, { duration: 900, easing: "linear", composite: "add" });
  }
  function runCountdown(fig) {
    const img = fig.querySelector("img");
    pushIn(img); return;
    sessionStorage.setItem("uwa-fx-countdown", "1");
    const box = mk("div", { position: "absolute", inset: "0", zIndex: "2", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", background: "oklch(0.08 0 0 / 0.55)", fontFamily: MONO, fontVariantNumeric: "tabular-nums", fontSize: "clamp(34px, 5vw, 64px)", fontWeight: "500", letterSpacing: "0.06em", color: "oklch(0.95 0 0)", transition: "opacity .6s" });
    const dot = mk("span", { width: "14px", height: "14px", borderRadius: "50%", background: AMBER, boxShadow: "0 0 16px oklch(0.82 0.15 80 / 0.9)" });
    const txt = mk("span", {});
    box.append(dot, txt);
    fig.appendChild(box);
    dot.animate([{ opacity: 1 }, { opacity: 0.2 }], { duration: 300, iterations: Infinity, direction: "alternate" });
    if (img) img.style.filter = "brightness(0.6)";
    let n = 10;
    const tick = () => {
      if (n > 0) { txt.textContent = "T\u2013" + String(n).padStart(2, "0"); n -= 1; txt.animate([{ transform: "scale(1.25)", opacity: 0.4 }, { transform: "scale(1)", opacity: 1 }], { duration: 260, easing: "ease-out" }); setTimeout(tick, 300); return; }
      txt.textContent = "LIFTOFF"; txt.style.color = AMBER; dot.remove(); box.style.background = "transparent"; box.style.textShadow = "0 0 24px oklch(0.82 0.15 80 / 0.8)";
      const flash = mk("div", { position: "absolute", inset: "0", zIndex: "1", pointerEvents: "none", background: "radial-gradient(circle at 50% 85%, oklch(0.97 0.08 85 / 0.9), oklch(0.82 0.15 80 / 0) 65%)" }); fig.appendChild(flash); flash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1200, easing: "ease-out", fill: "forwards" }).onfinish = () => flash.remove();
      if (img) { img.style.transition = "filter .8s"; img.style.filter = ""; }
      shake(img); pushIn(img);
      setTimeout(() => (box.style.opacity = "0"), 1400);
      setTimeout(() => box.remove(), 2300);
    };
    tick();
  }


  // ---- Mobile menu ----
  function buildMenu() {
    const header = document.querySelector("header");
    const nav = header && header.querySelector("nav");
    if (!nav || header.__fxMenu) return;
    header.__fxMenu = true;
    const orig = nav.getAttribute("style") || "";
    const btn = mk("button", { display: "none", alignItems: "center", gap: "8px", padding: "9px 14px", border: "1px solid oklch(0.36 0 0)", borderRadius: "999px", background: "transparent", color: "oklch(0.95 0 0)", fontFamily: MONO, fontVariantNumeric: "tabular-nums", fontSize: "11.5px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" });
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Menu");
    header.appendChild(btn);
    let open = false;
    const apply = () => {
      const narrow = innerWidth < 900;
      btn.style.display = narrow ? "flex" : "none";
      btn.textContent = open ? "Close" : "Menu";
      btn.setAttribute("aria-expanded", String(open));
      if (!narrow) { open = false; nav.setAttribute("style", orig); return; }
      nav.setAttribute("style", orig);
      Object.assign(nav.style, open
        ? { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "0", width: "100%", order: "3", fontSize: "13px", padding: "8px 0 6px" }
        : { display: "none" });
      [...nav.children].map((c) => (c.tagName === "A" ? c : c.querySelector("a"))).forEach((a) => { a.style.padding = open ? (a.href.includes("Join") ? "12px 16px" : "13px 0") : ""; a.style.borderBottom = open && !a.href.includes("Join") ? "1px solid oklch(0.22 0 0)" : ""; a.style.textAlign = open && a.href.includes("Join") ? "center" : ""; a.style.marginTop = open && a.href.includes("Join") ? "12px" : ""; });
    };
    btn.onclick = () => { open = !open; apply(); };
    nav.addEventListener("click", (e) => { if (e.target.closest("a") && open) { open = false; apply(); } });
    addEventListener("resize", apply);
    apply();
  }


  // ---- Current page in nav + skip link ----
  function markNav() {
    const nav = document.querySelector("header nav");
    if (!nav || nav.__fxMarked) return;
    nav.__fxMarked = true;
    const here = decodeURIComponent(location.pathname.split("/").pop() || "index.html").toLowerCase();
    [...nav.querySelectorAll("a")].forEach((a) => {
      const file = decodeURIComponent((a.getAttribute("href") || "").split("#")[0].split("/").pop()).toLowerCase();
      if (!file || file !== here || /join/.test(file) || (a.getAttribute("href") || "").includes("#")) return;
      a.setAttribute("aria-current", "page");
      a.style.color = "oklch(0.97 0 0)";
      a.style.boxShadow = "inset 0 -2px 0 " + AMBER;
      a.style.paddingBottom = "4px";
    });
  }
  function skipLink() {
    if (document.getElementById("fx-skip")) return;
    const header = document.querySelector("header");
    const main = header && header.nextElementSibling;
    if (!main) return;
    if (!main.id) main.id = "main";
    main.setAttribute("tabindex", "-1");
    main.style.outline = "none";
    const a = mk("a", { position: "fixed", left: "12px", top: "-60px", zIndex: "100", padding: "10px 16px", borderRadius: "999px", background: "oklch(0.8 0.16 78)", color: "oklch(0.12 0 0)", fontWeight: "600", fontSize: "14px", transition: "top .15s" });
    a.id = "fx-skip"; a.href = "#" + main.id; a.textContent = "Skip to content";
    a.onfocus = () => (a.style.top = "12px"); a.onblur = () => (a.style.top = "-60px");
    document.body.prepend(a);
  }

  // ---- Scan (content streams in) ----
  function scan() {
    document.querySelectorAll("p").forEach((el) => {
      if (done.has(el)) return;
      const s = el.style;
      const txt = el.textContent.trim();
      if (!txt || el.closest("header, footer, nav")) return;
      if (s.textTransform === "uppercase" && (s.letterSpacing === "0.14em" || s.letterSpacing === "0.16em") && txt.length < 80) {
        done.add(el); if (!reduced) armTyping(el); return;
      }
      if (s.fontWeight === "700" && /\d/.test(txt) && txt.length <= 10 && parseFloat(getComputedStyle(el).fontSize) >= 20) {
        done.add(el); if (!reduced) armCounter(el);
      }
    });
    const cd = document.querySelector("[data-fx-countdown]");
    if (cd && !done.has(cd) && cd.querySelector("img")) { done.add(cd); runCountdown(cd); }
    if (!cd && !done.has(document.body)) {
      const sec = document.querySelector("header ~ section");
      const img = sec && sec.querySelector("img");
      if (img && img.getBoundingClientRect().top < innerHeight) { done.add(document.body); pushIn(img); }
    }
  }

  function init() {
    buildGauge(); buildButton();
    addEventListener("scroll", () => { updateGauge(true); updateButton(); }, { passive: true });
    addEventListener("resize", () => updateGauge(false));
    updateGauge(false); updateButton();
    scan(); buildMenu(); markNav(); skipLink();
    let n = 0; const iv = setInterval(() => { scan(); buildMenu(); markNav(); skipLink(); updateGauge(false); if (++n > 25) clearInterval(iv); }, 200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  // ---- Hero launch video: muted autoplay, paused off-screen and for reduced motion ----
  (function heroVideo() {
    const start = () => {
      const v = document.querySelector("video[data-hero-video]");
      if (!v) return false;
      v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
      const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (still) { v.removeAttribute("autoplay"); v.pause(); return true; }
      const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? play() : v.pause())), { threshold: 0.15 }).observe(v);
      } else play();
      return true;
    };
    if (!start()) { let n = 0; const t = setInterval(() => { if (start() || ++n > 40) clearInterval(t); }, 250); }
  })();
})();
