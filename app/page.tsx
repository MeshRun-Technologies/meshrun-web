"use client";

import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Gauge,
  HardDrive,
  Keyboard,
  Layers,
  Lock,
  Mail,
  Menu,
  Monitor,
  MousePointer2,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content model                                                             */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Performance", href: "#performance" },
  { label: "Privacy", href: "#privacy" },
  { label: "Compliance", href: "#byol" },
  { label: "Pricing", href: "#pricing" },
] as const;

type Pillar = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tags: string[];
};

const PILLARS: Pillar[] = [
  {
    icon: Layers,
    title: "Full Windows Toolset Parity",
    body: "Complete support for ObjectARX extensions, custom LISP routines, MEP toolsets, and 3D rendering engines unavailable on browser viewers or stripped-down macOS ports.",
    tags: ["ObjectARX", "AutoLISP", "MEP / Plant 3D", "Inventor"],
  },
  {
    icon: Cpu,
    title: "Apple Silicon Native Client",
    body: "Low-level system event hooks pass complex shortcuts (Cmd, Esc, F3, F8) seamlessly. Direct hardware decoding via Apple VideoToolbox preserves battery life and thermal headroom.",
    tags: ["VideoToolbox", "Metal", "arm64", "6-DoF USB"],
  },
  {
    icon: HardDrive,
    title: "Client-Side Data Isolation",
    body: "Retain full data sovereignty. Mount local Mac directories directly into your active session. Keep sensitive project files and client IP on your local disk with zero mandatory cloud file persistence.",
    tags: ["Z:\\MacFiles", "Ephemeral nodes", "No cloud retention"],
  },
  {
    icon: ShieldCheck,
    title: "Verified BYOL Compliance",
    body: "Authenticate directly via your enterprise Autodesk Single-User ID inside an isolated, single-tenant ephemeral environment. Fully compliant with major vendor virtualization terms.",
    tags: ["Named-user auth", "Single-tenant", "Zero resale"],
  },
];

type Subsystem = {
  icon: ComponentType<{ className?: string }>;
  index: string;
  title: string;
  body: string;
  specs: { label: string; value: string }[];
};

const SUBSYSTEMS: Subsystem[] = [
  {
    icon: Monitor,
    index: "01",
    title: "Native macOS Client Engine",
    body: "Built specifically for Apple Silicon. Incoming frames are handed to Apple VideoToolbox for hardware-accelerated decode and composited directly onto a Metal viewport, keeping the CPU idle and the fans off.",
    specs: [
      { label: "Decode path", value: "VideoToolbox (hardware)" },
      { label: "Presentation", value: "Metal viewport, zero-copy" },
      { label: "Target silicon", value: "Apple M-series, arm64" },
    ],
  },
  {
    icon: Keyboard,
    index: "02",
    title: "Input & Peripheral Pipeline",
    body: "Low-level OS keyboard hooks forward complex CAD chords to the remote session before macOS can claim them, so Osnap and Ortho behave exactly as they do on a Windows workstation.",
    specs: [
      { label: "Pass-through", value: "Cmd · Esc · F3 · F8" },
      { label: "Peripherals", value: "SpaceMouse, 6-axis" },
      { label: "Collisions", value: "Hotkey interception" },
    ],
  },
  {
    icon: Network,
    index: "03",
    title: "Display Transport Pipeline",
    body: "Cloud-agnostic orchestration engineered for NVIDIA RTX Virtual Workstation environments. Frames are captured straight off the GPU frame buffer through hardware NVENC pipelines.",
    specs: [
      { label: "Codecs", value: "HEVC / H.265 · AV1" },
      { label: "Chroma", value: "4:4:4 subsampling" },
      { label: "Frame rate", value: "60 FPS sustained" },
    ],
  },
  {
    icon: Lock,
    index: "04",
    title: "Client-Side File Privacy Layer",
    body: "Transparent client-side folder mounting exposes your local Mac directories to the session as a native Windows volume. Compute is streamed; the models never have to leave your disk.",
    specs: [
      { label: "Mount point", value: "Z:\\MacFiles" },
      { label: "Channel", value: "Encrypted, session-scoped" },
      { label: "Cloud persistence", value: "None required" },
    ],
  },
  {
    icon: ShieldCheck,
    index: "05",
    title: "Licensing Compliance Architecture",
    body: "100% Bring-Your-Own-License. Sessions authenticate through standard vendor named-user flows inside fully isolated single-tenant environments, strictly respecting software virtualization agreements.",
    specs: [
      { label: "Licensing model", value: "BYOL, zero markup" },
      { label: "Identity", value: "Autodesk Identity" },
      { label: "Tenancy", value: "Single-tenant, ephemeral" },
    ],
  },
];

const LATENCY_BUDGET = [
  { label: "GPU frame capture", detail: "NVENC frame-buffer grab", ms: 2.0 },
  { label: "Encode", detail: "HEVC 4:4:4 hardware encode", ms: 3.5 },
  { label: "Regional transit", detail: "Encrypted transport RTT", ms: 8.0 },
  { label: "Decode", detail: "Apple VideoToolbox", ms: 2.5 },
  { label: "Present", detail: "Metal viewport composite", ms: 1.8 },
];

const SEGMENT_COLORS = [
  "bg-cyan-300",
  "bg-cyan-400",
  "bg-teal-500",
  "bg-sky-500",
  "bg-blue-600",
];

