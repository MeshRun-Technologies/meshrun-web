---
name: MeshRun
description: Full-featured Windows CAD streamed to the machine you already carry.
colors:
  graphite-base: "#0a0a0a"
  graphite-raised: "#171717"
  graphite-plate: "#16181d"
  graphite-void: "#08090b"
  hairline: "#262626"
  hairline-hover: "#404040"
  drafting-cyan: "#00d2ef"
  drafting-cyan-lit: "#53eafd"
  drafting-cyan-pale: "#a2f4fd"
  teal-terminus: "#46ecd5"
  paper: "#ededed"
  text-primary: "#ffffff"
  text-body: "#a1a1a1"
  text-secondary: "#8d8d96"
  text-tertiary: "#7c7c85"
  signal-live: "#00d294"
  signal-error: "#ff6568"
  autocad-red: "#f05340"
  fusion-amber: "#f5983b"
  revit-blue: "#4ba9e2"
  inventor-teal: "#37bfa8"
  civil3d-green: "#93c83e"
  max-violet: "#8f7bf5"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 7.2vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.16em"
  readout:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "2px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  full: "9999px"
spacing:
  hairline: "1px"
  xs: "6px"
  sm: "10px"
  md: "20px"
  lg: "28px"
  xl: "56px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.graphite-base}"
    rounded: "{rounded.xl}"
    padding: "0 28px"
    height: "48px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "#e5e5e5"
    textColor: "{colors.graphite-base}"
  button-ghost:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "0 28px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.text-primary}"
  nav-link:
    textColor: "{colors.text-body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    typography: "{typography.body}"
  nav-link-hover:
    textColor: "{colors.text-primary}"
  chip-unselected:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  chip-selected:
    backgroundColor: "rgba(0, 210, 239, 0.1)"
    textColor: "{colors.drafting-cyan-pale}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  input:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "0 16px 0 40px"
    height: "44px"
  card:
    backgroundColor: "{colors.graphite-base}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.2xl}"
    padding: "28px"
---

# Design System: MeshRun

## Overview

**Creative North Star: "The Drafting Table at Night"**

The room is dark and the sheet is not white — it is graphite under a lamp. Everything on this surface is *drawn* rather than painted: hairline rules, plotted grids, linework that could have come off a pen plotter. Weight comes from line and tone, never from fill or ornament. The page behaves like a technical document that happens to be lit from within.

Exactly one thing on the sheet carries current. Drafting Cyan is the live trace — it marks what is measured, what is selected, and what will respond to a click. It is never a mood, a gradient, or a way to make a section feel important. When a reader's eye is pulled to cyan, something is actually happening there.

Density is respect. The audience arrives to verify a claim, so type runs small and tight, numbers are monospaced so they align down a column, and a spec table is preferred over a card whenever the content is genuinely tabular. Whitespace separates ideas; it is never used to make thin content look considered.

