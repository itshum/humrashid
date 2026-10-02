// Scroll reveal for [data-reveal] blocks (styles in
// src/styles/reveal.css). Marks each block `is-revealed` once, as soon
// as it is within LOOKAHEAD viewport heights of the fold, so blocks
// are already in place by the time they scroll into view.
//
// This is deliberately a geometry check rather than an
// IntersectionObserver. Observers never fire in a hidden or throttled
// document (a background tab, a headless screenshot), and a
// threshold-based one can never fire for a block taller than the
// viewport / threshold, or for a block already scrolled past after a
// reload mid-page. In every one of those cases the content stayed
// invisible. Here anything at or above the lookahead line is revealed,
// and plain timers sweep at startup so it doesn't depend on rAF or
// scroll events running.

const SELECTOR = "[data-reveal]";
const REVEALED = "is-revealed";

// How far below the fold (in viewport heights) counts as "about to be
// seen". Larger means earlier. Pages can pass their own `lookahead` for
// blocks whose entrance is worth seeing (the About signature draws on
// reveal, so it waits until it is nearly on screen).
const LOOKAHEAD = 0.75;

// Startup sweeps, to catch images and fonts shifting the layout after
// first paint without waiting on a scroll.
const STARTUP_SWEEPS_MS = [0, 120, 400, 1000, 2000];
const HIDDEN_POLL_MS = 250;

// A document that loads hidden (a background tab, a headless capture)
// never advances CSS transitions or animations, so anything mid-fade
// stays frozen at its opacity-0 first frame. When that's the case,
// flag the root so the stylesheets skip the motion and land content
// straight on its final state. Only ever added, never removed: pulling
// it off later would replay animations on content that's already
// showing.
export function skipMotionWhenHidden() {
  if (document.hidden) document.documentElement.classList.add("motion-skip");
}

export function initReveal({ selector = SELECTOR, lookahead = LOOKAHEAD } = {}) {
  skipMotionWhenHidden();
  const pending = new Set(document.querySelectorAll<HTMLElement>(selector));
  if (pending.size === 0) return;

  const show = (el: HTMLElement) => {
    el.classList.add(REVEALED);
    pending.delete(el);
  };

  const showAll = () => [...pending].forEach(show);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showAll();
    return;
  }

  let frame = 0;

  const sweep = () => {
    frame = 0;
    if (pending.size === 0) return;
    const limit = window.innerHeight * (1 + lookahead);
    // Read every rect first, then write classes, so this never
    // interleaves layout reads with style writes.
    const due = [...pending].filter((el) => el.getBoundingClientRect().top < limit);
    due.forEach(show);
  };

  const request = () => {
    // rAF never fires in a hidden document, so sweep directly there.
    if (document.hidden) sweep();
    else if (!frame) frame = requestAnimationFrame(sweep);
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  window.addEventListener("hashchange", sweep);
  window.addEventListener("pageshow", sweep);
  window.addEventListener("load", sweep);
  document.addEventListener("visibilitychange", sweep);
  window.addEventListener("beforeprint", showAll);

  STARTUP_SWEEPS_MS.forEach((ms) => window.setTimeout(sweep, ms));

  // A hidden document gets neither scroll events nor animation
  // frames, so something driving it (a headless capture that scrolls
  // the page) would never trigger a reveal. A slow timer covers that
  // case, and only runs while the page is hidden.
  const hiddenPoll = window.setInterval(() => {
    if (pending.size === 0) window.clearInterval(hiddenPoll);
    else if (document.hidden) sweep();
  }, HIDDEN_POLL_MS);
}
