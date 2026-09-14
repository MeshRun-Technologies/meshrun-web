"use client";

import {
  type CSSProperties,
  type ComponentType,
  type ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Gauge,
  HardDrive,
  Layers,
  Lock,
  Mail,
  Menu,
  Monitor,
  Moon,
  MousePointer2,
  Server,
  ShieldCheck,
  Sun,
  Terminal,
  X,
  Zap,
  CircleDollarSign,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content model                                                             */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "How it Works", href: "#how" },
  { label: "Privacy & Compliance", href: "#privacy" },
  { label: "Pricing", href: "#pricing" },
] as const;

type Pillar = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    icon: Layers,
    title: "Full Windows Software",
    body: "Run the real desktop versions of your CAD apps, even on Apple Silicon, without missing features or compatibility bugs.",
  },
  {
    icon: Cpu,
    title: "Built for Mac First",
    body: "Designed from the ground up for macOS, so shortcuts, your trackpad, and window management feel natural.",
  },
  {
    icon: HardDrive,
    title: "Automatic Saves You Can Trust",
    body: "Your work automatically saves back to your computer as you go, so you won't lose your progress even if you disconnect.",
  },
  {
    icon: ShieldCheck,
    title: "Your Data is Secure",
    body: "Every session gives you a fresh computer that gets completely wiped the second you leave. No leftover clutter or snooping eyes.",
  },
];

const STEPS = [
  {
    icon: Terminal,
    step: "Step 01",
    title: "Open the app",
    body: "Launch MeshRun from your Dock. It signs you in and connects to the fastest nearby server automatically.",
  },
  {
    icon: Layers,
    step: "Step 02",
    title: "Pick your project",
    body: "Select from recently opened projects and the CAD program you want to use.",
  },
  {
    icon: Server,
    step: "Step 03",
    title: "Your cloud PC boots",
    body: "A dedicated GPU machine starts up just for you, with your chosen folder already open and ready.",
  },
  {
    icon: Zap,
    step: "Step 04",
    title: "Get right to work",
    body: "Your software opens on screen. When you close the window your session ends and your hours stop ticking.",
  },
];

/**
 * Holds the page still behind a dialog. Marking the root also parks the hero
 * animation loops: a full-screen blurred scrim has to re-rasterise every time
 * anything underneath it moves, which is what made opening one feel heavy.
 */
function useDialogLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.setAttribute("data-dialog", "");

    return () => {
      document.body.style.overflow = previous;
      root.removeAttribute("data-dialog");
    };
  }, [active]);
}

