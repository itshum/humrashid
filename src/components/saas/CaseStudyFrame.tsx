import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Route, WorkItem } from "./data";
import { isUnlocked, markUnlocked, matchesGate } from "./gate";

type Go = (r: Route) => void;

// The case study itself, in the panel: the real page in a frame that
// fills it. Its own back arrow tells this window to return to Work
// (Topbar.astro already posts that message when embedded).
function EmbeddedPage({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative size-full">
      {!loaded && (
        <div className="absolute inset-0 space-y-4 p-10" aria-hidden="true">
          <div className="mx-auto h-3 w-24 animate-pulse rounded bg-foreground/[0.08]" />
          <div className="mx-auto h-8 w-2/3 animate-pulse rounded bg-foreground/[0.08]" />
          <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-foreground/[0.06]" />
          <div className="mt-10 aspect-[16/9] w-full animate-pulse rounded-lg bg-foreground/[0.06]" />
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        className={cn("size-full border-0 transition-opacity duration-200", loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

// What a locked case study looks like before it's unlocked: the public
// preview image and one-line summary, blurred, behind the modal. Built
// only from what the homepage already shows, so nothing protected leaks.
function BlurredPreview({ work }: { work: WorkItem }) {
  return (
    <div className="relative size-full overflow-hidden" aria-hidden="true">
      <div className="pointer-events-none select-none px-8 py-16 blur-[7px] saturate-75" inert>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-widest text-foreground/65">Case study</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">{work.name}</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-foreground/65">{work.description}</p>
          <div className="mt-8 flex justify-center gap-10 text-left text-sm">
            {["Company", "Role", "Year"].map((k) => (
              <div key={k}>
                <p className="text-xs text-foreground/65">{k}</p>
                <div className="mt-1.5 h-3 w-20 rounded bg-foreground/20" />
              </div>
            ))}
          </div>
        </div>
        {work.cover && <img src={work.cover} alt="" className="mx-auto mt-12 w-full max-w-4xl rounded-lg ring-1 ring-foreground/10" />}
        <div className="mx-auto mt-12 max-w-2xl space-y-3">
          {[100, 94, 98, 70].map((w, i) => (
            <div key={i} className="h-3 rounded bg-foreground/15" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[var(--panel)]/30" />
    </div>
  );
}

function PasswordModal({ onUnlock, onCancel }: { onUnlock: () => void; onCancel: () => void }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [shaking, setShaking] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (checking || !value) return;
    setChecking(true);
    const ok = await matchesGate(value);
    setChecking(false);
    if (ok) {
      markUnlocked();
      onUnlock();
    } else {
      setError(true);
      // Restart the shake without remounting the dialog (a remount
      // reads as a focus-outside and dismisses it).
      setShaking(false);
      requestAnimationFrame(() => setShaking(true));
      setValue("");
      input.current?.focus();
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="saas fixed inset-0 z-40 bg-black/25 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="gate-sub"
          // A stray click on the blurred page shouldn't dismiss a
          // password prompt; Esc and Cancel still do.
          onInteractOutside={(e) => e.preventDefault()}
          onAnimationEnd={(e) => e.animationName === "saas-shake" && setShaking(false)}
          className={cn(
            "saas fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[var(--panel)] p-6 text-foreground shadow-2xl ring-1 ring-foreground/[0.1] outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            shaking && "saas-shake",
          )}
        >
          <div className="mb-4 grid size-9 place-items-center rounded-lg bg-foreground/[0.06]">
            <Lock className="size-4 text-foreground/70" aria-hidden="true" />
          </div>
          <Dialog.Title className="text-[15px] font-medium">Password required</Dialog.Title>
          <Dialog.Description id="gate-sub" className="mt-1 text-sm text-foreground/65">
            This project is confidential.
          </Dialog.Description>

          <form onSubmit={submit} className="mt-5">
            <label htmlFor="gate-pw" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                ref={input}
                id="gate-pw"
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password"
                autoComplete="off"
                aria-invalid={error}
                aria-describedby={error ? "gate-error" : undefined}
                className={cn(
                  "h-10 w-full rounded-lg bg-foreground/[0.04] pl-3 pr-10 text-sm outline-none ring-1 transition-shadow placeholder:text-foreground/65 focus-visible:ring-2",
                  error ? "ring-red-500/60 focus-visible:ring-red-500/70" : "ring-foreground/[0.12] focus-visible:ring-ring",
                )}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-md text-foreground/65 outline-none transition-colors hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p id="gate-error" role="alert" className={cn("mt-2 h-4 text-xs text-red-600 dark:text-red-400", !error && "invisible")}>
              {error ? "Incorrect password. Try again." : ""}
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="h-9 rounded-lg px-3.5 text-[13px] text-foreground/65 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!value || checking}
                className="inline-flex h-9 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-[var(--panel)] outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)] disabled:opacity-40"
              >
                {checking ? <Loader2 className="size-3.5 animate-spin" aria-label="Checking" /> : "Unlock"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CaseStudyFrame({ work, go }: { work: WorkItem; go: Go }) {
  // null until we've read localStorage on the client (no server render
  // of the lock state, so no flash of the wrong one).
  const [unlocked, setUnlocked] = useState<boolean | null>(work.locked ? null : true);
  useEffect(() => {
    if (work.locked) setUnlocked(isUnlocked());
  }, [work.locked]);

  const src = `/work/${work.slug}`;

  if (unlocked === null) return null;
  if (unlocked) return <EmbeddedPage src={src} title={`${work.name} case study`} />;
  return (
    <>
      <BlurredPreview work={work} />
      <PasswordModal onUnlock={() => setUnlocked(true)} onCancel={() => go({ section: "work" })} />
    </>
  );
}
