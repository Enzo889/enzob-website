// @ts-nocheck

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { animate, inView, stagger } from "motion";

/* ─── helpers ─── */
const el = (id: string) => document.getElementById(id)!;
const qsa = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ═══════════════════════════════════════════════════════
   1. LENIS  —  autoRaf: false, driven by our own loop
   ═══════════════════════════════════════════════════════ */
export const lenis = new Lenis({
  duration: 1.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 2,
  autoRaf: false,
});

let rafId = 0;
function raf(time: number) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}
rafId = requestAnimationFrame(raf);

/* ═══════════════════════════════════════════════════════
   2. HUD CONTROLS
   ═══════════════════════════════════════════════════════ */
let lenisRunning = true;
let currentDuration = 1.6;

function stopLenis() {
  lenis.stop();
  lenisRunning = false;
  el("stopper-wheel").classList.remove("spinning");
  el("stopper-label").textContent = "🔴  Scroll locked";
  (el("stopper-label") as HTMLElement).style.color = "var(--red-bright)";
  el("btn-stop").classList.add("active");
  el("btn-start").classList.remove("active");
}
function startLenis() {
  lenis.start();
  lenisRunning = true;
  el("stopper-wheel").classList.add("spinning");
  el("stopper-label").textContent = "🟢  Lenis running";
  (el("stopper-label") as HTMLElement).style.color = "var(--text-dim)";
  el("btn-start").classList.add("active");
  el("btn-stop").classList.remove("active");
}
el("btn-stop").addEventListener("click", stopLenis);
el("btn-start").addEventListener("click", startLenis);
el("stopper-wheel").addEventListener("click", () =>
  lenisRunning ? stopLenis() : startLenis(),
);
el("btn-top").addEventListener("click", () =>
  lenis.scrollTo(0, { duration: 2 }),
);
el("btn-bottom").addEventListener("click", () =>
  lenis.scrollTo(document.body.scrollHeight, { duration: 2.5 }),
);

el("btn-slow").addEventListener("click", () => {
  currentDuration = 4;
  (lenis as any).options.duration = 4;
  el("stat-dur").textContent = "4s";
  el("btn-slow").classList.add("active");
  el("btn-fast").classList.remove("active");
});
el("btn-fast").addEventListener("click", () => {
  currentDuration = 0.4;
  (lenis as any).options.duration = 0.4;
  el("stat-dur").textContent = "0.4s";
  el("btn-fast").classList.add("active");
  el("btn-slow").classList.remove("active");
});

/* ═══════════════════════════════════════════════════════
   3. MOTION — Hero entrance (page load)
      animate + stagger on the split-char title
   ═══════════════════════════════════════════════════════ */
function splitToChars(el: HTMLElement) {
  const text = el.textContent!;
  el.textContent = "";
  el.style.overflow = "hidden";
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "hero-char";
    span.textContent = ch === " " ? "\u00a0" : ch;
    span.style.display = "inline-block";
    el.appendChild(span);
  });
  return qsa(".hero-char");
}

// hero title chars
const titleEl = el("hero-title") as HTMLElement;
const chars = splitToChars(titleEl);

animate(
  chars,
  {
    opacity: [0, 1],
    y: [120, 0],
    rotateX: [90, 0],
    filter: ["blur(20px)", "blur(0px)"],
  },
  {
    duration: 1,
    delay: stagger(0.08, { startDelay: 0.3 }),
    easing: [0.16, 1, 0.3, 1],
  },
);

// hero sub / eyebrow
animate(
  "#hero-eyebrow",
  { opacity: [0, 1], y: [20, 0] },
  { duration: 0.8, delay: 0.5, easing: "ease-out" },
);
animate(
  "#hero-sub",
  { opacity: [0, 1], y: [20, 0] },
  { duration: 0.8, delay: 0.9, easing: "ease-out" },
);
animate("#scroll-hint", { opacity: [0, 1] }, { duration: 1, delay: 1.4 });

/* ═══════════════════════════════════════════════════════
   SCROLL-ENTER SYSTEM
   Usage in HTML: data-enter="up|down|left|right|scale|flip"
                  data-enter-delay="0.2"   (optional, seconds)
                  data-enter-once="true"   (default: true)
   ═══════════════════════════════════════════════════════ */