**Key Characteristics:**
- Graphite tonal layering (#0a0a0a → #171717) instead of shadow for structure
- Hairline 1px borders as the primary drawing tool, including 1px grid gaps between cells
- A single accent, used as signal rather than decoration
- Monospace reserved for measurement, identifiers, and labels — never for atmosphere
- Small, tight, dense type with generous separation between groups
- Motion that arrives and settles; nothing loops for attention

## Colors

A graphite ground with one electric accent and a small set of literal signal colours. The palette is deliberately narrow: almost every surface is one of three greys, and colour is reserved for meaning.

### Primary
- **Drafting Cyan** (`#00d2ef`): The live trace. Focus rings, selected state, measured values, active nav underline, the lit circuit in the landing backdrop, and the icon wells on every feature cell. This is the only hue permitted to attract the eye on its own.
- **Drafting Cyan Lit** (`#53eafd`): The brighter step, used where cyan sits on a cyan-tinted surface and needs to separate from it — readouts inside tinted wells, the confirmation mark, accent text on a 10%-cyan fill.
- **Drafting Cyan Pale** (`#a2f4fd`): Text on a cyan-tinted chip, where the lit step would vibrate.

### Secondary
- **Teal Terminus** (`#46ecd5`): Only ever the far end of the headline gradient and the nav-link underline sweep. It is a direction of travel away from cyan, not an independent accent, and it never appears alone.

### Tertiary
- **Product Marks** (`#f05340` AutoCAD, `#f5983b` Fusion, `#4ba9e2` Revit, `#37bfa8` Inventor, `#93c83e` Civil 3D, `#8f7bf5` 3ds Max): Borrowed identity colours carried only by the landing cycler, each paired with an original geometric mark. These are quotations, not palette members — they may never be reused as UI colours elsewhere.

### Neutral
- **Graphite Void** (`#08090b`): The document ground behind everything, set on `body`.
- **Graphite Base** (`#0a0a0a`): The working surface — section backgrounds, cards, and every cell inside a bordered grid.
- **Graphite Raised** (`#171717`): One tonal step up. Inputs, ghost buttons, chips, and any surface that should read as sitting *on* the base rather than cut into it.
- **Graphite Plate** (`#16181d`): The landing screen only — a faintly cooler, lighter plate that separates the first viewport from the document below it.
- **Hairline** (`#262626`): The drawing tool. Every border, divider, and 1px grid gap.
- **Hairline Hover** (`#404040`): The same line, woken up.
- **Paper** (`#ededed`): Default inherited foreground.
- **Text Primary** (`#ffffff`): Headings, values, and anything a reader scans for.
- **Text Body** (`#a1a1a1`): Running prose. 7.6:1 on Graphite Base.
- **Text Secondary** (`#8d8d96`): Supporting detail under a value, card sub-copy. 6.7:1.
- **Text Tertiary** (`#7c7c85`): Footnotes, spec labels, legal. 4.8:1 — the dimmest text permitted anywhere.

### Signal
- **Signal Live** (`#00d294`): Operational state only — the pulsing availability dot. Never a brand or success accent.
- **Signal Error** (`#ff6568`): Validation messages and the errored field border.

### Named Rules

**The Live Trace Rule.** Drafting Cyan means *current is flowing here*: it is measured, selected, focused, or clickable. If an element is cyan and none of those are true, the colour is wrong — not the element.

**The Three Greys Rule.** Any new surface must be Graphite Base, Graphite Raised, or transparent. A fourth grey needs a reason that the existing three demonstrably cannot serve.

**The 4.8 Floor Rule.** No text below `#7c7c85`. Tailwind's stock `neutral-500` and `neutral-600` measure 4.18:1 and 2.53:1 on this ground and are overridden in `globals.css` precisely so the floor cannot be breached by reaching for a default.

**The Quotation Rule.** Product marks are quotations of someone else's identity. They appear only where a specific product is named, never as decoration, never in a chart, never as a UI accent.

## Typography

**Display / Body Font:** Geist (with `ui-sans-serif, system-ui, sans-serif`)
**Label / Readout Font:** Geist Mono (with `ui-monospace, monospace`)

**Character:** Geist is a neutral grotesque with enough width at small sizes to stay legible under dense settings, and enough authority at display weight to carry a one-line claim. The pairing is deliberately unromantic — the personality comes from how tightly it is set, not from the faces themselves. Display tracking is pulled to -0.035em so large type reads as a machined unit rather than a headline.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 7.2vw, 5.25rem)`, 1.02, -0.035em): The landing claim only. One per page, maximum.
- **Headline** (600, `clamp(1.875rem, 3vw, 2.25rem)`, ~1.15, -0.025em): Section openers. Balanced with `text-wrap: balance`.
- **Title** (600, 15.5–17px, ~1.35): Card and component headings.
- **Body** (400, 13–15px, 1.65): Running prose. Leads cap at `max-w-3xl`; card prose sits comfortably inside 45–60ch.
- **Label** (400 mono, 10–11px, 0.16em, uppercase): Field labels, spec keys, column heads, the scroll cue. Uppercase and tracked wide so it reads as annotation rather than content.
- **Readout** (400 mono, 10–12px, `tabular-nums` where columnar): Measured values, latency figures, mount paths, identifiers.

### Named Rules

**The Measurement Rule.** Monospace is for things that were measured, identified, or typed at a machine: figures, units, file paths, spec keys, codec names. It is never a costume for making prose look technical.

**The Tabular Rule.** Any number that sits in a column, or that updates in place, carries `tabular-nums`. Figures that shift width while changing are a defect.

**The One Claim Rule.** Display type states a claim, never a category. If the line could head a section on any competitor's site, it is not display copy.

## Layout

A single centred column on a 12-column-equivalent rhythm, capped at `max-w-7xl` (1280px) with 20px gutters rising to 32px at `sm`. Reading measures are capped independently of the container: section leads at `max-w-3xl`, landing copy at `max-w-4xl`, the display line at `16ch`.

Vertical rhythm is section-scale: 80px of padding at mobile, 96px from `sm` up, with a hairline border marking most section boundaries. Inside a section, related content groups tightly (10–28px) and distinct groups separate generously (56px+). Headings always carry more space above than below.

The signature layout device is the **hairline grid**: a container with `gap: 1px` on a Hairline background, children on Graphite Base. The gap *is* the rule line — no child draws its own border. It appears at 2, 3, and 4 columns and collapses to a single column on mobile, where the 1px gaps become horizontal rules.

Breakpoints are Tailwind's defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. The landing screen uses `100svh` rather than `100vh` so mobile browser chrome cannot crop the scroll cue.

### Named Rules

**The Gap-As-Rule Rule.** In a multi-cell block, structure comes from 1px gaps over a Hairline ground — never from per-card borders, and never from shadows.

**The Measure Rule.** The container caps the layout; it never sets the reading measure. Prose gets its own max-width every time.

## Elevation & Depth

**Flat by default; light is the exception.** This system builds depth from tone and line, not from shadow. A surface sits higher because it is a lighter grey and because a hairline separates it — not because it casts anything. The overwhelming majority of the page has no `box-shadow` at all, and that is the intended steady state.

Shadow is admitted in exactly two situations. The first is genuine occlusion: the modal floats above the document and needs to read as detached, so it carries a heavy black shadow plus a backdrop blur. The second is emission: a primary button is the live element on its section, and on hover it emits a cyan glow rather than lifting. Nothing else in the system is permitted to cast.

### Shadow Vocabulary
- **Occlusion** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8)`): Modal surface only. Paired with `backdrop-filter: blur(4px)` on the scrim.
- **Emission — control** (`box-shadow: 0 0 24px -6px rgba(34,211,238,0.6)`): Primary button hover in the nav.
- **Emission — commitment** (`box-shadow: 0 0 28px -6px rgba(34,211,238,0.65)`): The featured pricing tier's button.
- **Emission — surface** (`box-shadow: 0 0 60px -24px rgba(34,211,238,0.5)`): The featured pricing card at rest. The only resting glow in the system, and it marks a recommendation.
- **Hairline ring** (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05)`): Optional inner edge on a floating surface, under the occlusion shadow.

### Named Rules

**The Flat-At-Rest Rule.** Surfaces do not cast at rest. The single exception is the recommended pricing tier, where the resting glow *is* the recommendation.

**The Emit, Don't Lift Rule.** Interactive elements respond by glowing, not by translating upward. Nothing in this system moves toward the reader on hover.

## Shapes

A tight, mechanical radius ladder. Corners are eased just enough to read as manufactured rather than cut, and never enough to read as soft.

- **2px** — inline tags and focus targets on text
- **6px** — nav links and small icon buttons
- **8px** — chips, icon wells, small buttons
- **12px** — inputs, primary buttons, callout panels
- **16px** — cards, grid containers, the modal
- **full** — status pills, the scroll cue, state dots

Borders are 1px, always. There is no 2px border anywhere in the system and none should be introduced; weight is expressed through colour (Hairline → Hairline Hover), not thickness. Icon wells are a recurring silhouette: a 36px rounded-8px square with a 1px cyan-tinted border and a 10%-cyan fill, holding a 16px stroked icon — it marks the start of a feature cell throughout the page.

Iconography is Lucide at a consistent 1.5–2px stroke, sized 12–24px. The CAD product marks are original geometric drawings on the same stroke discipline so they sit in the same family.

### Named Rules

**The One Pixel Rule.** Every border in this system is 1px. A heavier line means a different colour, never a thicker stroke.

## Components

Components are **instrument-grade and tactile**: crisp, precise, with state changes that feel like a mechanism engaging rather than a surface animating. At rest they are quiet; under the cursor they respond immediately and unambiguously.

### Buttons
- **Shape:** 12px radius (`rounded-xl`) at full size, 8px (`rounded-lg`) in the nav.
- **Primary:** Inverted — white fill, Graphite Base text, 600 weight, 48px tall (44px in dialogs), 28px horizontal padding. The inversion is what makes it the loudest object on a dark page without using the accent.
- **Hover / Focus:** Primary shifts to `#e5e5e5`, or emits a cyan glow where the button sits in a section of its own. The trailing arrow translates 2px right (`group-hover:translate-x-0.5`). Focus draws the global 2px Drafting Cyan ring at 2px offset.
- **Ghost:** 1px Hairline border on Graphite Raised at 60% opacity, Text Primary. Hover lifts the border to Hairline Hover and the fill to full Graphite Raised.