/** True while a dialog owns the screen. */
function dialogOpen() {
  return document.documentElement.hasAttribute("data-dialog");
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

function Wordmark({ className = "text-[15px]" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight text-ink ${className}`}>
      MeshRun
    </span>
  );
}

function SectionHeading({
  title,
  lead,
  align = "left",
}: {
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-body">{lead}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cursor, theme and menu                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A dot that tracks the pointer exactly and a ring that trails it, swelling
 * over anything clickable. Position is written straight to the elements from a
 * rAF loop, so React never renders on mouse move. Coarse pointers get nothing,
 * and text fields keep the native caret.
 */
const CustomCursor = memo(function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("mr-cursor-active");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;
    let visible = false;
    let absorbBox: DOMRect | null = null;

    const tick = () => {
      const toX = absorbBox ? absorbBox.left + absorbBox.width / 2 : targetX;
      const toY = absorbBox ? absorbBox.top + absorbBox.height / 2 : targetY;
      ringX += (toX - ringX) * 0.18;
      ringY += (toY - ringY) * 0.18;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame =
        Math.abs(toX - ringX) > 0.1 || Math.abs(toY - ringY) > 0.1
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Controls swallow the cursor: the ring morphs to the control's box, sits on
    // it, and the control takes the cursor's colour until you leave.
    let absorbed: HTMLElement | null = null;

    const release = () => {
      if (absorbed) absorbed.classList.remove("mr-absorbed");
      absorbed = null;
      ring.dataset.absorbed = "false";
      ring.style.width = "";
      ring.style.height = "";
      ring.style.margin = "";
      ring.style.borderRadius = "";
      dot.style.opacity = visible ? "1" : "0";
    };

    const onOver = (event: Event) => {
      const el = event.target as Element | null;
      const control = el?.closest?.(
        'button:not([data-no-absorb]), a[data-absorb], [data-cursor="absorb"]',
      ) as HTMLElement | null;

      if (control) {
        if (control !== absorbed) {
          if (absorbed) absorbed.classList.remove("mr-absorbed");
          absorbed = control;
          control.classList.add("mr-absorbed");
        }
        const box = control.getBoundingClientRect();
        ring.dataset.absorbed = "true";
        ring.dataset.hot = "false";
        ring.style.width = `${box.width}px`;
        ring.style.height = `${box.height}px`;
        ring.style.margin = `${-box.height / 2}px 0 0 ${-box.width / 2}px`;
        ring.style.borderRadius = getComputedStyle(control).borderRadius;
        dot.style.opacity = "0";
        absorbBox = box;
        return;
      }

      if (absorbed) release();
      absorbBox = null;
      ring.dataset.hot = el?.closest?.(
        'a, button, [role="button"], input, select, textarea, [data-cursor="hot"]',
      )
        ? "true"
        : "false";
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      absorbBox = null;
      if (absorbed) {
        absorbed.classList.remove("mr-absorbed");
        absorbed = null;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);

    return () => {
      if (absorbed) absorbed.classList.remove("mr-absorbed");
      root.classList.remove("mr-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="mr-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="mr-cursor-ring" aria-hidden="true" />
    </>
  );
});

/**
 * Toggles the theme by swapping one attribute on <html>. Which icon shows is
 * decided in CSS from that same attribute, so this holds no React state and
 * cannot disagree with what the pre-paint script already put on the page.
 */
function ThemeToggle({ className = "" }: { className?: string }) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const spinning = useRef(false);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

    const commit = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("mr-theme", next);
      } catch {
        /* private mode: the choice just does not persist */
      }
    };

    const icon = iconRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!icon || reduced || spinning.current) {
      commit();
      return;
    }

    // The swap lands while the icon is scaled to a point, so one shape appears
    // to turn into the other rather than cutting.
    spinning.current = true;
    icon.classList.remove("mr-swap");
    void icon.offsetWidth;
    icon.classList.add("mr-swap");
    window.setTimeout(commit, 300);
    window.setTimeout(() => {
      icon.classList.remove("mr-swap");
      spinning.current = false;
    }, 640);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      className={`border-hairline text-ink-body hover:border-hairline-strong hover:text-ink flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-200 ${className}`}
    >
      <span ref={iconRef} className="grid place-items-center">
        <Moon className="mr-when-light h-4 w-4" />
        <Sun className="mr-when-dark h-4 w-4" />
      </span>
    </button>
  );
}

/**
 * Full-screen menu. The panel wipes down from the top edge and the links rise
 * in behind it on a stagger, so opening reads as one gesture rather than a
 * list appearing.
 */
function FullscreenMenu({
  open,
  closing,
  onClose,
  onRequestAccess,
}: {
  open: boolean;
  closing: boolean;
  onClose: () => void;
  onRequestAccess: () => void;
}) {
  useDialogLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`bg-surface fixed inset-0 z-50 flex flex-col ${
        closing ? "mr-veil-out pointer-events-none" : "mr-veil"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="mr-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto flex h-16 w-full max-w-7xl shrink-0 items-center justify-between px-5 sm:px-8">
        <Wordmark className="text-[17px]" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="border-hairline text-ink-body hover:border-hairline-strong hover:text-ink flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 sm:px-8">
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              className={`border-hairline border-b ${
                closing ? "mr-veil-item-out" : "mr-veil-item"
              }`}
              style={{
                animationDelay: closing
                  ? `${(NAV_LINKS.length - 1 - i) * 38}ms`
                  : `${160 + i * 70}ms`,
              }}
            >
              <a
                href={link.href}
                onClick={onClose}
                className="group text-ink-muted hover:text-ink flex items-baseline justify-between gap-6 py-5 transition-colors duration-300 sm:py-7"
              >
                <span className="text-[clamp(1.9rem,6vw,4rem)] leading-none font-semibold tracking-[-0.03em]">
                  {link.label}
                </span>
                <ArrowRight className="text-accent h-5 w-5 shrink-0 -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>

        <div
          className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
            closing ? "mr-veil-item-out" : "mr-veil-item"
          }`}
          style={{
            animationDelay: closing
              ? "0ms"
              : `${160 + NAV_LINKS.length * 70}ms`,
          }}
        >
          <a
            href="mailto:info@meshrun.co"
            className="text-ink-muted hover:text-ink text-sm transition-colors duration-200"
          >
            info@meshrun.co
          </a>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestAccess();
            }}
            className="bg-inverse text-inverse-ink hover:bg-inverse-hover mr-glow-hover group flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold transition-colors duration-200"
          >
            Request Early Access
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

const NavBar = memo(function NavBar({
  onRequestAccess,
  visible,
  onOpenMenu,
}: {
  onRequestAccess: () => void;
  visible: boolean;
  onOpenMenu: () => void;
}) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "border-hairline/80 bg-void/80 translate-y-0 opacity-100 backdrop-blur-xl"
          : "pointer-events-none -translate-y-full border-transparent opacity-0"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="#top"
          className="rounded-sm transition-opacity duration-200 hover:opacity-70"
        >
          <Wordmark className="text-[17px]" />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group text-ink-body hover:text-ink relative px-3 py-2 text-[13px] font-medium transition-colors duration-200"
            >
              {link.label}
              <span className="from-accent to-accent-alt absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-linear-to-r transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onRequestAccess}
            className="bg-inverse text-inverse-ink mr-glow-hover group hidden items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold sm:flex"
          >
            Request Early Access
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="border-hairline text-ink-body hover:border-hairline-strong hover:text-ink flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-200 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
});

/* -------------------------------------------------------------------------- */
/*  Landing screen                                                            */
/* -------------------------------------------------------------------------- */

const HOOK = "The workstation era is over.";

/**
 * Autodesk product identities for the hero cycler.
 *
 * The marks below are our own geometric drawings and the colours are accents
 * only — MeshRun ships no Autodesk logo artwork or brand typefaces. Product
 * names are used nominatively, to state what MeshRun runs.
 */
type CadProduct = {
  name: string;
  /** Identity colour on the dark sheet. */
  color: string;
  /** The same identity stepped down so it stays legible on the light sheet. */
  colorLight: string;
  type: string;
  mark: ReactNode;
};

/** Dwell per product. Long enough to read, short enough to notice it move. */
const CYCLE_MS = 3000;

const CAD_PRODUCTS: CadProduct[] = [
  {
    name: "AutoCAD",
    color: "#F05340",
    colorLight: "#C7341F",
    type: "font-semibold tracking-[-0.02em]",
    mark: (
      <>
        <path d="M12 2v20M2 12h20" />
        <rect x="9" y="9" width="6" height="6" />
      </>
    ),
  },
  {
    name: "Fusion",
    color: "#F5983B",
    colorLight: "#B96A0C",
    type: "font-medium tracking-[0.01em]",
    mark: (
      <>
        <path d="M12 2.6 20.4 7.3v9.4L12 21.4 3.6 16.7V7.3Z" />
        <path d="M3.6 7.3 12 12l8.4-4.7M12 12v9.4" />
      </>
    ),
  },
  {
    name: "Revit",
    color: "#4BA9E2",
    colorLight: "#1E6FA8",
    type: "font-semibold tracking-[-0.01em]",
    mark: (
      <>
        <path d="M4.5 21V8.2L12 3l7.5 5.2V21" />
        <path d="M4.5 13.2h15M9.6 21v-4.6h4.8V21" />
      </>
    ),
  },
  {
    name: "Inventor",
    color: "#37BFA8",
    colorLight: "#0F7A6B",
    type: "font-medium tracking-[-0.015em]",
    mark: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.4v3.2M12 18.4v3.2M2.4 12h3.2M18.4 12h3.2M5.2 5.2l2.3 2.3M16.5 16.5l2.3 2.3M18.8 5.2l-2.3 2.3M7.5 16.5l-2.3 2.3" />
      </>
    ),
  },
  {
    name: "Civil 3D",
    color: "#93C83E",
    colorLight: "#5A7F1A",
    type: "font-semibold tracking-[0em]",
    mark: (
      <>
        <path d="M2.5 8.5c3.4-3.6 6.8 1.8 10.2-.4s6.4-2.4 8.8.4" />
        <path d="M2.5 14c3.4-3.6 6.8 1.8 10.2-.4s6.4-2.4 8.8.4" />
        <path d="M2.5 19.5c3.4-3.6 6.8 1.8 10.2-.4s6.4-2.4 8.8.4" />
      </>
    ),
  },
  {
    name: "3ds Max",
    color: "#8F7BF5",
    colorLight: "#5A45C4",
    type: "font-bold tracking-[-0.025em]",
    mark: (
      <>
        <path d="M12 2.8 21 19.4H3Z" />
        <path d="M12 2.8v9.4M3 19.4l9-7.2 9 7.2" />
      </>
    ),
  },
];

/* -------------------------------------------------------------------------- */

/**
 * Lights the grid under the pointer. Local coordinates are resolved inside the
 * rAF callback so the pointer handler never forces a layout.
 */
const GridGlow = memo(function GridGlow({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let clientX = -9999;
    let clientY = -9999;
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (dialogOpen()) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${clientX - r.left}px`);
      el.style.setProperty("--gy", `${clientY - r.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`mr-grid-glow ${className}`} aria-hidden="true" />
  );
});

/**
 * Cycles the product name inside a fixed-width pill. The pill is sized once to
 * the longest entry so it never resizes; only its contents change, rising and
 * sharpening into place.
 */
const ProductCycler = memo(function ProductCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % CAD_PRODUCTS.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const product = CAD_PRODUCTS[index];
  const widest = CAD_PRODUCTS.reduce((a, b) =>
    a.name.length >= b.name.length ? a : b,
  );

  return (
    <>
      <span className="sr-only">
        Run {CAD_PRODUCTS.map((p) => p.name).join(", ")} on anything.
      </span>

      <span
        aria-hidden="true"
        className="border-hairline bg-raised/70 inline-grid shrink-0 items-center rounded-full border px-[0.62em] py-[0.18em] align-middle text-[0.82em] backdrop-blur-sm"
      >
        {/* Holds the pill at the width of the longest name, for good. */}
        <span
          className={`invisible col-start-1 row-start-1 flex items-center gap-[0.34em] whitespace-nowrap ${widest.type}`}
        >
          <span className="h-[0.82em] w-[0.82em]" />
          {widest.name}
        </span>

        <span
          key={index}
          className={`mr-product mr-pill-in col-start-1 row-start-1 flex items-center justify-center gap-[0.34em] whitespace-nowrap ${product.type}`}
          style={
            {
              "--pc": product.color,
              "--pcl": product.colorLight,
            } as CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-[0.82em] w-[0.82em] shrink-0"
          >
            {product.mark}
          </svg>
          {product.name}
        </span>
      </span>
    </>
  );
});

/* -------------------------------------------------------------------------- */
/*  Drawing sheet                                                             */
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2;

/** A full circle as a path, so every mark on the sheet is one primitive. */
function circle(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
}

function polygon(cx: number, cy: number, r: number, sides: number, turn = 0) {
  const pts: string[] = [];
  for (let i = 0; i < sides; i += 1) {
    const a = turn + (i / sides) * TAU;
    pts.push(
      `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`,
    );
  }
  return `M${pts.join("L")}Z`;
}

function rect(x: number, y: number, w: number, h: number) {
  return `M${x} ${y}h${w}v${h}h${-w}Z`;
}

/** 45° section hatching clipped to a rectangle. */
function hatch(x: number, y: number, w: number, h: number, step = 10) {
  const out: string[] = [];
  for (let d = -h; d < w; d += step) {
    const t1 = Math.max(0, -d);
    const t2 = Math.min(h, w - d);
    if (t2 <= t1) continue;
    out.push(
      `M${(x + d + t1).toFixed(1)} ${(y + t1).toFixed(1)}L${(x + d + t2).toFixed(1)} ${(y + t2).toFixed(1)}`,
    );
  }
  return out;
}

/** Centre-lines crossing a feature, drawn long in the drafting convention. */
function centre(cx: number, cy: number, r: number) {
  return [`M${cx - r} ${cy}H${cx + r}`, `M${cx} ${cy - r}V${cy + r}`];
}

/** A horizontal obround, the shape a milled slot leaves. */
function slotH(cx: number, cy: number, len: number, r: number) {
  const d = len / 2 - r;
  return `M${cx - d} ${cy - r}h${d * 2}a${r} ${r} 0 0 1 0 ${r * 2}h${-d * 2}a${r} ${r} 0 0 1 0 ${-r * 2}Z`;
}

/** A vertical obround. */
function slotV(cx: number, cy: number, len: number, r: number) {
  const d = len / 2 - r;
  return `M${cx - r} ${cy - d}a${r} ${r} 0 0 1 ${r * 2} 0v${d * 2}a${r} ${r} 0 0 1 ${-r * 2} 0Z`;
}

/** The small cross that marks an arc centre a dimension is measured from. */
function mark(x: number, y: number, r = 6) {
  return [`M${x - r} ${y}h${r * 2}`, `M${x} ${y - r}v${r * 2}`];
}

/**
 * A dimension keyed to the feature it measures. `at` is the point on the part
 * the pointer has to approach; `inner` marks the ones that only make sense once
 * the part has been opened up.
 */
type Dim = {
  paths: string[];
  at: [number, number];
  inner: boolean;
};

/** Arrowhead length and half-width. */
const ARROW = 7.5;
const BARB = 3.1;
/** Below this the arrows will not fit between the extension lines. */
const ARROW_ROOM = 24;
/** How far the extension line runs past the dimension line. */
const OVERRUN = 9;

/**
 * A linear dimension, drawn the way a drawing office would.
 *
 * The extension lines start on the feature itself, with no gap, and overrun the
 * dimension line. Arrowheads land on those extension lines; when the measured
 * span is too tight to hold them they flip outside and point back in, and the
 * dimension line grows tails for them to sit on. `centres` marks the arc
 * centres a dimension is taken from, so a slot or a bolt circle says what it is
 * actually measuring.
 */
function dimH(
  x1: number,
  x2: number,
  y: number,
  from: number,
  inner = false,
  centres: [number, number][] = [],
): Dim {
  const stop = y < from ? y - OVERRUN : y + OVERRUN;
  const tight = Math.abs(x2 - x1) < ARROW_ROOM;
  const tail = ARROW * 2.2;
  const head = (x: number, dir: number) =>
    `M${x + ARROW * dir} ${y - BARB}L${x} ${y}L${x + ARROW * dir} ${y + BARB}`;
  return {
    paths: [
      `M${x1} ${from}V${stop}`,
      `M${x2} ${from}V${stop}`,
      tight ? `M${x1 - tail} ${y}H${x2 + tail}` : `M${x1} ${y}H${x2}`,
      head(x1, tight ? -1 : 1),
      head(x2, tight ? 1 : -1),
      ...centres.flatMap(([mx, my]) => mark(mx, my)),
    ],
    at: [(x1 + x2) / 2, from],
    inner,
  };
}

function dimV(
  y1: number,
  y2: number,
  x: number,
  from: number,
  inner = false,
  centres: [number, number][] = [],
): Dim {
  const stop = x < from ? x - OVERRUN : x + OVERRUN;
  const tight = Math.abs(y2 - y1) < ARROW_ROOM;
  const tail = ARROW * 2.2;
  const head = (y: number, dir: number) =>
    `M${x - BARB} ${y + ARROW * dir}L${x} ${y}L${x + BARB} ${y + ARROW * dir}`;
  return {
    paths: [
      `M${from} ${y1}H${stop}`,
      `M${from} ${y2}H${stop}`,
      tight ? `M${x} ${y1 - tail}V${y2 + tail}` : `M${x} ${y1}V${y2}`,
      head(y1, tight ? -1 : 1),
      head(y2, tight ? 1 : -1),
      ...centres.flatMap(([mx, my]) => mark(mx, my)),
    ],
    at: [from, (y1 + y2) / 2],
    inner,
  };
}

type BBox = readonly [number, number, number, number];

type Drawing = {
  /** Filled silhouette, holes punched with evenodd. What you see at rest. */
  solid: string;
  /** The linework underneath, revealed by moving onto the part. */
  paths: string[];
  hidden: string[];
  bbox: BBox;
  dims: Dim[];
};

/** Zero when the point is inside the box, otherwise the distance to its edge. */
function bboxDist(b: BBox, x: number, y: number) {
  const dx = Math.max(b[0] - x, 0, x - b[2]);
  const dy = Math.max(b[1] - y, 0, y - b[3]);
  return Math.hypot(dx, dy);
}

/**
 * Fourteen real drawings scattered across the sheet: a bolted flange, a
 * section, a hex nut, a bearing, a stepped shaft, a slotted plate, a
 * countersink detail, an angle bracket, a door opening, a spur gear, a welded
 * tee, a square tube, a pillow block and a bolted truss node.
 */
const SHEET: Drawing[] = (() => {
  const out: Drawing[] = [];

  // Bolted flange.
  {
    const cx = 228;
    const cy = 166;
    const R = 96;
    const bolt = 66;
    const holes: string[] = [];
    const seats: [number, number][] = [];
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * TAU - Math.PI / 2;
      const hx = cx + Math.cos(a) * bolt;
      const hy = cy + Math.sin(a) * bolt;
      holes.push(circle(hx, hy, 11));
      seats.push([hx, hy]);
    }
    out.push({
      solid: [circle(cx, cy, R), circle(cx, cy, 32), ...holes].join(""),
      paths: [
        circle(cx, cy, R),
        circle(cx, cy, 32),
        ...holes,
        ...centre(cx, cy, R + 18),
      ],
      hidden: [circle(cx, cy, bolt)],
      bbox: [cx - R, cy - R, cx + R, cy + R],
      dims: [
        dimH(cx - R, cx + R, cy + R + 46, cy),
        // Bolt circle, taken centre to centre off the top and bottom holes.
        dimV(cy - bolt, cy + bolt, cx - R - 44, cx, true, [seats[0], seats[3]]),
        dimV(cy - 32, cy + 32, cx + R + 44, cx, true),
      ],
    });
  }

  // Section through a bearing block.
  {
    const x = 360;
    const y = 392;
    const w = 128;
    const h = 92;
    out.push({
      solid: rect(x, y, w, h),
      paths: [
        rect(x, y, w, h),
        `M${x + 34} ${y}v${h}M${x + w - 34} ${y}v${h}`,
        ...hatch(x, y, 34, h),
        ...hatch(x + w - 34, y, 34, h),
      ],
      hidden: [`M${x + 34} ${y + 30}h${w - 68}M${x + 34} ${y + 62}h${w - 68}`],
      bbox: [x, y, x + w, y + h],
      dims: [
        dimH(x, x + w, y + h + 42, y + h),
        dimV(y, y + h, x + w + 34, x + w),
        dimH(x, x + 34, y - 34, y, true),
      ],
    });
  }

  // Hex nut.
  {
    const cx = 1284;
    const cy = 172;
    const r = 56;
    const flat = r * Math.cos(Math.PI / 6);
    out.push({
      solid: polygon(cx, cy, r, 6, Math.PI / 6) + circle(cx, cy, 32),
      paths: [
        polygon(cx, cy, r, 6, Math.PI / 6),
        circle(cx, cy, 32),
        ...centre(cx, cy, r + 16),
      ],
      hidden: [circle(cx, cy, 27)],
      bbox: [cx - flat, cy - r, cx + flat, cy + r],
      dims: [
        dimH(cx - flat, cx + flat, cy + r + 40, cy),
        dimV(cy - 32, cy + 32, cx + r + 40, cx, true),
      ],
    });
  }

  // Deep-groove ball bearing.
  {
    const cx = 186;
    const cy = 432;
    const R = 84;
    const balls = 0.72 * R;
    const ballPaths: string[] = [];
    for (let i = 0; i < 9; i += 1) {
      const a = (i / 9) * TAU;
      ballPaths.push(
        circle(cx + Math.cos(a) * balls, cy + Math.sin(a) * balls, 0.13 * R),
      );
    }
    out.push({
      solid: circle(cx, cy, R) + circle(cx, cy, 0.46 * R),
      paths: [
        circle(cx, cy, R),
        circle(cx, cy, R - 20),
        circle(cx, cy, 0.46 * R),
        circle(cx, cy, 0.46 * R + 20),
        ...ballPaths,
        ...centre(cx, cy, R + 18),
      ],
      hidden: [circle(cx, cy, balls)],
      bbox: [cx - R, cy - R, cx + R, cy + R],
      dims: [
        dimH(cx - R, cx + R, cy + R + 44, cy),
        dimV(cy - 0.46 * R, cy + 0.46 * R, cx + R + 42, cx, true),
      ],
    });
  }

  // Stepped shaft.
  {
    const cx = 408;
    const cy = 624;
    const steps: [number, number, number][] = [
      [-132, -38, 34],
      [-38, 48, 54],
      [48, 132, 26],
    ];
    const bodies = steps.map(([x1, x2, h]) =>
      rect(cx + x1, cy - h, x2 - x1, h * 2),
    );
    out.push({
      solid: bodies.join(""),
      paths: [...bodies, `M${cx - 156} ${cy}H${cx + 156}`],
      hidden: [],
      bbox: [cx - 132, cy - 54, cx + 132, cy + 54],
      dims: [
        dimH(cx - 132, cx + 132, cy + 102, cy + 54),
        dimV(cy - 54, cy + 54, cx - 176, cx - 38),
        dimH(cx - 38, cx + 48, cy - 96, cy - 54, true),
      ],
    });
  }

  // Slotted plate.
  {
    const cx = 744;
    const cy = 206;
    const w = 104;
    const h = 146;
    const slot = 44;
    const slotPath = slotV(cx, cy, slot * 2 + 30, 15);
    out.push({
      solid: rect(cx - w / 2, cy - h / 2, w, h) + slotPath,
      paths: [
        rect(cx - w / 2, cy - h / 2, w, h),
        slotPath,
        ...centre(cx, cy, h / 2 + 16),
      ],
      hidden: [],
      bbox: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
      dims: [
        dimH(cx - w / 2, cx + w / 2, cy + h / 2 + 40, cy + h / 2),
        // Slot length, centre to centre of the two end radii.
        dimV(cy - slot, cy + slot, cx + w / 2 + 40, cx, true, [
          [cx, cy - slot],
          [cx, cy + slot],
        ]),
      ],
    });
  }

  // Countersunk hole, section.
  {
    const cx = 744;
    const cy = 470;
    const t = 34;
    const bore = 17;
    const csk = 34;
    const hole = `M${cx - csk} ${cy - t}L${cx - bore} ${cy - t + 20}V${cy + t}H${cx + bore}V${cy - t + 20}L${cx + csk} ${cy - t}Z`;
    out.push({
      solid: rect(cx - 96, cy - t, 192, t * 2) + hole,
      paths: [
        `M${cx - 96} ${cy - t}h192M${cx - 96} ${cy + t}h192`,
        `M${cx - csk} ${cy - t}L${cx - bore} ${cy - t + 20}V${cy + t}`,
        `M${cx + csk} ${cy - t}L${cx + bore} ${cy - t + 20}V${cy + t}`,
        ...centre(cx, cy, t + 22),
      ],
      hidden: [],
      bbox: [cx - 96, cy - t, cx + 96, cy + t],
      dims: [
        dimH(cx - csk, cx + csk, cy - t - 40, cy - t, true),
        dimH(cx - bore, cx + bore, cy + t + 40, cy + t, true),
      ],
    });
  }

  // Angle bracket.
  {
    const cx = 186;
    const cy = 758;
    const L = 132;
    const t = 34;
    const body = `M${cx - L / 2} ${cy - L / 2}h${t}v${L - t}h${L - t}v${t}h${-L}Z`;
    const holes = [
      circle(cx - L / 2 + t / 2, cy - L / 2 + 30, 9),
      circle(cx + L / 2 - 30, cy + L / 2 - t / 2, 9),
    ];
    out.push({
      solid: body + holes.join(""),
      paths: [body, ...holes],
      hidden: [],
      bbox: [cx - L / 2, cy - L / 2, cx + L / 2, cy + L / 2],
      dims: [
        dimV(cy - L / 2, cy + L / 2, cx - L / 2 - 40, cx - L / 2),
        // Leg thickness: no room between the extension lines, so the arrows
        // sit outside and point back in.
        dimH(cx - L / 2, cx - L / 2 + t, cy + L / 2 + 42, cy + L / 2, true),
      ],
    });
  }

  // Door opening, plan.
  {
    const cx = 706;
    const cy = 818;
    const wall = 20;
    const open = 112;
    const left = rect(cx - 190, cy - wall / 2, 190 - open, wall);
    const right = rect(cx + open, cy - wall / 2, 190 - open, wall);
    out.push({
      solid: left + right,
      paths: [
        left,
        right,
        `M${cx - open} ${cy}V${cy - open * 2}`,
        `M${cx - open} ${cy - open * 2}A${open * 2} ${open * 2} 0 0 1 ${cx + open} ${cy}`,
      ],
      hidden: [],
      bbox: [cx - 190, cy - wall / 2, cx + 190, cy + wall / 2],
      dims: [
        // Structural opening, measured off the hinge the swing is struck from.
        dimH(cx - open, cx + open, cy + 62, cy + wall / 2, false, [
          [cx - open, cy],
        ]),
        dimV(cy - wall / 2, cy + wall / 2, cx - 214, cx - 190, true),
      ],
    });
  }

  // Spur gear.
  {
    const cx = 1052;
    const cy = 742;
    const tip = 84;
    const root = 64;
    const teeth: string[] = [];
    for (let i = 0; i < 24; i += 1) {
      const a = (i / 24) * TAU;
      teeth.push(
        `M${(cx + Math.cos(a) * root).toFixed(1)} ${(cy + Math.sin(a) * root).toFixed(1)}L${(cx + Math.cos(a) * tip).toFixed(1)} ${(cy + Math.sin(a) * tip).toFixed(1)}`,
      );
    }
    out.push({
      solid: circle(cx, cy, tip) + circle(cx, cy, 21),
      paths: [
        circle(cx, cy, tip),
        circle(cx, cy, root),
        circle(cx, cy, 21),
        ...teeth,
        `M${cx - 6} ${cy - 21}h12v8h-12Z`,
        ...centre(cx, cy, tip + 18),
      ],
      hidden: [circle(cx, cy, 74)],
      bbox: [cx - tip, cy - tip, cx + tip, cy + tip],
      dims: [
        dimH(cx - tip, cx + tip, cy + tip + 46, cy),
        dimV(cy - 21, cy + 21, cx + tip + 42, cx, true),
      ],
    });
  }

  // Welded tee.
  {
    const cx = 1412;
    const cy = 752;
    const t = 26;
    const web = 120;
    const flange = 150;
    const base = rect(cx - flange / 2, cy + web / 2, flange, t);
    const stem = rect(cx - t / 2, cy - web / 2, t, web);
    out.push({
      solid: base + stem,
      paths: [
        base,
        stem,
        `M${cx - t / 2 - 16} ${cy + web / 2}l16 -16M${cx + t / 2 + 16} ${cy + web / 2}l-16 -16`,
      ],
      hidden: [],
      bbox: [cx - flange / 2, cy - web / 2, cx + flange / 2, cy + web / 2 + t],
      dims: [
        dimH(
          cx - flange / 2,
          cx + flange / 2,
          cy + web / 2 + t + 42,
          cy + web / 2 + t,
        ),
        dimV(
          cy - web / 2,
          cy + web / 2,
          cx + flange / 2 + 40,
          cx + t / 2,
          true,
        ),
      ],
    });
  }

  // Square tube, section.
  {
    const cx = 1414;
    const cy = 428;
    const w = 112;
    const h = 96;
    const t = 18;
    const x = cx - w / 2;
    const y = cy - h / 2;
    out.push({
      solid: rect(x, y, w, h) + rect(x + t, y + t, w - t * 2, h - t * 2),
      paths: [
        rect(x, y, w, h),
        rect(x + t, y + t, w - t * 2, h - t * 2),
        ...hatch(x, y, w, t, 9),
        ...hatch(x, y + h - t, w, t, 9),
        ...hatch(x, y + t, t, h - t * 2, 9),
        ...hatch(x + w - t, y + t, t, h - t * 2, 9),
      ],
      hidden: [],
      bbox: [x, y, x + w, y + h],
      dims: [
        dimH(x, x + w, y + h + 40, y + h),
        // Wall thickness, arrows outside because the wall cannot hold them.
        dimV(y, y + t, x - 36, x, true),
      ],
    });
  }

  // Pillow block housing, front view.
  {
    const cx = 1046;
    const cy = 196;
    const bw = 92;
    const R = 58;
    const bore = 32;
    const yTop = cy + 52;
    const yBot = cy + 82;
    const k = R * Math.SQRT1_2;
    const foot = 64;
    const feet = cy + 67;
    const body =
      `M${cx - bw} ${yBot}H${cx + bw}V${yTop}H${cx + foot + 4}` +
      `L${(cx + k).toFixed(1)} ${(cy + k).toFixed(1)}` +
      `A${R} ${R} 0 1 0 ${(cx - k).toFixed(1)} ${(cy + k).toFixed(1)}` +
      `L${cx - foot - 4} ${yTop}H${cx - bw}Z`;
    const slots = [
      slotH(cx - foot, feet, 34, 9),
      slotH(cx + foot, feet, 34, 9),
    ];
    out.push({
      solid: [body, circle(cx, cy, bore), ...slots].join(""),
      paths: [
        body,
        circle(cx, cy, bore),
        circle(cx, cy, bore + 11),
        ...slots,
        // Grease nipple boss.
        `M${cx - 9} ${cy - R}v-14h18v14`,
        // The cap splits on the shaft centre, so the centre line doubles as it.
        ...centre(cx, cy, R + 24),
      ],
      hidden: [circle(cx, cy, bore + 20)],
      bbox: [cx - bw, cy - R - 14, cx + bw, yBot],
      dims: [
        // Mounting centres, struck off the two slot centres, and the overall
        // width stepped out beyond them.
        dimH(cx - foot, cx + foot, yBot + 42, feet, true, [
          [cx - foot, feet],
          [cx + foot, feet],
        ]),
        dimH(cx - bw, cx + bw, yBot + 78, yBot),
        dimH(cx - bore, cx + bore, cy - R - 52, cy, true),
      ],
    });
  }

  // Bolted truss node.
  {
    const cx = 1150;
    const cy = 452;
    const chord = rect(cx - 120, cy - 74, 240, 30);
    const plate = `M${cx - 88} ${cy - 44}h176v58l-54 42h-122Z`;
    const holes: string[] = [];
    for (let i = 0; i < 4; i += 1) {
      holes.push(circle(cx - 54 + i * 36, cy - 59, 8));
    }
    const seats: [number, number][] = [
      [cx - 50, cy + 16],
      [cx - 6, cy + 16],
    ];
    for (const [hx, hy] of seats) holes.push(circle(hx, hy, 8));
    out.push({
      solid: [chord, plate, ...holes].join(""),
      paths: [
        chord,
        plate,
        ...holes,
        // Bolt line through the chord, and the fillet welds either side.
        `M${cx - 120} ${cy - 59}H${cx + 120}`,
        `M${cx - 88} ${cy - 44}l-13 -13M${cx + 88} ${cy - 44}l13 -13`,
      ],
      hidden: [`M${cx - 88} ${cy + 16}H${cx + 88}`],
      bbox: [cx - 120, cy - 74, cx + 120, cy + 56],
      dims: [
        dimV(cy - 74, cy - 44, cx + 158, cx + 120),
        // Plate depth, then the bolt gauge across the two lower holes.
        dimV(cy - 44, cy + 56, cx - 128, cx - 88, true),
        dimH(seats[0][0], seats[1][0], cy + 96, cy + 16, true, seats),
      ],
    });
  }

  return out;
})();

/** Flat list of every dimension, tagged with the drawing it belongs to. */
const DIMS = SHEET.flatMap((drawing, d) =>
  drawing.dims.map((dim, i) => ({ ...dim, part: d, key: `${d}-${i}` })),
);

/** Running path index per drawing, so the stagger never mutates during render. */
const PLOT_OFFSET = (() => {
  const out: number[] = [];
  let n = 0;
  for (const d of SHEET) {
    out.push(n);
    n += d.paths.length;
  }
  return out;
})();

const PLOT_STEP = 6;
const PLOT_MAX = 900;
const ENTRY_MS = 1500;

/** How close the pointer gets before a part's outside dimensions appear. */
const NEAR_REACH = 96;
/** And how close to an internal feature before that one appears. */
const INNER_REACH = 150;
/** Radius of the lens that lifts the clearing under the pointer. */
const LENS_R = 230;

const SheetArt = memo(function SheetArt() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* Solid parts: what the sheet looks like at rest. */}
      <g className="text-ink-faint" fillRule="evenodd">
        {SHEET.map((drawing, d) => (
          <path
            key={`s-${d}`}
            data-solid={d}
            d={drawing.solid}
            fill="currentColor"
            fillOpacity="0.17"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0"
          />
        ))}
      </g>

      {/* The linework underneath. */}
      <g
        className="text-ink-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SHEET.map((drawing, d) => (
          <g key={`w-${d}`} data-wire={d}>
            {drawing.paths.map((path, i) => (
              <path
                key={`p-${i}`}
                d={path}
                pathLength={1}
                className="mr-plot"
                style={{
                  animationDelay: `${Math.min((PLOT_OFFSET[d] + i) * PLOT_STEP, PLOT_MAX)}ms`,
                }}
              />
            ))}
            {drawing.hidden.map((path, i) => (
              <path
                key={`h-${i}`}
                d={path}
                pathLength={1}
                strokeDasharray="0.012 0.012"
                opacity="0.7"
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
});

/** Dimensions, each hidden until its own feature is approached. */
const DimLayer = memo(function DimLayer() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="text-accent h-full w-full"
      aria-hidden="true"
      data-dims=""
    >
      {DIMS.map((dim) => (
        <g
          key={dim.key}
          data-dim={dim.key}
          opacity="0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        >
          {dim.paths.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
      ))}
    </svg>
  );
});

/**
 * The sheet. Parts sit solid until the pointer reaches one: come close and its
 * outside dimensions appear, move onto it and it opens into linework with the
 * internal dimensions nearest the pointer.
 */
const SheetBackdrop = memo(function SheetBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const solids = SHEET.map((_, d) =>
      root.querySelector<SVGPathElement>(`path[data-solid="${d}"]`),
    );
    const wires = SHEET.map((_, d) =>
      root.querySelector<SVGGElement>(`g[data-wire="${d}"]`),
    );
    const dimGroups = DIMS.map((dim) =>
      root.querySelector<SVGGElement>(`g[data-dim="${dim.key}"]`),
    );
    const svg = root.querySelector<SVGSVGElement>("[data-dims]");

    let map = { ox: 0, oy: 0, k: 1, left: 0, top: 0 };
    const remap = () => {
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const k = Math.max(r.width / 1600, r.height / 900);
      map = {
        k,
        ox: (r.width - 1600 * k) / 2,
        oy: (r.height - 900 * k) / 2,
        left: r.left,
        top: r.top,
      };
    };
    remap();

    let pointerX = -9999;
    let pointerY = -9999;
    let frame = 0;
    const start = performance.now();
    const solidNow = SHEET.map(() => 0);
    const wireNow = SHEET.map(() => 1);
    const dimNow = DIMS.map(() => 0);
    let lensNow = 0;

    const tick = (now: number) => {
      if (dialogOpen()) {
        frame = 0;
        return;
      }

      const entry = Math.min((now - start) / ENTRY_MS, 1);
      const px = (pointerX - map.left - map.ox) / map.k;
      const py = (pointerY - map.top - map.oy) / map.k;

      let busy = entry < 1;
      let closest = Infinity;

      for (let d = 0; d < SHEET.length; d += 1) {
        const dist = bboxDist(SHEET[d].bbox, px, py);
        if (dist < closest) closest = dist;
        const over = dist === 0;
        const near = dist < NEAR_REACH;

        // The part fills in as the sheet finishes plotting, and opens back up
        // wherever the pointer actually is.
        const wantSolid = over ? 0 : entry;
        const wantWire = over ? 1 : 1 - entry;

        solidNow[d] += (wantSolid - solidNow[d]) * 0.085;
        wireNow[d] += (wantWire - wireNow[d]) * 0.085;
        if (Math.abs(wantSolid - solidNow[d]) > 0.004) busy = true;
        if (Math.abs(wantWire - wireNow[d]) > 0.004) busy = true;

        solids[d]?.setAttribute("opacity", solidNow[d].toFixed(3));
        wires[d]?.setAttribute("opacity", wireNow[d].toFixed(3));

        for (let i = 0; i < DIMS.length; i += 1) {
          const dim = DIMS[i];
          if (dim.part !== d) continue;
          const want = dim.inner
            ? over && Math.hypot(dim.at[0] - px, dim.at[1] - py) < INNER_REACH
              ? 1
              : 0
            : near
              ? 1
              : 0;
          dimNow[i] += (want - dimNow[i]) * 0.11;
          if (Math.abs(want - dimNow[i]) > 0.004) busy = true;
          dimGroups[i]?.setAttribute("opacity", dimNow[i].toFixed(3));
        }
      }

      // Only lift the clearing while the pointer is actually on a drawing,
      // so passing over the headline leaves the sheet alone.
      const wantLens = closest < NEAR_REACH ? 1 : 0;
      lensNow += (wantLens - lensNow) * 0.085;
      if (Math.abs(wantLens - lensNow) > 0.004) busy = true;

      root.style.setProperty("--lens-x", `${pointerX - map.left}px`);
      root.style.setProperty("--lens-y", `${pointerY - map.top}px`);
      root.style.setProperty("--lens-r", `${(lensNow * LENS_R).toFixed(1)}px`);

      frame = busy ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (!frame && !dialogOpen()) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      kick();
    };

    const onLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
      kick();
    };

    const onResize = () => {
      remap();
      kick();
    };

    kick();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="bg-plate absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_68%_at_50%_44%,rgb(var(--accent-rgb)/0.05),transparent_72%)]" />

      <div className="mr-clear-center absolute inset-0">
        <SheetArt />
      </div>

      <div className="mr-clear-center absolute inset-0">
        <DimLayer />
      </div>

      <div className="to-void absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent" />
    </div>
  );
});

/* -------------------------------------------------------------------------- */

const ScrollCue = memo(function ScrollCue({
  onActivate,
}: {
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="Scroll to content"
      className="group flex flex-col items-center gap-3 rounded-xl"
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span className="border-hairline bg-surface/70 group-hover:border-accent/60 group-hover:bg-accent/10 absolute inset-0 rounded-full border backdrop-blur-sm transition-colors duration-300" />
        <ChevronDown className="mr-animate-bob group-hover:text-accent relative h-[18px] w-[18px] text-ink-muted transition-colors duration-300" />
      </span>
    </button>
  );
});

const Landing = memo(function Landing() {
  const leaving = useRef(false);

  const toContent = useCallback(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById("content")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  // The landing behaves like a single pane: one tick down hands over to the
  // page rather than scrolling the drawing out line by line.
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0 || leaving.current) return;
      if (window.scrollY > 8) return;
      // A locked body means a dialog owns the scroll right now.
      if (document.body.style.overflow === "hidden") return;

      event.preventDefault();
      leaving.current = true;
      toContent();
      window.setTimeout(() => {
        leaving.current = false;
      }, 900);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [toContent]);

  return (
    <section
      id="top"
      className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden"
    >
      <SheetBackdrop />

      <div className="relative z-10 flex flex-1 flex-col px-5 sm:px-8">
        <div className="flex justify-center pt-7 sm:pt-9">
          <a href="#top" className="mr-enter rounded-sm">
            <Wordmark className="text-lg sm:text-xl" />
          </a>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1
            className="mr-enter max-w-[16ch] text-[clamp(2.4rem,7.2vw,5.25rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance text-ink"
            style={{ animationDelay: "120ms" }}
          >
            {HOOK}
          </h1>

          <div
            className="mr-enter relative mt-7 flex flex-wrap items-center justify-center gap-x-[0.4em] gap-y-1 text-[clamp(1.05rem,2.9vw,2.05rem)] leading-tight text-ink-strong sm:mt-9"
            style={{ animationDelay: "300ms" }}
          >
            <span className="font-light">Run</span>
            <ProductCycler />
            <span className="font-light">on anything.</span>
          </div>
        </div>

        <div
          className="mr-enter flex justify-center pb-9 sm:pb-12"
          style={{ animationDelay: "560ms" }}
        >
          <ScrollCue onActivate={toContent} />
        </div>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Measured performance band                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Design targets for the private beta, not readings from a running session.
 * The surrounding UI labels them as such.
 */
const HERO_METRICS = [
  {
    icon: Monitor,
    label: "High-Quality",
    value: "Smooth 120 FPS at 2K",
    detail: "Orbit, pan, and zoom without stuttering or low-res blur.",
  },
  {
    icon: Gauge,
    label: "Low-Latency",
    value: "Fast & Responsive (20ms+)",
    detail: "Low latency across North America & Western Europe.",
  },
  {
    icon: Cpu,
    label: "Industry Standard",
    value: "NVIDIA Workstations",
    detail: "Powered by industry-leading RTX 4000 GPUs.",
  },
  {
    icon: MousePointer2,
    label: "Full Passthrough",
    value: "Plug & Play",
    detail: "Just plug your peripherals in and start designing.",
  },
];

const TargetsBand = memo(function TargetsBand() {
  return (
    <section id="platform" className="relative scroll-mt-20 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 pt-20 pb-4 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
            CAD in the Cloud
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-body">
            MeshRun streams full windows CAD from powerful cloud PCs straight to
            your screen.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2">
          {HERO_METRICS.map((target) => (
            <div
              key={target.value}
              className="group mr-lift flex items-start gap-5 rounded-2xl border border-hairline bg-surface p-6 sm:p-7"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent-lit transition-colors duration-[420ms] group-hover:border-accent/50 group-hover:bg-accent/15">
                <target.icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <div className="text-[16px] font-semibold tracking-tight text-ink">
                  {target.value}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted transition-colors duration-[420ms] group-hover:text-ink-body">
                  {target.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-faint">
          Performance based on internal testing - real-world speeds depend on
          your internet connection.
        </p>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Platform pillars                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Stacked panels: whichever one you are on expands and takes the raised
 * surface, the rest collapse to their title. Height animates through
 * grid-template-rows so it eases from real content height rather than a
 * guessed max-height.
 */
const PlatformSection = memo(function PlatformSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="experience" className="bg-surface relative scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          title="What We Deliver"
          lead="Not a clunky band-aid solution. Just your apps running cleanly on Mac."
        />

        <div className="mt-12 flex flex-col gap-2.5">
          {PILLARS.map((pillar, i) => {
            const isActive = i === active;
            return (
              <button
                key={pillar.title}
                type="button"
                aria-expanded={isActive}
                data-no-absorb=""
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group rounded-2xl border px-6 py-6 text-left transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 sm:py-7 ${
                  isActive
                    ? "border-hairline bg-raised"
                    : "border-hairline/60 bg-surface hover:border-hairline"
                }`}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500 ${
                        isActive
                          ? "border-accent/25 bg-accent/10 text-accent-lit"
                          : "border-hairline text-ink-faint"
                      }`}
                    >
                      <pillar.icon className="h-[18px] w-[18px]" />
                    </span>
                    <h3
                      className={`text-[18px] font-semibold tracking-tight transition-colors duration-500 sm:text-[22px] ${
                        isActive ? "text-ink" : "text-ink-muted"
                      }`}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-ink-body max-w-2xl pt-4 text-[14.5px] leading-relaxed sm:pl-[60px]">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Cost                                                                      */
/* -------------------------------------------------------------------------- */

/** Each row is the same decision seen twice: what buying costs, what renting returns. */
const TRADES = [
  {
    cost: "Heavy in your bag every single day",
    gain: "Keep carrying the laptop you actually like",
  },
  {
    cost: "Battery that doesn't make it to lunch",
    gain: "All-day battery life from the most efficient laptops",
  },
  {
    cost: "Your fans sound like a plane taking off",
    gain: "Dead silent fans and a laptop that doesn't burn your lap",
  },
  {
    cost: "Paid for in full, whether you use it or not",
    gain: "Only pay for the usage you need",
  },
  {
    cost: "Slower every year, and you can't do anything about it",
    gain: "Fresh cloud GPUs every year without buying new hardware",
  },
];

const CostSection = memo(function CostSection() {
  return (
    <section
      id="how"
      className="border-hairline/80 bg-raised/25 relative scroll-mt-20 border-y"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading title="You don't need to own a workstation, You need power for a few hours a week." />

        {/* Pulled wide so the hover tint has a margin of its own while the rows
            stay aligned with everything else on the page. */}
        <ul className="border-hairline mt-12 -mx-3 border-t sm:-mx-4">
          {TRADES.map((trade) => (
            <li
              key={trade.cost}
              className="group border-hairline hover:bg-gain/5 border-b transition-colors duration-500"
            >
              <div className="flex items-center gap-4 px-3 py-5 sm:gap-5 sm:px-4">
                <span className="relative inline-grid h-5 w-5 shrink-0 place-items-center">
                  <X className="text-ink-faint col-start-1 row-start-1 h-4 w-4 transition-all duration-500 group-hover:scale-75 group-hover:opacity-0" />
                  <CheckCircle2 className="text-gain col-start-1 row-start-1 h-[18px] w-[18px] scale-75 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
                </span>

                <span className="grid flex-1">
                  <span className="text-ink-muted col-start-1 row-start-1 text-[15px] leading-relaxed transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-0 sm:text-[17px]">
                    {trade.cost}
                  </span>
                  <span className="text-gain col-start-1 row-start-1 translate-y-1 text-[15px] leading-relaxed font-medium opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-[17px]">
                    {trade.gain}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Architecture flow                                                         */
/* -------------------------------------------------------------------------- */

const ArchitectureSection = memo(function ArchitectureSection() {
  return (
    <section
      id="session"
      className="relative scroll-mt-20 border-y border-hairline/80 bg-raised/25"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          title="How a session works"
          lead="Everything from opening the app to getting to work takes as little as 45 seconds."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 [--step-gap:2.5rem] sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:[--step-gap:1.5rem]">
          {STEPS.map((step, i) => (
            <div key={step.step} className="group relative">
              {/* The row connector only: index 1 gains a neighbour once the
                  row holds all four, and stacked there is nothing to join. */}
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`mr-step-across pointer-events-none absolute top-[38px] left-1/2 hidden h-px ${
                    i === 1 ? "lg:block" : "sm:block"
                  }`}
                />
              ) : null}
              <div className="flex justify-center">
                <span className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-hairline bg-raised text-accent mr-shadow-lift transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:border-accent group-hover:bg-accent group-hover:text-inverse-ink">
                  <step.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-[17px] font-semibold tracking-tight text-ink transition-colors duration-[420ms] group-hover:text-accent">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2.5 max-w-sm text-[13.5px] leading-relaxed text-ink-body">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Files and licensing                                                       */
/* -------------------------------------------------------------------------- */

const YOURS_POINTS = [
  {
    icon: HardDrive,
    title: "Your files stay on your laptop",
    body: "Pick the folders you want and they show up in the session as a normal drive. Nothing has to be uploaded before you can open it.",
  },
  {
    icon: Lock,
    title: "The machine is yours alone",
    body: "Every session gets its own machine, wiped the moment you disconnect. Nobody else has been on it, and nobody else gets it after.",
  },
  {
    icon: ShieldCheck,
    title: "Use your existing license",
    body: "Sign in with your own Autodesk account, exactly as you do now. We don't resell licences and your subscription doesn't change.",
  },
];

const YoursSection = memo(function YoursSection() {
  return (
    <section id="privacy" className="relative scroll-mt-20 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          title="Your files and your licence stay yours."
          lead="Renting compute shouldn't mean giving up control of your files or buying software twice."
        />

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
          {YOURS_POINTS.map((point) => (
            <div
              key={point.title}
              className="group mr-lift rounded-2xl border border-hairline bg-surface p-7"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-raised text-accent transition-colors duration-[420ms] group-hover:border-accent/50 group-hover:bg-accent/15 group-hover:text-accent-lit">
                <point.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-ink transition-colors duration-[420ms] group-hover:text-ink">
                {point.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-body transition-colors duration-[420ms] group-hover:text-ink-body">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

const PRICING_TIERS = [
  {
    name: "Standard",
    price: 19,
    hours: 15,
    featured: false,
    features: [
      "Top up extra hours whenever you need them",
      "A private, dedicated machine every session",
      "Open and save files directly from your own folders",
      "Crisp 120 FPS at 2K with full colour accuracy",
      "SpaceeMouse and Mac shortcut support built-in",
    ],
  },
  {
    name: "Pro",
    price: 49,
    hours: 40,
    featured: true,
    features: ["Everything in Standard"],
  },
];

const PricingSection = memo(function PricingSection({
  onRequestAccess,
}: {
  onRequestAccess: () => void;
}) {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 border-y border-hairline/80 bg-raised/25"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          title="Pay for what you need."
          lead="Two simple plans with monthly GPU hours. Running into a busy project week? Top up extra hours anytime without upgrading your plan. We don't sell licenses, get that from your software provider."
          align="center"
        />

        <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-hairline bg-surface p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-[13px] leading-relaxed text-ink-body">
              <span className="font-medium text-ink-strong">
                Pricing Coming Soon.
              </span>{" "}
              We&rsquo;re still in development, and will post information when
              it&rsquo;s available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Closing CTA                                                               */
/* -------------------------------------------------------------------------- */

const ClosingCta = memo(function ClosingCta({
  onRequestAccess,
}: {
  onRequestAccess: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-t border-hairline/80 bg-surface">
      <div className="mr-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <GridGlow className="pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-40 h-80"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(var(--accent-rgb) / 0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-28">
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
          Carry the laptop you love. Run the software it can&rsquo;t.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-body">
          MeshRun isn&rsquo;t available yet. Tell us how you want to get more
          out of your laptop and we&rsquo;ll get in touch.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRequestAccess}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-inverse px-7 text-sm font-semibold text-inverse-ink transition-colors hover:bg-inverse-hover sm:w-auto"
          >
            Request Early Access
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="mailto:info@meshrun.co"
            className="mr-glow-hover flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-raised/60 px-7 text-sm font-medium text-ink-strong transition-colors hover:border-hairline-strong hover:text-ink sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            info@meshrun.co
          </a>
        </div>
        <p className="mt-5 text-[12.5px] text-ink-muted">
          We don&rsquo;t sell licences &bull; Not affiliated with Autodesk.
        </p>
      </div>
    </section>
  );
});

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-hairline/80 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Wordmark className="text-[17px]" />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-muted">
              Full-featured Windows CAD, streamed to the machine you already
              carry. GPU compute on demand, your licence and your files your
              own.
            </p>
            <div className="mt-5 font-mono text-[10.5px] tracking-wide whitespace-nowrap text-ink-faint">
              MeshRun Technologies Inc. · Built in Canada 🍁
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11.5px] leading-relaxed text-ink-faint">
              Autodesk, AutoCAD, and Revit are registered trademarks of
              Autodesk, Inc. in the USA and other countries. MeshRun
              Technologies Inc. is an independent software and orchestration
              platform provider and is not affiliated with, endorsed by, or
              sponsored by Autodesk, Inc.
            </p>
            <p className="text-[11.5px] leading-relaxed text-ink-faint">
              NVIDIA and RTX are trademarks of NVIDIA Corporation. Apple, macOS,
              Metal, and Apple Silicon are trademarks of Apple Inc. 3Dconnexion
              and SpaceMouse are trademarks of 3Dconnexion. All other trademarks
              are the property of their respective owners and are referenced for
              compatibility and interoperability purposes only.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline/80 pt-7">
          <div className="flex flex-col gap-2 text-[12.5px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 MeshRun Technologies Inc. All rights reserved.</span>
            <a
              href="mailto:info@meshrun.co"
              className="transition-colors hover:text-ink-strong"
            >
              info@meshrun.co
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

/* -------------------------------------------------------------------------- */
/*  Early access dialog                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Requests are closed for now, so the dialog says so plainly and hands over an
 * address rather than collecting details nobody is reading.
 */
function WaitlistModal({ onClose }: { onClose: () => void }) {
  useDialogLock(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <div
        className="mr-animate-fade bg-void/80 fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="mr-animate-rise border-hairline bg-surface mr-shadow-modal relative my-auto w-full max-w-md overflow-hidden rounded-2xl border">
        <div className="border-hairline flex items-start justify-between gap-4 border-b px-6 py-5">
          <Wordmark className="text-[15px]" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            data-no-absorb=""
            className="text-ink-muted hover:bg-raised hover:text-ink rounded-md p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-10 text-center">
          <div
            className="text-ink-faint font-mono text-4xl tracking-[-0.18em] select-none"
            aria-hidden="true"
          >
            :(
          </div>

          <h2
            id="waitlist-title"
            className="text-ink mt-6 text-[17px] font-semibold tracking-tight"
          >
            We aren&rsquo;t accepting requests at this time.
          </h2>

          <p className="text-ink-body mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed">
            Sorry about that. For more information, please reach out to us at{" "}
            <a
              href="mailto:info@meshrun.co"
              className="text-accent hover:underline"
            >
              info@meshrun.co
            </a>
            .
          </p>

          <button
            type="button"
            onClick={onClose}
            className="bg-inverse text-inverse-ink mr-glow-hover mt-8 h-11 w-full rounded-xl text-sm font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/** Long enough for the menu's items to leave and the veil to retract. */
const MENU_EXIT_MS = 540;

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const openMenu = useCallback(() => {
    setMenuClosing(false);
    setMenuOpen(true);
  }, []);

  // Closing plays the opening in reverse, so the menu is kept mounted until the
  // retraction has finished.
  const closeMenu = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuOpen(false);
      return;
    }
    setMenuClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, MENU_EXIT_MS);
  }, []);

  // The bar drops in once the landing screen has been scrolled past. Observing
  // a sentinel avoids a scroll listener firing on every frame.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setNavVisible(
            !entry.isIntersecting && entry.boundingClientRect.top < 0,
          );
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Note: no overflow clipping on the wrapper below. It would become the fixed
  // header's scroll container; sections that bleed decoration clip it themselves.
  return (
    <div className="bg-void flex min-h-screen w-full flex-col">
      <CustomCursor />

      <NavBar
        onRequestAccess={openModal}
        visible={navVisible}
        onOpenMenu={openMenu}
      />

      <FullscreenMenu
        open={menuOpen}
        closing={menuClosing}
        onClose={closeMenu}
        onRequestAccess={openModal}
      />

      {/*
        The sentinel sits inside the landing rather than after it, so the bar is
        already in place by the time the content arrives, and the trigger is not
        a single-pixel boundary.
      */}
      <div className="relative">
        <Landing />
        <div
          ref={sentinelRef}
          className="pointer-events-none absolute bottom-[10%] left-0 h-px w-full"
        />
      </div>

      <main id="content" className="flex-1 scroll-mt-16">
        <TargetsBand />
        <PlatformSection />
        <CostSection />
        <ArchitectureSection />
        <YoursSection />
        <PricingSection onRequestAccess={openModal} />
        <ClosingCta onRequestAccess={openModal} />
      </main>

      <Footer />

      {modalOpen ? <WaitlistModal onClose={closeModal} /> : null}
    </div>
  );
}