const ENTER_PRESETS: Record<string, { from: object; to: object }> = {
  up: {
    from: { opacity: 0, y: 60, filter: "blur(6px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  down: {
    from: { opacity: 0, y: -60, filter: "blur(6px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  left: {
    from: { opacity: 0, x: -80, filter: "blur(8px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  right: {
    from: { opacity: 0, x: 80, filter: "blur(8px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  scale: {
    from: { opacity: 0, scale: 0.7, filter: "blur(10px)" },
    to: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  flip: {
    from: { opacity: 0, rotateX: 80, y: 40 },
    to: { opacity: 1, rotateX: 0, y: 0 },
  },
  slash: {
    from: { opacity: 0, x: -120, skewX: 20 },
    to: { opacity: 1, x: 0, skewX: 0 },
  },
};

qsa("[data-enter]").forEach((target) => {
  const dir = target.dataset.enter || "up";
  const delay = parseFloat(target.dataset.enterDelay || "0");
  const once = target.dataset.enterOnce !== "false"; // default true
  const preset = ENTER_PRESETS[dir] || ENTER_PRESETS.up;
  const duration = parseFloat(target.dataset.enterDuration || "0.7");

  // set initial state immediately
  Object.assign(target.style, {
    opacity: "0",
    willChange: "transform, opacity",
  });

  const doEnter = () => {
    animate(
      target,
      { ...preset.from, ...preset.to }, // Motion animates from→to
      {
        duration,
        delay,
        easing: [0.16, 1, 0.3, 1],
      },
    );
  };

  const stop = inView(
    target,
    () => {
      doEnter();
      if (once) stop(); // unobserve after first trigger
    },
    { amount: 0.18 },
  );
});

/* ═══════════════════════════════════════════════════════
   4. MOTION — inView section entrances
   ═══════════════════════════════════════════════════════ */

// Disco cards  — staggered 3D flip-in
inView(
  ".disco-grid",
  () => {
    animate(
      ".album-card",
      { opacity: [0, 1], y: [60, 0], rotateY: [-25, 0], scale: [0.9, 1] },
      { duration: 0.7, delay: stagger(0.1), easing: [0.16, 1, 0.3, 1] },
    );
  },
  { amount: 0.1 },
);

// Section headings — blur+slide
qsa<HTMLElement>(".reveal-heading").forEach((h) => {
  inView(
    h,
    () => {
      animate(
        h,
        { opacity: [0, 1], x: [-60, 0], filter: ["blur(12px)", "blur(0px)"] },
        { duration: 0.9, easing: [0.16, 1, 0.3, 1] },
      );
    },
    { amount: 0.5 },
  );
});

// Section bodies
qsa<HTMLElement>(".reveal-body").forEach((b) => {
  inView(
    b,
    () => {
      animate(
        b,
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.7, delay: 0.15, easing: "ease-out" },
      );
    },
    { amount: 0.5 },
  );
});

// Tags
qsa<HTMLElement>(".section-tag").forEach((t) => {
  inView(
    t,
    () => {
      animate(
        t,
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.5, easing: [0.34, 1.56, 0.64, 1] },
      );
    },
    { amount: 1 },
  );
});

// Tilt cards — cascade entrance
inView(
  ".tilt-grid",
  () => {
    animate(
      ".tilt-card",
      { opacity: [0, 1], y: [80, 0], scale: [0.85, 1] },
      { duration: 0.8, delay: stagger(0.09), easing: [0.16, 1, 0.3, 1] },
    );
  },
  { amount: 0.15 },
);

// H-scroll section header
inView("#h-scroll-label", () => {
  animate(
    "#h-scroll-label",
    { opacity: [0, 1], y: [-30, 0] },
    { duration: 0.6, easing: "ease-out" },
  );
});

// Scale section
inView(
  ".scale-img-wrap",
  () => {
    animate(
      ".scale-img",
      {
        scale: [0.75, 1],
        filter: ["brightness(0.4) blur(8px)", "brightness(1) blur(0px)"],
      },
      { duration: 1.2, easing: [0.16, 1, 0.3, 1] },
    );
    animate(
      ".scale-img-overlay",
      { opacity: [0, 1] },
      { duration: 0.6, delay: 0.6 },
    );
  },
  { amount: 0.3 },
);

// Clip reveal
inView(
  ".clip-img",
  () => {
    animate(
      ".clip-img",
      { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
      { duration: 1.1, easing: [0.77, 0, 0.175, 1] },
    );
  },
  { amount: 0.2 },
);

// Band quote word-by-word
inView(
  ".band-quote",
  () => {
    const words = qsa<HTMLSpanElement>(".band-quote .word");
    animate(
      words,
      { opacity: [0, 1], y: [30, 0] },
      {
        duration: 0.5,
        delay: stagger(0.08, { startDelay: 0.2 }),
        easing: "ease-out",
      },
    );
  },
  { amount: 0.4 },
);

// Anchor buttons
inView(
  ".anchors-grid",
  () => {
    animate(
      ".anchor-btn",
      { opacity: [0, 1], x: [-20, 0] },
      { duration: 0.4, delay: stagger(0.04), easing: "ease-out" },
    );
  },
  { amount: 0.1 },
);

/* ═══════════════════════════════════════════════════════
   5. MOTION — character scramble on char-reveal section
   ═══════════════════════════════════════════════════════ */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function scrambleText(el: HTMLElement, final: string, duration = 1200) {
  const frames = Math.round(duration / 16);
  let frame = 0;
  const iv = setInterval(() => {
    frame++;
    const progress = frame / frames;
    el.textContent = [...final]
      .map((ch, i) => {
        if (ch === " ") return " ";
        if (i / final.length < progress * 1.5) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    if (frame >= frames) {
      clearInterval(iv);
      el.textContent = final;
    }
  }, 16);
}

inView(
  "#s-chars",
  () => {
    const map2 = [
      { id: "cw-1", text: "PEOPLE" },
      { id: "cw-2", text: "=" },
      { id: "cw-3", text: "SHIT" },
    ];
    map2.forEach(({ id, text }, i) => {
      const w = document.getElementById(id)!;
      animate(
        w,
        { opacity: [0, 1], y: [50, 0] },
        { delay: i * 0.25, duration: 0.5, easing: "ease-out" },
      );
      setTimeout(() => scrambleText(w, text), i * 250 + 300);
    });
  },
  { amount: 0.4 },
);

/* ═══════════════════════════════════════════════════════
   6. LENIS scroll event — realtime effects
   ═══════════════════════════════════════════════════════ */
let marqueeX = 0;
let skewVal = 0;

lenis.on(
  "scroll",
  ({
    scroll,
    limit,
    velocity,
    direction,
    progress,
  }: {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
  }) => {
    // Status bar
    el("stat-y").textContent = Math.round(scroll).toString();
    el("stat-prog").textContent = (progress * 100).toFixed(1) + "%";
    el("stat-vel").textContent = velocity.toFixed(3);
    el("stat-dir").textContent = direction === 1 ? "↓" : "↑";

    // Progress bar
    (el("progress-bar") as HTMLElement).style.transform = `scaleX(${progress})`;

    // Direction arrow — Motion animate for smooth flip
    const arrow = el("dir-arrow") as HTMLElement;
    animate(
      arrow,
      { rotate: direction === 1 ? 0 : 180, color: ["#e74c3c"] },
      { duration: 0.3, easing: "ease-out" },
    );

    // ── Hero parallax (bg + title)
    const heroBg = el("hero-bg") as HTMLElement;
    if (heroBg) heroBg.style.transform = `translateY(${scroll * 0.4}px)`;

    // ── Body skew on high velocity (distortion effect)
    const targetSkew = clamp(velocity * -1.5, -6, 6);
    skewVal += (targetSkew - skewVal) * 0.12;
    (document.body as HTMLElement).style.transform = `skewY(${skewVal}deg)`;

    // ── Parallax images
    [
      { id: "para-1", sec: "s-parallax", depth: 0.22 },
      { id: "para-2", sec: "s-band", depth: 0.18 },
      { id: "para-3", sec: "s-p3", depth: 0.22 },
    ].forEach(({ id, sec, depth }) => {
      const img = document.getElementById(id) as HTMLElement;
      const section = document.getElementById(sec);
      if (img && section) {
        const top = section.getBoundingClientRect().top + scroll;
        img.style.transform = `translateY(${(scroll - top) * depth}px)`;
      }
    });

    // ── Velocity marquee
    marqueeX -= velocity * 22;
    const half = (el("marquee") as HTMLElement).scrollWidth / 2;
    if (marqueeX < -half) marqueeX += half;
    if (marqueeX > 0) marqueeX -= half;
    (el("marquee") as HTMLElement).style.transform =
      `translateX(${marqueeX}px)`;
    qsa<HTMLElement>(".marquee-item").forEach((item) => {
      item.classList.toggle("lit", Math.abs(velocity) > 0.22);
    });

    // ── Horizontal scroll gallery
    const hOuter = el("h-outer") as HTMLElement;
    const hTrack = el("h-track") as HTMLElement;
    if (hOuter && hTrack) {
      const r = hOuter.getBoundingClientRect();
      const oh = hOuter.offsetHeight - window.innerHeight;
      const ratio = clamp(-r.top / oh, 0, 1);
      const maxX = hTrack.scrollWidth - window.innerWidth;
      hTrack.style.transform = `translateX(${-maxX * ratio}px)`;
    }

    // ── Sticky counter 0–30 years
    const cOuter = el("s-counter") as HTMLElement;
    if (cOuter) {
      const r = cOuter.getBoundingClientRect();
      const h = cOuter.offsetHeight - window.innerHeight;
      const ratio = clamp(-r.top / h, 0, 1);
      el("counter-num").textContent = Math.round(ratio * 30).toString();
    }
  },
);

/* ═══════════════════════════════════════════════════════
   7. MOTION — 3D tilt cards (Desktop only)
   ═══════════════════════════════════════════════════════ */
if (!window.matchMedia("(pointer: coarse)").matches) {
  qsa<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      animate(
        card,
        { scale: 1.05 },
        { duration: 0.3, easing: [0.34, 1.56, 0.64, 1] },
      );
    });
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e as MouseEvent).clientX - r.left) / r.width - 0.5;
      const y = ((e as MouseEvent).clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) scale(1.05) rotateY(${x * 24}deg) rotateX(${-y * 24}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      animate(card, { scale: 1 }, { duration: 0.5, easing: [0.16, 1, 0.3, 1] });
      card.style.transform =
        "perspective(700px) scale(1) rotateY(0deg) rotateX(0deg)";
    });
  });
}