### Chips
- **Style:** 8px radius, 1px border, 12.5px medium text, with a leading state glyph — a filled cyan check when selected, a hollow 1px ring when not.
- **State:** Unselected sits on Graphite Raised at 60% with Text Body; selected takes a Drafting Cyan border at 50%, a 10% cyan fill, and Drafting Cyan Pale text. Multi-select and single-select share the component; only the handler differs.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** Graphite Base, or Graphite Raised at 40% for a secondary panel.
- **Shadow Strategy:** None. See Elevation — structure comes from the 1px border and the tonal step.
- **Border:** 1px Hairline. Inside a hairline grid the card draws no border at all; the 1px gap does the work.
- **Internal Padding:** 24–32px (28px is the default).

### Inputs / Fields
- **Style:** 44px tall, 12px radius, 1px Hairline border on Graphite Raised at 70%, with a 16px leading icon inset 14px and 40px of left padding to clear it. Placeholder at Text Tertiary.
- **Focus:** Border shifts to Drafting Cyan at 60% and a 2px cyan ring at 20% opacity blooms outside it. The caret is Drafting Cyan. This is the one place a component overrides the global focus ring, and it is deliberate.
- **Error:** Border to Signal Error at 60%, message below in Signal Error, `aria-invalid` set. The error clears on the next keystroke rather than on resubmit.

