// Same soft gate as the homepage's Sublime modal (src/pages/index.astro):
// only a SHA-256 hash ships, and a correct entry sets the same
// localStorage flag the case study page checks before it will render.
// It's a client-side gate by design; the site has no server.

const GATE_HASH = "2e678bda8969b9f5249fc236429ad8e44268e18579334a1dddb0bc958ebbc44c";
const GATE_UNLOCK_KEY = "sublime-case-study-unlocked";

export async function matchesGate(value: string) {
  if (!window.crypto?.subtle) return false;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === GATE_HASH;
}

export function isUnlocked() {
  try {
    return localStorage.getItem(GATE_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function markUnlocked() {
  try {
    localStorage.setItem(GATE_UNLOCK_KEY, "1");
  } catch {
    // Private mode: the case study page won't open in this tab, but
    // the shell still shows it for the session.
  }
}