/* ═══════════════════════════════════════════════════════
   8. MOTION — magnetic HUD buttons (Desktop only)
   ═══════════════════════════════════════════════════════ */
if (!window.matchMedia("(pointer: coarse)").matches) {
  qsa<HTMLElement>(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - r.left - r.width / 2;
      const y = (e as MouseEvent).clientY - r.top - r.height / 2;
      animate(
        btn,
        { x: x * 0.35, y: y * 0.35 },
        { duration: 0.2, easing: "ease-out" },
      );
    });
    btn.addEventListener("mouseleave", () => {
      animate(
        btn,
        { x: 0, y: 0 },
        { duration: 0.5, easing: [0.34, 1.56, 0.64, 1] },
      );
    });
  });
}


/* ═══════════════════════════════════════════════════════
   9. SCROLLTO — anchor buttons
   ═══════════════════════════════════════════════════════ */
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);

const gotoMap: Record<string, object> = {
  "#s-hero": { offset: 0, duration: 1.8, easing: easeInOut },
  "#s-parallax": { offset: 0, duration: 1.2, easing: (t: number) => t },
  "#s-chars": { offset: -80, duration: 1.2 },
  "#s-disco": { offset: 0, duration: 2.0 },
  "#s-scale": { offset: -80, duration: 1.5 },
  "#s-clip": { offset: 0, duration: 1.3 },
  "#s-velocity": { offset: 0, duration: 1.8, easing: easeOut3 },
  "#s-hscroll": { offset: 0, duration: 2.5 },
  "#s-tilt": { offset: -60, duration: 1.4 },
  "#s-counter": { offset: 0, duration: 1.6 },
  "#s-direction": { offset: 0, duration: 1.4 },
};

qsa<HTMLElement>("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const t = btn.dataset.goto!;
    lenis.scrollTo(
      t === "bottom" ? document.body.scrollHeight : t,
      t === "bottom"
        ? { duration: 2.5, easing: easeOut3 }
        : (gotoMap[t] ?? { duration: 1.5 }),
    );
  });
});

/* ═══════════════════════════════════════════════════════
   10. BAND QUOTE — split to word spans on init
   ═══════════════════════════════════════════════════════ */
const quoteEl = document.querySelector<HTMLElement>(".band-quote")!;
if (quoteEl) {
  quoteEl.innerHTML = quoteEl.innerHTML.replace(
    /(<span[^>]*>.*?<\/span>|[^\s<]+)/g,
    '<span class="word" style="display:inline-block;opacity:0">$1</span>',
  );
}

/* ═══════════════════════════════════════════════════════
   11. CLEANUP
   ═══════════════════════════════════════════════════════ */
document.addEventListener("astro:before-swap", () => {
  lenis.destroy();
  cancelAnimationFrame(rafId);
});