### Navigation
- **Style:** Fixed, 64px tall, Graphite Void at 80% with a 24px backdrop blur and a 1px Hairline bottom edge. Hidden over the landing screen and translated down into place once the reader passes it.
- **States:** Links are Text Body at 13px medium, rising to Text Primary on hover while a 1px cyan-to-teal underline wipes in from the left (`scale-x-0 → 100`, origin-left, 300ms). Never a background fill.
- **Mobile:** Below `lg`, links collapse behind a bordered icon button into a stacked panel; the panel is bound to the bar's own visibility so it cannot outlive it.

### Hairline Grid (signature)
The system's defining container. A `grid` with `gap: 1px` on a Hairline background, 16px radius, `overflow-hidden`, children on Graphite Base with 24–28px padding. Each cell opens with an icon well, then a mono label, then a value, then supporting prose. It carries the metric band, the four pillars, and the five subsystem cards — and it is the first thing to reach for when content is genuinely parallel.

### Product Cycler (signature)
The landing's rotating product name. A fixed-height inline slot whose width is driven from the measured width of the active label and transitioned over 650ms on an exponential ease, so the words around it glide rather than snap. Labels cross-fade with a 4px blur and a short vertical drift; each carries its own product colour, its own original geometric mark, and its own weight/tracking treatment. A visually-hidden line names every product so the rotation is never the only way to read the list.

## Do's and Don'ts

### Do:
- **Do** build structure from 1px Hairline (`#262626`) borders and 1px grid gaps. The Gap-As-Rule Rule is the house style.
- **Do** keep every surface on one of the three greys — Graphite Base, Graphite Raised, or transparent.
- **Do** reserve Drafting Cyan for measured, selected, focused, or clickable things. The Live Trace Rule is the single most important constraint in this system.
- **Do** set measured values in Geist Mono with `tabular-nums`, and label them in tracked uppercase mono.
- **Do** give every interactive element the 2px Drafting Cyan focus ring at 2px offset; inputs may override it with their own bloom.
- **Do** keep text at or above `#7c7c85` (4.8:1). Reach for the overridden `neutral-500`/`600`, never a raw Tailwind default below them.
- **Do** use `100svh` for full-height screens so mobile chrome cannot crop content.
- **Do** animate on `cubic-bezier(0.22, 1, 0.36, 1)` at 200–650ms — arrive fast, settle slow.

### Don't:
- **Don't** drift toward generic dark SaaS: no purple-to-blue gradients, no glassmorphism panels, no aurora blob behind the hero, no cards floating on a void.
- **Don't** drift toward a gaming or RGB aesthetic: no multi-colour neon, no chrome, no glow for its own sake. GPUs are the subject, not the styling brief.
- **Don't** drift toward enterprise blue corporate: no stock photography, no safe navy, no rounded friendly illustration, no trust badges.
- **Don't** drift toward consumer-app playfulness: no pastel fills, no mascots, no bouncy spring motion, no oversized rounded shapes.
- **Don't** add a shadow to a resting surface. The featured pricing card is the one sanctioned exception and it earns it by meaning "recommended".
- **Don't** use a border heavier than 1px. Express weight through colour instead.
- **Don't** put an eyebrow or kicker above a heading, or number sections `01 / 02 / 03` unless the sequence is genuinely load-bearing. Both were removed from this build deliberately.
- **Don't** use monospace to make prose look technical. It marks measurement, not mood.
- **Don't** reuse the CAD product colours as UI accents — they are quotations of other companies' identities.
- **Don't** simulate product UI, invent telemetry, or imply evidence that does not exist. This is a brand-level constraint from PRODUCT.md and it outranks any visual goal.