const TRANSPORT_SPECS = [
  { label: "Codec support", value: "HEVC (H.265), AV1" },
  { label: "Chroma subsampling", value: "4:4:4" },
  { label: "Sustained frame rate", value: "60 FPS" },
  { label: "Colour depth", value: "8 / 10-bit per channel" },
  { label: "Capture source", value: "Direct GPU frame buffer" },
  { label: "Instance class", value: "NVIDIA RTX vWS" },
];

const STEPS = [
  {
    icon: Terminal,
    step: "Step 01",
    title: "Native Client Handshake",
    body: "Launch the lightweight macOS desktop client from your dock or menu bar. The client negotiates a session with the MeshRun control plane and selects your nearest available region.",
  },
  {
    icon: Server,
    step: "Step 02",
    title: "Ephemeral Node Allocation",
    body: "Orchestration provisions an isolated GPU compute environment and maps local client storage securely over encrypted channels. Nothing is shared with another tenant.",
  },
  {
    icon: Zap,
    step: "Step 03",
    title: "Low-Latency Production",
    body: "Authenticate using your existing CAD subscription, draft with uncompromised graphical fidelity, and spin down instances automatically upon disconnect.",
  },
];

const SOFTWARE_OPTIONS = [
  "Autodesk Revit",
  "AutoCAD / Civil 3D",
  "Autodesk Inventor",
  "Other Tools Under Evaluation",
] as const;

const HARDWARE_OPTIONS = [
  "Apple Silicon M-Series",
  "Intel Mac",
  "Low-Spec PC / Thin Client",
] as const;

const TEAM_SIZES = [
  "Solo / Freelancer",
  "2–10 Engineers",
  "11–50 Engineers",
  "50+ Enterprise",
] as const;

const TRUST_MARKERS = [
  "Single-tenant ephemeral nodes",
  "Bring-Your-Own-License",
  "No mandatory cloud file retention",
  "Encrypted session transport",
];

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

