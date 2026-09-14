# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary, today: students and makers.** Individuals who would rather carry a lighter, better-built laptop with real battery life, and for whom software compatibility is the only thing standing in the way. Confirmed 2026-09-13: these are people who **chose** their hardware deliberately — not firms that ended up on Macs by accident.

**The job.** Run the full desktop version of industry-standard x86 Windows engineering software — Autodesk Revit, AutoCAD and its specialised toolsets (MEP, Plant 3D, Architecture), Fusion, Inventor, Civil 3D, 3ds Max — from the machine they actually want to carry, without buying a second one and without giving up the laptop they preferred in the first place.

**Explicitly not the target today.** Firms, studios, teams, and enterprise. Confirmed 2026-09-13: team and enterprise plans are intended to follow *after* individual plans ship. Until then nothing — copy, pricing, onboarding, or qualification flow — should be built around procurement, seat counts, IT approval, or studio rollout.

**Also in scope.** People on low-spec PCs and thin clients with the same compatibility problem. The blocker is the software, not the badge on the lid.

**Second audience.** Startup-credit reviewers (AWS Activate, NVIDIA Inception, Microsoft for Startups, Google Cloud). They must be able to read MeshRun as a proprietary engineering platform with its own client and control plane, not as a VM hosting reseller. This audience reads the same public surface as buyers; it does not get its own.

## Product Purpose

MeshRun pairs a native desktop client with a cloud GPU orchestration control plane to deliver on-demand, GPU-accelerated Windows engineering environments to machines that cannot run that software locally.

Success today is qualified private-beta signups from individual students and makers who fit the profile, plus credibility with startup-credit reviewers. Success later is those individuals doing real coursework, project, and portfolio work on MeshRun daily instead of on a second machine — and only then, teams.

## Positioning

**"On anything" is literal.** Any adequately connected client is a target. Apple Silicon leads because it is the sharpest and most common version of the pain, not because the product is Mac-only. Confirmed 2026-09-13: thin clients and low-spec PCs are real targets, not aspirational ones.

**The mechanism a neighbouring product could not truthfully copy.** MeshRun owns the client engine, the input and peripheral pipeline, and the display transport as one engineered system:

- hardware-accelerated video decode composited directly onto a native GPU viewport (on Apple Silicon: VideoToolbox into Metal), keeping CPU load and battery drain low;
- low-level OS keyboard hooks that pass CAD chords (`Cmd`, `Esc`, `F3` Osnap, `F8` Ortho) to the remote session before the host OS can claim them;
- native USB redirection for 3Dconnexion SpaceMouse 6-axis controllers;
- direct GPU frame-buffer capture through hardware NVENC pipelines, at 4:4:4 chroma so hairline vector weights and small annotation type do not fringe;
- client-side folder mounting, so project files stay on the user's own disk by default, with cloud versioning available as an opt-in rather than a requirement.

It is not a browser viewer, a stripped-down native port, or a remote desktop pointed at a rented VM.

**Licensing position.** 100% Bring-Your-Own-License. MeshRun bills for orchestration and GPU compute only, never for software, and never resells or pools vendor licences.

## Operating Context

- The work is file-centric and personal: coursework, capstone and portfolio projects, hobbyist hardware, 3D printing and CNC jobs. The file of record — `.rvt`, `.dwg`, `.f3d` — lives on the individual's own laptop.
- The hardware preference is deliberate and is the whole point. Weight, battery life, build quality, and silence are why this person bought the machine they have. Any answer that requires carrying a second laptop defeats the reason they chose the first.
- Buying is individual and budget-sensitive: a personal card, not an expense line and not a procurement cycle. Metered hours with top-ups fit work that arrives in bursts around assignment and project deadlines rather than at a steady weekly rate.
- Licences are already held by the user — student/education entitlements or personal subscriptions — which is what makes Bring-Your-Own-License the natural fit rather than a compliance workaround.
- Peripherals and muscle memory still matter: SpaceMouse, and keyboard chords that behave exactly as they do on a Windows workstation. Multi-monitor rigs and managed IT do not.

## Capabilities and Constraints

**Stage: pre-product.** Confirmed 2026-09-13. There is nothing externally runnable. No shipped client, no public beta sessions, no external users. The website's job is to sell the concept and collect qualified beta signups.

**Consequences that bind all future work:**

- Performance figures come from **internal testing** against a same-region server. Confirmed 2026-09-13: 120 FPS at 2K, 4:4:4 chroma, 20–40ms end-to-end across North America (≈21.8ms same-region), on NVIDIA RTX 4000 Ada workstation GPUs. These are real measurements, not targets, but they are first-party and unaudited: describe them as internal testing, never as third-party validated or as live telemetry from user sessions.
- No screenshot, recording, or simulated product UI may be published until a real one exists. A fabricated interface was built and removed during the 2026-09-12 build at the user's direction; that decision is durable, not a one-off.
- Tense, confirmed 2026-09-13: the product is described in ordinary present tense, as a pre-launch site normally would. The honesty line is drawn at **evidence**, not grammar — never imply live capacity, running sessions, existing users, or onboarding already under way.
- Pricing is planned, not live: Standard $19/month USD with 15 GPU session hours; Pro $49/month USD with 40 hours; additional hours purchasable on top of either subscription mid-cycle. All prices USD, billed monthly.

**Data handling.** Confirmed 2026-09-13.

- Client-side folder mounting is the default, and the file system of record stays on the user's machine.
- Cloud autosave and versioning exist as an **opt-in**, not a default. The data-sovereignty promise and the autosave feature are only compatible where the copy states the opt-in explicitly. The shipped site currently asserts both side by side without that qualifier.
- MeshRun states it has no access to user data.

**Infrastructure and compliance.** Confirmed 2026-09-13.

- The hosting provider is **undecided** between AWS and DigitalOcean. Both hold SOC 2 Type II.
- MeshRun Technologies Inc. itself holds **no** certification of any kind. Any compliance statement must be attributed to the infrastructure provider and must never read as MeshRun's own audited posture. A reviewer or enterprise buyer who asks for MeshRun's report will find there is none.

**Undecided, do not invent:**

- Where the beta signup form submits. It currently holds state locally and posts nowhere; no backend, CRM, or email provider has been chosen.
- Which client platforms beyond macOS ship first, and on what timeline.
- Supported regions. The GPU instance class is confirmed: NVIDIA RTX 4000 Ada.
- Whether a student or education tier exists, and how it relates to Standard. Only Standard and Pro are confirmed.
- Whether Autodesk **education** entitlements may lawfully be used inside a MeshRun session. Autodesk education licences carry use restrictions, and the BYOL model puts this question directly in the path of the primary audience. Must be answered before student-specific licensing copy is written.
- When team and enterprise plans arrive, and what they include. Confirmed only that they follow individual plans.
- The hosting provider, and therefore which provider's compliance posture applies.
- The encryption and access model for opt-in cloud autosave — specifically what makes "no access to user data" hold once work is stored server-side. Needed before any security or compliance claim is written.

## Brand Commitments

- **Legal entity:** MeshRun Technologies Inc. **Headquarters:** British Columbia, Canada. **Domain:** meshrun.co. **Contact:** contact@meshrun.co. **GitHub org:** MeshRun-Technologies.
- **Product brand:** MeshRun. The wordmark is set as clean bold type. **There is no logo yet** — as of 2026-09-13 no mark has been designed or chosen, and no placeholder mark should be reintroduced anywhere in the product.
- **Voice:** technical, high-density, declarative. Written for technically literate readers who will check the claims. No generic marketing fluff, no invented urgency.
- **Honesty is a hard brand constraint, not a preference.** Simulated product UI, fabricated telemetry, invented customers, benchmarks, or testimonials are out of bounds. This was established by direct user correction ("tacky and untrue") and supersedes any persuasion goal.
- **Third-party trademarks:** Autodesk, AutoCAD, Revit and other product names are used nominatively only, to state compatibility. MeshRun ships no Autodesk logo artwork or brand typefaces; product marks used in the UI are original geometric drawings with brand-associated accent colours. NVIDIA/RTX, Apple/macOS/Metal/Apple Silicon, and 3Dconnexion/SpaceMouse are likewise referenced for interoperability only. A non-affiliation disclaimer is required on the public site and must not be removed.

## Evidence on Hand

**None.** Confirmed 2026-09-13. Specifically, MeshRun has:

- **no** accepted startup-program membership — not NVIDIA Inception, AWS Activate, Microsoft for Startups, or Google Cloud. Programme names may describe the *audience* MeshRun is being presented to, but acceptance must never be claimed or implied;
- **no** product screenshots, recordings, or captures of any kind;
- **no** design partners, pilot firms, named customers, or logos to display;
- **no** third-party validation of MeshRun itself. The only third-party attestation in reach is the future hosting provider's own SOC 2 Type II, which is theirs and not MeshRun's, and cannot be claimed until a provider is actually chosen.

The one real exception: **internal benchmark data does exist.** Confirmed 2026-09-13, the 120 FPS / 20–40ms figures were measured in-house against a same-region server and are cited on the site as such. They are first-party and unaudited, so they support a performance claim but never a compliance or proof claim.

Future work must not fabricate any of the above, and must not use social-proof patterns (logo walls, testimonial blocks, customer counts, "trusted by") that imply evidence that does not exist. The public surface stands on the concept, the architecture, and the honesty of its framing.

The only real assets in the repository are the create-next-app default SVGs in `public/`, which are placeholders, not brand assets.

## Product Principles

1. **Individuals first.** The product is built for one person paying with their own card. Nothing should assume a team, an administrator, or a procurement process until individual plans have actually shipped.
2. **Claim only what is true today, and label the rest as intent.** Targets are called targets; absent proof is left absent rather than simulated. Credibility with engineers and with credit reviewers depends on the same discipline.
3. **Own the pipeline, and show the engineering.** The defensible story is the client engine, input pipeline, and display transport built as one system. Depth and specificity are the persuasion.
4. **Any machine, with Apple Silicon in front.** Lead with the sharpest case without writing copy that makes the product sound Mac-only.
5. **Never take custody of what is theirs.** Their files stay on their disk by default; their licence stays between them and their vendor. Client-side mounting, single-tenant ephemeral nodes, BYOL, and zero software markup are structural commitments, not features.

## Accessibility & Inclusion

No formal conformance target (e.g. a WCAG level) has been set — **undecided**, not waived.

Two commitments already hold in the shipped implementation and should be preserved: motion is fully suppressed under `prefers-reduced-motion`, and the interface is keyboard-operable with visible focus. Users work long sessions in dense, detail-critical tools, so legibility at small sizes and restrained motion matter more here than category norms suggest.