function Wordmark({ className = "text-[15px]" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight text-white ${className}`}>
      MeshRun
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div
        className={`flex items-center gap-2 ${centered ? "justify-center" : ""}`}
      >
        <span className="h-px w-6 bg-cyan-400/60" />
        <span className="font-mono text-[11px] tracking-[0.18em] text-cyan-400 uppercase">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-400">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

function MonoTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-neutral-800 bg-neutral-900/80 px-1.5 py-0.5 font-mono text-[10px] tracking-tight text-neutral-400">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

function NavBar({
  onRequestAccess,
  visible,
}: {
  onRequestAccess: () => void;
  visible: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "translate-y-0 border-neutral-800/80 bg-neutral-950/80 opacity-100 backdrop-blur-xl"
          : "pointer-events-none -translate-y-full border-transparent opacity-0"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="#top"
          className="text-[17px] font-bold tracking-tight text-white transition-opacity duration-200 hover:opacity-70"
        >
          MeshRun
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 text-[13px] font-medium text-neutral-400 transition-colors duration-200 hover:text-white"
            >
              {link.label}
              <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-linear-to-r from-cyan-400 to-teal-300 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRequestAccess}
            className="group hidden items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-neutral-950 transition-shadow duration-200 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)] sm:flex"
          >
            Request Early Access
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-md border border-neutral-800 p-2 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Tied to `visible` so the panel cannot linger over the landing screen. */}
      {visible && menuOpen ? (
        <div className="border-t border-neutral-800 bg-neutral-950 px-5 py-3 lg:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onRequestAccess();
              }}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-950"
            >
              Request Early Access
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Landing screen                                                            */
/* -------------------------------------------------------------------------- */

const HOOK = "The workstation era is over.";

/**
 * Autodesk product identities for the hero cycler.
 *
 * The marks below are our own geometric drawings and the colours are accents
 * only — MeshRun ships no Autodesk logo artwork or brand typefaces. Product
 * names are used nominatively, to state what MeshRun runs. To swap in licensed
 * artwork later, replace `mark` on the entry; nothing else needs to change.
 */
type CadProduct = {
  name: string;
  color: string;
  /** Per-product typographic treatment, standing in for the brand typeface. */
  type: string;
  mark: ReactNode;
};

const CAD_PRODUCTS: CadProduct[] = [
  {
    name: "AutoCAD",
    color: "#F05340",
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
    type: "font-bold tracking-[-0.025em]",
    mark: (
      <>
        <path d="M12 2.8 21 19.4H3Z" />
        <path d="M12 2.8v9.4M3 19.4l9-7.2 9 7.2" />
      </>
    ),
  },
];

const CYCLE_MS = 2600;

/**
 * Cycles the product name in "Run ___ on anything".
 *
 * The slot width is written directly to the DOM from the active label's
 * measured width, so the surrounding words glide rather than snap, and the
 * measurement survives the web-font swap via ResizeObserver.
 */
function ProductCycler() {
  const [index, setIndex] = useState(0);
  const slotRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % CAD_PRODUCTS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const slot = slotRef.current;
    const label = labelRefs.current[index];
    if (!slot || !label) return;

    const measure = () => {
      slot.style.width = `${label.getBoundingClientRect().width}px`;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, [index]);

  return (
    <>
      <span className="sr-only">
        Run {CAD_PRODUCTS.map((product) => product.name).join(", ")} on anything.
      </span>
      <span
        ref={slotRef}
        aria-hidden="true"
        className="relative inline-flex h-[1.3em] shrink-0 items-center justify-center transition-[width] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {CAD_PRODUCTS.map((product, i) => {
          const active = i === index;
          return (
            <span
              key={product.name}
              ref={(node) => {
                labelRefs.current[i] = node;
              }}
              // Both axes must come from classes: an inline `translate` would
              // replace the whole property and kill the vertical transition.
              className={`absolute top-1/2 left-1/2 flex items-center gap-[0.34em] whitespace-nowrap transition-[opacity,translate,filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${product.type} ${
                active
                  ? "-translate-x-1/2 -translate-y-1/2 opacity-100 blur-0"
                  : "-translate-x-1/2 -translate-y-[26%] opacity-0 blur-[4px]"
              }`}
              style={{ color: product.color }}
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
          );
        })}
      </span>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** Deterministic PRNG so the artwork is identical on server and client. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const CIRCUIT_W = 1600;
const CIRCUIT_H = 900;

/**
 * PCB-style routing: orthogonal and 45-degree traces snapped to a grid, with
 * vias at the ends and a scattering of component pads and radii.
 */
const CIRCUIT = (() => {
  const rand = seeded(20260913);
  const step = 40;
  const traces: string[] = [];
  const vias: { x: number; y: number }[] = [];
  const pads: { x: number; y: number; w: number; h: number }[] = [];
  const arcs: string[] = [];

  const snap = (value: number, max: number) =>
    Math.max(-2 * step, Math.min(max + 2 * step, Math.round(value / step) * step));

  for (let i = 0; i < 30; i += 1) {
    let x = snap(rand() * CIRCUIT_W, CIRCUIT_W);
    let y = snap(rand() * CIRCUIT_H, CIRCUIT_H);
    const parts = [`M${x} ${y}`];
    vias.push({ x, y });

    const segments = 3 + Math.floor(rand() * 4);
    for (let s = 0; s < segments; s += 1) {
      const roll = rand();
      const sign = rand() < 0.5 ? -1 : 1;
      const length = (1 + Math.floor(rand() * 4)) * step;

      if (roll < 0.4) {
        x = snap(x + length * sign, CIRCUIT_W);
      } else if (roll < 0.78) {
        y = snap(y + length * sign, CIRCUIT_H);
      } else {
        const diagonal = Math.min(length, 2 * step);
        x = snap(x + diagonal * sign, CIRCUIT_W);
        y = snap(y + diagonal * (rand() < 0.5 ? -1 : 1), CIRCUIT_H);
      }
      parts.push(`L${x} ${y}`);
    }

    traces.push(parts.join(" "));
    vias.push({ x, y });
  }

  for (let i = 0; i < 16; i += 1) {
    pads.push({
      x: snap(rand() * CIRCUIT_W, CIRCUIT_W),
      y: snap(rand() * CIRCUIT_H, CIRCUIT_H),
      w: step * (1 + Math.floor(rand() * 3)),
      h: step,
    });
  }

  for (let i = 0; i < 7; i += 1) {
    const cx = snap(rand() * CIRCUIT_W, CIRCUIT_W);
    const cy = snap(rand() * CIRCUIT_H, CIRCUIT_H);
    const r = step * (2 + Math.floor(rand() * 3));
    arcs.push(`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx} ${cy - r}`);
  }

  return { traces, vias, pads, arcs };
})();

function CircuitArt({ className }: { className: string }) {
  return (
    <svg
      viewBox={`0 0 ${CIRCUIT_W} ${CIRCUIT_H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
        {CIRCUIT.traces.map((d, i) => (
          <path key={`t-${i}`} d={d} />
        ))}
        {CIRCUIT.arcs.map((d, i) => (
          <path key={`a-${i}`} d={d} strokeDasharray="5 6" />
        ))}
        {CIRCUIT.pads.map((pad, i) => (
          <rect
            key={`p-${i}`}
            x={pad.x}
            y={pad.y}
            width={pad.w}
            height={pad.h}
            rx="3"
          />
        ))}
      </g>
      <g fill="currentColor">
        {CIRCUIT.vias.map((via, i) => (
          <circle key={`v-${i}`} cx={via.x} cy={via.y} r="3.2" />
        ))}
      </g>
    </svg>
  );
}

/**
 * Circuit backdrop with a cursor-tracking spotlight and a little parallax.
 *
 * Pointer position is lerped in a rAF loop and written to CSS custom
 * properties, so the trail stays smooth without re-rendering React on move.
 */
function CircuitBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0.5;
    let targetY = 0.42;
    let currentX = 0.5;
    let currentY = 0.42;
    let frame = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;

      root.style.setProperty("--mx", `${(currentX * 100).toFixed(2)}%`);
      root.style.setProperty("--my", `${(currentY * 100).toFixed(2)}%`);
      root.style.setProperty("--px", `${((currentX - 0.5) * -28).toFixed(2)}px`);
      root.style.setProperty("--py", `${((currentY - 0.5) * -20).toFixed(2)}px`);

      frame =
        Math.abs(targetX - currentX) > 0.0004 ||
        Math.abs(targetY - currentY) > 0.0004
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 bg-[#16181d]" aria-hidden="true">
      {/* Lit plate, so the panel reads as grey rather than as another black band. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_68%_at_50%_44%,rgba(60,67,79,0.78),transparent_74%)]" />
      <div className="mr-grid absolute inset-0 opacity-70" />

      <div className="mr-clear-center absolute inset-0">
        <div className="mr-parallax absolute inset-[-3%]">
          <CircuitArt className="text-neutral-600/60" />
        </div>
      </div>

      <div className="mr-clear-center absolute inset-0">
        <div className="mr-spotlight absolute inset-0">
          <div className="mr-parallax absolute inset-[-3%]">
            <CircuitArt className="text-cyan-300/90" />
          </div>
        </div>
      </div>

      {/* Hands off into the page below. */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-neutral-950" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ScrollCue({ onActivate }: { onActivate: () => void }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label="Scroll to content"
      className="group flex flex-col items-center gap-3 outline-none"
    >
      <span className="font-mono text-[10px] tracking-[0.22em] text-neutral-500 uppercase transition-colors duration-300 group-hover:text-neutral-300">
        Scroll
      </span>
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span className="mr-animate-cue-glow absolute inset-0 rounded-full bg-cyan-400/25 blur-md" />
        <span className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-300/50 group-hover:bg-cyan-400/10 group-focus-visible:border-cyan-300/70" />
        <ChevronDown className="mr-animate-bob relative h-[18px] w-[18px] text-neutral-300 transition-colors duration-300 group-hover:text-cyan-200" />
      </span>
    </button>
  );
}

function Landing() {
  const toContent = () => {
    document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden"
    >
      <CircuitBackdrop />

      <div className="relative z-10 flex flex-1 flex-col px-5 sm:px-8">
        <div className="flex justify-center pt-7 sm:pt-9">
          <a
            href="#top"
            className="mr-enter text-lg font-bold tracking-tight text-white sm:text-xl"
          >
            MeshRun
          </a>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1
            className="mr-enter max-w-[16ch] text-[clamp(2.4rem,7.2vw,5.25rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance text-white"
            style={{ animationDelay: "120ms" }}
          >
            {HOOK}
          </h1>

          <div
            className="mr-enter mt-7 flex flex-wrap items-center justify-center gap-x-[0.4em] gap-y-1 text-[clamp(1.05rem,2.9vw,2.05rem)] leading-tight text-neutral-300 sm:mt-9"
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
}

/* -------------------------------------------------------------------------- */
/*  Engineering targets band                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Design targets for the private beta, not readings from a running session.
 * The surrounding UI labels them as such.
 */
const HERO_TARGETS = [
  {
    icon: Monitor,
    label: "Display",
    value: "60 FPS · 4:4:4 chroma",
    detail:
      "Full chroma resolution, so hairline vector weights and small annotation type stay free of colour fringing.",
  },
  {
    icon: Gauge,
    label: "Pipeline",
    value: "Sub-20ms regional",
    detail:
      "End-to-end budget from input to presented frame, against a same-region GPU node.",
  },
  {
    icon: Cpu,
    label: "Acceleration",
    value: "VideoToolbox + Metal",
    detail:
      "Hardware decode composited straight onto a Metal viewport, keeping the CPU idle and the fans off.",
  },
  {
    icon: MousePointer2,
    label: "Peripherals",
    value: "SpaceMouse 6-DoF",
    detail:
      "Native USB redirection for 3Dconnexion controllers, with CAD shortcut chords passed through intact.",
  },
];

function TargetsBand() {
  return (
    <section className="relative bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 pt-20 pb-4 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1.5">
            <span className="mr-animate-ring h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] tracking-wide text-neutral-300">
              Private Beta • Engineered for Apple Silicon
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            A native client, not a browser tab.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-400">
            MeshRun pairs a native Metal display client with cloud GPU
            orchestration to stream full-featured Windows engineering
            environments to macOS — with full shortcut parity and uncompromised
            viewport rendering, on hardware you already own.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_TARGETS.map((target) => (
            <div key={target.label} className="bg-neutral-950 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                <target.icon className="h-4 w-4" />
              </span>
              <div className="mt-4 font-mono text-[10px] tracking-[0.16em] text-neutral-500 uppercase">
                {target.label}
              </div>
              <div className="mt-1.5 text-[15px] font-semibold tracking-tight text-white">
                {target.value}
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-neutral-500">
                {target.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-neutral-600">
          Design targets for the beta programme, specified against same-region
          GPU nodes. Real figures vary with network path, display resolution, and
          workload.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-neutral-800/70 pt-7">
          {TRUST_MARKERS.map((marker) => (
            <span
              key={marker}
              className="flex items-center gap-1.5 text-[12px] text-neutral-500"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-neutral-600" />
              {marker}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Problem framing                                                           */
/* -------------------------------------------------------------------------- */

const PROBLEM_ROWS = [
  {
    approach: "Secondary Windows laptop",
    cost: "Duplicate hardware",
    friction: "Two machines, two file sets, constant context switching",
  },
  {
    approach: "Uncertified local hypervisor",
    cost: "No workstation GPU",
    friction: "Unsupported drivers, viewport stalls, licensing grey zones",
  },
  {
    approach: "On-premise VDI array",
    cost: "Capital-intensive",
    friction: "Procurement cycles, idle depreciation, in-house ops burden",
  },
  {
    approach: "MeshRun native client",
    cost: "On-demand GPU",
    friction: "Native macOS client, BYOL, ephemeral single-tenant nodes",
  },
];

function ProblemSection() {
  return (
    <section className="relative border-y border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="The AEC hardware gap"
          title="Apple hardware. x86 engineering software."
          lead="Architecture, engineering, and construction teams standardise on Apple Silicon MacBooks for build quality and battery life. Autodesk Revit, the specialised AutoCAD toolsets (MEP, Plant 3D, Architecture), and Inventor remain compiled strictly for x86 Windows and demand dedicated workstation GPUs. Every workaround trades one form of friction for another."
        />

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                {["Current approach", "Cost profile", "Operational friction"].map(
                  (head) => (
                    <th
                      key={head}
                      className="border-b border-neutral-800 pb-3 font-mono text-[10px] tracking-[0.14em] text-neutral-500 uppercase"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {PROBLEM_ROWS.map((row, i) => {
                const isMeshRun = i === PROBLEM_ROWS.length - 1;
                return (
                  <tr key={row.approach}>
                    <td
                      className={`border-b border-neutral-800/70 py-4 pr-6 text-sm font-medium ${
                        isMeshRun ? "text-cyan-300" : "text-neutral-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isMeshRun ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                        ) : (
                          <X className="h-4 w-4 shrink-0 text-neutral-600" />
                        )}
                        {row.approach}
                      </span>
                    </td>
                    <td className="border-b border-neutral-800/70 py-4 pr-6 font-mono text-[12px] text-neutral-400">
                      {row.cost}
                    </td>
                    <td className="border-b border-neutral-800/70 py-4 text-[13px] text-neutral-500">
                      {row.friction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Platform pillars                                                          */
/* -------------------------------------------------------------------------- */

function PlatformSection() {
  return (
    <section id="platform" className="relative scroll-mt-20 bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Platform"
          title="Four pillars of the MeshRun platform"
          lead="A proprietary desktop client, an orchestration control plane, and a compliance architecture designed together — not a generic virtual machine with a remote desktop bolted on."
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 lg:grid-cols-2">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative bg-neutral-950 p-7 transition-colors hover:bg-neutral-900/60 sm:p-8"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-cyan-400 transition-colors group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10">
                <pillar.icon className="h-[18px] w-[18px]" />
              </div>
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-white">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-neutral-400">
                {pillar.body}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {pillar.tags.map((tag) => (
                  <MonoTag key={tag}>{tag}</MonoTag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Performance / engineering stack                                           */
/* -------------------------------------------------------------------------- */

function PerformanceSection() {
  const total = LATENCY_BUDGET.reduce((sum, item) => sum + item.ms, 0);

  return (
    <section
      id="performance"
      className="relative scroll-mt-20 border-y border-neutral-800/80 bg-neutral-900/25"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Performance"
          title="Proprietary engineering across the whole pipeline"
          lead="MeshRun owns the client engine, the input pipeline, and the display transport. Each subsystem is built and tuned in-house against the specific demands of vector-dense CAD and BIM workloads."
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 md:grid-cols-2 lg:grid-cols-3">
          {SUBSYSTEMS.map((system) => (
            <div key={system.index} className="bg-neutral-950 p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-cyan-400">
                  <system.icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.16em] text-neutral-600">
                  {system.index}
                </span>
              </div>
              <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-white">
                {system.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-400">
                {system.body}
              </p>
              <dl className="mt-5 space-y-2 border-t border-neutral-800 pt-4">
                {system.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <dt className="shrink-0 text-[11.5px] text-neutral-600">
                      {spec.label}
                    </dt>
                    <dd className="text-right font-mono text-[11px] text-neutral-300">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          {/* Closes the 3-column grid, which would otherwise end on an empty cell. */}
          <div className="flex flex-col justify-center bg-neutral-950 p-7">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <Boxes className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-white">
              One engineered system
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-400">
              The client, the control plane, and the transport are developed
              together in-house. This is not an off-the-shelf remote desktop
              pointed at a rented virtual machine.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              <MonoTag>Cloud-agnostic</MonoTag>
              <MonoTag>Single-tenant</MonoTag>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Latency budget */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7 lg:col-span-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-[15.5px] font-semibold tracking-tight text-white">
                Representative regional latency budget
              </h3>
              <span className="font-mono text-[11px] text-cyan-300 tabular-nums">
                ≈ {total.toFixed(1)} ms end-to-end
              </span>
            </div>
            <p className="mt-2 text-[13px] text-neutral-500">
              Target allocation for a client connected to a same-region GPU node.
              Actual figures vary with network path and display resolution.
            </p>

            <div className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-900">
              {LATENCY_BUDGET.map((item, i) => (
                <div
                  key={item.label}
                  className={`h-full ${SEGMENT_COLORS[i]}`}
                  style={{ width: `${(item.ms / total) * 100}%` }}
                />
              ))}
            </div>

            <ul className="mt-5 space-y-2.5">
              {LATENCY_BUDGET.map((item, i) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${SEGMENT_COLORS[i]}`}
                  />
                  <span className="shrink-0 text-[13px] font-medium text-neutral-200">
                    {item.label}
                  </span>
                  <span className="hidden truncate text-[12px] text-neutral-600 sm:block">
                    {item.detail}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[11.5px] text-neutral-400 tabular-nums">
                    {item.ms.toFixed(1)} ms
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transport spec */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7 lg:col-span-2">
            <h3 className="text-[15.5px] font-semibold tracking-tight text-white">
              Display transport specification
            </h3>
            <p className="mt-2 text-[13px] text-neutral-500">
              4:4:4 chroma is non-negotiable for engineering work — it is what
              keeps hairline vector weights and small annotation type free of
              colour fringing.
            </p>
            <dl className="mt-6 divide-y divide-neutral-800 border-t border-neutral-800">
              {TRANSPORT_SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-3 py-2.5"
                >
                  <dt className="shrink-0 text-[12.5px] text-neutral-500">
                    {spec.label}
                  </dt>
                  <dd className="text-right font-mono text-[11.5px] text-neutral-200">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Architecture flow                                                         */
/* -------------------------------------------------------------------------- */

function ArchitectureSection() {
  return (
    <section id="architecture" className="relative scroll-mt-20 bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="System architecture"
          title="From dock icon to GPU session in three steps"
          lead="The control plane handles region selection, node lifecycle, and storage mapping. You handle the drafting."
          align="center"
        />

        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute top-[38px] right-[14%] left-[14%] hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(34,211,238,0.35), rgba(34,211,238,0.35), transparent)",
            }}
          />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-6">
            {STEPS.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex justify-center">
                  <span className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-cyan-400 shadow-xl shadow-black/50">
                    <step.icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-6 text-center">
                  <div className="font-mono text-[10.5px] tracking-[0.18em] text-cyan-400 uppercase">
                    {step.step}
                  </div>
                  <h3 className="mt-2.5 text-[17px] font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2.5 max-w-sm text-[13.5px] leading-relaxed text-neutral-400">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Storage & privacy                                                         */
/* -------------------------------------------------------------------------- */

const CLIENT_FACTS = [
  "Project files remain on local disk",
  "Directory exposed to the session as Z:\\MacFiles",
  "You choose exactly which folders are visible",
  "Existing backup and retention policy still applies",
];

const NODE_FACTS = [
  "Isolated environment provisioned per session",
  "No mandatory cloud file persistence layer",
  "Instance destroyed automatically on disconnect",
  "No cross-tenant storage or shared user profile",
];

function FactList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <span className="text-[13.5px] leading-relaxed text-neutral-400">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative scroll-mt-20 border-y border-neutral-800/80 bg-neutral-900/25"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Storage & privacy"
          title="Stream the compute. Keep the files."
          lead="MeshRun mounts a directory from your Mac straight into the session as a native Windows volume. Proprietary models, client drawings, and consultant packages stay on hardware you control, which removes persistent cloud retention from your risk register entirely."
        />

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300">
                <Monitor className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold text-white">
                  Your Mac
                </div>
                <div className="font-mono text-[10px] tracking-wide text-neutral-500 uppercase">
                  Client of record
                </div>
              </div>
            </div>
            <FactList items={CLIENT_FACTS} />
          </div>

          {/* Encrypted channel */}
          <div className="flex flex-row items-center justify-center gap-3 lg:w-40 lg:flex-col">
            <div className="h-px w-10 bg-linear-to-r from-transparent to-cyan-400/50 lg:h-14 lg:w-px lg:bg-linear-to-b" />
            <div className="flex flex-col items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-3.5 py-3 text-center">
              <Lock className="h-4 w-4 text-cyan-300" />
              <div className="font-mono text-[10px] leading-tight tracking-wide text-cyan-200">
                Encrypted
                <br />
                mount channel
              </div>
            </div>
            <div className="h-px w-10 bg-linear-to-r from-cyan-400/50 to-transparent lg:h-14 lg:w-px lg:bg-linear-to-b" />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300">
                <Server className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold text-white">
                  Ephemeral GPU node
                </div>
                <div className="font-mono text-[10px] tracking-wide text-neutral-500 uppercase">
                  Single tenant
                </div>
              </div>
            </div>
            <FactList items={NODE_FACTS} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:flex-row sm:items-center">
          <HardDrive className="h-4 w-4 shrink-0 text-cyan-400" />
          <p className="text-[13px] leading-relaxed text-neutral-400">
            <span className="font-medium text-neutral-200">
              Data sovereignty by default.
            </span>{" "}
            Because the file system of record never leaves the client machine,
            MeshRun can be adopted without renegotiating the data-residency
            clauses in your existing client contracts.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  BYOL architecture                                                         */
/* -------------------------------------------------------------------------- */

const BYOL_CARDS = [
  {
    icon: ShieldCheck,
    title: "Named-user authentication",
    body: "You sign in to your own Autodesk Identity inside the session. MeshRun never holds, pools, proxies, or re-sells vendor licences.",
  },
  {
    icon: Boxes,
    title: "Single-tenant isolation",
    body: "Each session runs in a dedicated ephemeral environment with no shared user profile, which is what vendor virtualization terms require.",
  },
  {
    icon: Layers,
    title: "Zero software markup",
    body: "You pay MeshRun for orchestration and GPU compute only. Your existing subscription agreement and renewal cycle stay untouched.",
  },
];

const COMPLIANCE_POINTS = [
  "Vendor named-user authentication only",
  "No licence pooling or concurrent sharing",
  "Isolated single-tenant compute per session",
  "Customer remains the licensee of record",
  "No redistribution of vendor binaries",
  "Session logs scoped to infrastructure telemetry",
];

function ByolSection() {
  return (
    <section id="byol" className="relative scroll-mt-20 bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="BYOL architecture"
          title="Compliance designed in, not retrofitted"
          lead="MeshRun is 100% Bring-Your-Own-License. The platform provides the client engine, the orchestration layer, and the GPU environment. The software licence relationship stays exactly where it already is — between your firm and your vendor."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {BYOL_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-7"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-cyan-400">
                <card.icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-5 text-[15.5px] font-semibold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-7">
          <div className="flex items-center gap-2.5">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <h3 className="font-mono text-[11px] tracking-[0.16em] text-neutral-400 uppercase">
              Compliance posture
            </h3>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {COMPLIANCE_POINTS.map((item) => (
              <div key={item} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80" />
                <span className="text-[13px] text-neutral-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

const PRICING_TIERS = [
  {
    name: "Standard",
    price: 19,
    hours: 15,
    featured: false,
    blurb:
      "For individual drafters and freelancers running focused sessions on a Mac.",
    features: [
      "15 GPU session hours per month",
      "Single-tenant ephemeral nodes",
      "Client-side folder mounting",
      "60 FPS · 4:4:4 display transport",
      "SpaceMouse and full shortcut pass-through",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 49,
    hours: 40,
    featured: true,
    blurb:
      "For studios running production BIM and modelling workloads every day.",
    features: [
      "40 GPU session hours per month",
      "Everything in Standard",
      "Priority regional node allocation",
      "Higher-memory GPU instance classes",
      "Multi-monitor session support",
      "Priority support",
    ],
  },
];

function PricingSection({ onRequestAccess }: { onRequestAccess: () => void }) {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 border-y border-neutral-800/80 bg-neutral-900/25"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Pricing"
          title="Pay for compute, not for software."
          lead="Two subscription tiers, each with a monthly pool of GPU session hours. Your Autodesk licence stays your own — MeshRun never adds software markup."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-7 sm:p-8 ${
                tier.featured
                  ? "border-cyan-400/40 bg-neutral-950 shadow-[0_0_60px_-24px_rgba(34,211,238,0.5)]"
                  : "border-neutral-800 bg-neutral-950"
              }`}
            >
              {tier.featured ? (
                <span className="absolute -top-3 left-7 rounded-full border border-cyan-400/40 bg-neutral-950 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-cyan-300 uppercase">
                  Most popular
                </span>
              ) : null}

              <h3 className="text-[17px] font-semibold tracking-tight text-white">
                {tier.name}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-400">
                {tier.blurb}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-tight text-white tabular-nums">
                  ${tier.price}
                </span>
                <span className="text-[13px] text-neutral-500">USD / month</span>
              </div>
              <div className="mt-2 font-mono text-[11.5px] tracking-wide text-cyan-300">
                {tier.hours} GPU session hours included
              </div>

              <ul className="mt-7 flex-1 space-y-3 border-t border-neutral-800 pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span className="text-[13.5px] leading-relaxed text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={onRequestAccess}
                className={`group mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tier.featured
                    ? "bg-white text-neutral-950 hover:shadow-[0_0_28px_-6px_rgba(34,211,238,0.65)]"
                    : "border border-neutral-800 bg-neutral-900/60 text-neutral-100 hover:border-neutral-700 hover:bg-neutral-900"
                }`}
              >
                Request Early Access
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            <p className="text-[13px] leading-relaxed text-neutral-400">
              <span className="font-medium text-neutral-200">
                Need more time?
              </span>{" "}
              Additional GPU session hours can be purchased on top of either
              subscription at any point in the billing cycle, so a deadline week
              does not mean an upgrade you do not need afterwards. All prices are
              in USD and billed monthly. Bring-Your-Own-License applies to every
              tier: you authenticate with your own Autodesk subscription, and
              MeshRun bills only for orchestration and GPU compute.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Closing CTA                                                               */
/* -------------------------------------------------------------------------- */

function ClosingCta({ onRequestAccess }: { onRequestAccess: () => void }) {
  return (
    <section className="relative overflow-hidden border-t border-neutral-800/80 bg-neutral-950">
      <div className="mr-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-40 h-80"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1.5">
          <span className="mr-animate-ring h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="font-mono text-[11px] tracking-wide text-neutral-300">
            Onboarding by region · GPU capacity limited
          </span>
        </div>
        <h2 className="mt-7 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          Put a real engineering workstation on your MacBook.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-400">
          We are onboarding architecture, engineering, and design studios into the
          private beta in batches. Tell us what you run and we will match you to a
          regional GPU node.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRequestAccess}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 sm:w-auto"
          >
            Request Early Access
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="mailto:contact@meshrun.co"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-7 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-700 hover:text-white sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            contact@meshrun.co
          </a>
        </div>
        <p className="mt-5 text-[12.5px] text-neutral-500">
          Bring your existing Autodesk subscription • Zero software markup.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: NAV_LINKS.map((link) => ({ label: link.label, href: link.href })),
  },
  {
    heading: "Architecture",
    links: [
      { label: "System flow", href: "#architecture" },
      { label: "Display transport", href: "#performance" },
      { label: "Data isolation", href: "#privacy" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "contact@meshrun.co", href: "mailto:contact@meshrun.co" },
      { label: "meshrun.co", href: "https://meshrun.co" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark className="text-[17px]" />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-neutral-500">
              The native engineering workstation client for macOS.
              GPU-accelerated Windows compute, orchestrated on demand.
            </p>
            <div className="mt-5 flex items-start gap-2 font-mono text-[10.5px] leading-relaxed tracking-wide text-neutral-600">
              <Boxes className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              MeshRun Technologies Inc. • British Columbia, Canada
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <div className="font-mono text-[10px] tracking-[0.16em] text-neutral-500 uppercase">
                {column.heading}
              </div>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <a
                      href={link.href}
                      className="text-[13px] text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-800/80 pt-7">
          <div className="flex flex-col gap-2 text-[12.5px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 MeshRun Technologies Inc. All rights reserved.</span>
            <a
              href="mailto:contact@meshrun.co"
              className="transition-colors hover:text-neutral-300"
            >
              contact@meshrun.co
            </a>
          </div>

          <p className="mt-6 max-w-4xl text-[11.5px] leading-relaxed text-neutral-600">
            Autodesk, AutoCAD, and Revit are registered trademarks of Autodesk,
            Inc. in the USA and other countries. MeshRun Technologies Inc. is an
            independent software and orchestration platform provider and is not
            affiliated with, endorsed by, or sponsored by Autodesk, Inc.
          </p>
          <p className="mt-3 max-w-4xl text-[11.5px] leading-relaxed text-neutral-600">
            NVIDIA and RTX are trademarks of NVIDIA Corporation. Apple, macOS,
            Metal, and Apple Silicon are trademarks of Apple Inc. 3Dconnexion and
            SpaceMouse are trademarks of 3Dconnexion. All other trademarks are the
            property of their respective owners and are referenced for
            compatibility and interoperability purposes only.
          </p>
          <p className="mt-3 max-w-4xl text-[11.5px] leading-relaxed text-neutral-600">
            Software licensing is Bring-Your-Own-License. Customers are
            responsible for holding valid licences for any third-party software
            operated within a MeshRun session. Performance figures are engineering
            targets measured on same-region GPU nodes and will vary with network
            conditions, display resolution, and workload.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Early access qualification modal                                          */
/* -------------------------------------------------------------------------- */

function ChoicePill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] font-medium transition-colors ${
        selected
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
          : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
      }`}
    >
      {selected ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-neutral-700" />
      )}
      {children}
    </button>
  );
}

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-3">
      <span className="text-[12.5px] font-medium text-neutral-200">
        {children}
      </span>
      {hint ? (
        <span className="font-mono text-[10px] text-neutral-600">{hint}</span>
      ) : null}
    </div>
  );
}

function WaitlistModal({
  initialEmail,
  onClose,
}: {
  initialEmail: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [software, setSoftware] = useState<string[]>([]);
  const [hardware, setHardware] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // The dialog is only mounted while open, so a fresh mount resets the form.
  // Escape dismisses it, and background scroll stays locked for its lifetime.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const toggleSoftware = (option: string) => {
    setSoftware((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setError("Enter a valid work email address.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <div
        className="mr-animate-fade fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="mr-animate-rise relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/80">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-5">
          <div className="flex items-start gap-3">
            <div>
              <h2
                id="waitlist-title"
                className="text-[15.5px] font-semibold tracking-tight text-white"
              >
                {submitted ? "Request received" : "Early Access Qualification"}
              </h2>
              <p className="mt-1 text-[12.5px] text-neutral-500">
                {submitted
                  ? "Your details are with the MeshRun onboarding team."
                  : "Private beta · MeshRun Technologies Inc."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10">
              <CheckCircle2 className="h-6 w-6 text-cyan-300" />
            </span>
            <p className="mx-auto mt-5 max-w-sm text-[14.5px] leading-relaxed text-neutral-200">
              Thank you. You&rsquo;re on the list. We&rsquo;ll be reaching out
              with early access builds shortly.
            </p>
            <p className="mx-auto mt-3 max-w-sm text-[12.5px] leading-relaxed text-neutral-500">
              Questions in the meantime? Reach us directly at{" "}
              <a
                href="mailto:contact@meshrun.co"
                className="text-cyan-300 hover:underline"
              >
                contact@meshrun.co
              </a>
              .
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 h-11 w-full rounded-xl bg-white text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-6">
            <div>
              <FieldLabel hint="required">Work email</FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@studio.com"
                  autoComplete="email"
                  aria-invalid={error ? true : undefined}
                  className={`h-11 w-full rounded-xl border bg-neutral-900/70 pr-4 pl-10 text-sm text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none ${
                    error
                      ? "border-red-500/60"
                      : "border-neutral-800 focus:border-cyan-400/60"
                  }`}
                />
              </div>
              {error ? (
                <p className="mt-2 text-[12px] text-red-400">{error}</p>
              ) : null}
            </div>

            <div className="mt-6">
              <FieldLabel hint="select all that apply">
                Primary software
              </FieldLabel>
              <div className="flex flex-wrap gap-2">
                {SOFTWARE_OPTIONS.map((option) => (
                  <ChoicePill
                    key={option}
                    selected={software.includes(option)}
                    onClick={() => toggleSoftware(option)}
                  >
                    {option}
                  </ChoicePill>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <FieldLabel>Client hardware</FieldLabel>
              <div className="relative">
                <Cpu className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <select
                  value={hardware}
                  onChange={(event) => setHardware(event.target.value)}
                  aria-label="Client hardware"
                  className="h-11 w-full appearance-none rounded-xl border border-neutral-800 bg-neutral-900/70 pr-10 pl-10 text-sm text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                >
                  <option value="" disabled>
                    Select your primary machine
                  </option>
                  {HARDWARE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <div className="mt-6">
              <FieldLabel>Organization size</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {TEAM_SIZES.map((option) => (
                  <ChoicePill
                    key={option}
                    selected={teamSize === option}
                    onClick={() => setTeamSize(option)}
                  >
                    {option}
                  </ChoicePill>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              Submit request
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-[11.5px] leading-relaxed text-neutral-600">
              We review applications in batches by region and GPU availability.
              MeshRun is Bring-Your-Own-License; your existing vendor
              subscription is unaffected.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState("");
  const [navVisible, setNavVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback((email = "") => {
    setPrefillEmail(email);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  // The bar drops in once the landing screen has been scrolled past. Observing
  // a sentinel avoids a scroll listener firing on every frame.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setNavVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
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
    <div className="flex min-h-screen w-full flex-col bg-neutral-950">
      <NavBar onRequestAccess={() => openModal()} visible={navVisible} />

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
        <ProblemSection />
        <PlatformSection />
        <PerformanceSection />
        <ArchitectureSection />
        <PrivacySection />
        <ByolSection />
        <PricingSection onRequestAccess={() => openModal()} />
        <ClosingCta onRequestAccess={() => openModal()} />
      </main>

      <Footer />

      {modalOpen ? (
        <WaitlistModal initialEmail={prefillEmail} onClose={closeModal} />
      ) : null}
    </div>
  );
}