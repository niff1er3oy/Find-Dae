---
name: Find Dae
description: AI face-recognition photo finder for Thai events
colors:
  bg: "#fff8f5"
  ink: "#2d3748"
  ink-muted: "#64748b"
  primary: "#ff8c42"
  primary-deep: "#cc5500"
  secondary: "#ffb8d1"
  secondary-deep: "#be185d"
  tertiary: "#ffe066"
  peach: "#ffc2a1"
  surface: "#ffffff"
typography:
  display:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "clamp(2rem, 8vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.3
  body:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  xs: "12px"
  sm: "20px"
  md: "24px"
  lg: "32px"
  xl: "40px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "#ff8c42"
    textColor: "#ffffff"
    rounded: "9999px"
    padding: "16px 36px"
  button-primary-hover:
    backgroundColor: "#ff6b35"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "#ff8c42"
    rounded: "9999px"
    padding: "16px 36px"
  button-pink:
    backgroundColor: "#f472b6"
    textColor: "#ffffff"
    rounded: "9999px"
    padding: "16px 36px"
  card:
    backgroundColor: "#ffffffd9"
    textColor: "#2d3748"
    rounded: "32px"
    padding: "40px"
  nav:
    backgroundColor: "#ffffffe6"
    textColor: "#2d3748"
    rounded: "9999px"
    padding: "12px 24px"
---

# Design System: Find Dae

## 1. Overview

**Creative North Star: "The Event Memory Machine"**

Find Dae's visual language is built around a single emotional arc: from the mild frustration of scrolling through hundreds of event photos to the instant delight of finding yourself in the crowd. Every screen before the result is setup — the design must minimize drag on that journey. The interface should feel warm, fast, and a little magical, like a clever friend who runs your photos through a machine and hands them back in seconds.

The palette is warm and celebratory. Festival Tangerine (`#ff8c42`) anchors the energy; Petal Pink (`#ffb8d1`) softens it for the attendee journey; Celebration Yellow (`#ffe066`) marks moments of reveal and joy. Surfaces are frosted-white glass panels floating over a polka-dot background — depth created by layering and blur, not shadow stacking. All shadows carry an orange tint: the same light source as the brand color, not borrowed gray.

Type is Nunito throughout: rounded letterforms, extreme weights (800–900 for headings) that command hierarchy without sharpness, and natural fit for Thai + Latin dual-script layouts. Motion is choreographed and physics-aware — buttons press down and spring back, elements enter with spring physics, background blobs drift and morph. The system explicitly rejects enterprise SaaS blue-white, Notion-adjacent muted warmth, and sterile AI-tool minimalism. Find Dae's warmth is earned through saturated accents and physical motion, not beige surfaces and soft grays.

**Key Characteristics:**
- Festival energy: saturated accents carry emotion; surfaces stay near-neutral
- Rounded everything: pill buttons, 32–40px card radii, organic blobs — nothing sharp-cornered
- Physics-aware interaction: buttons travel when pressed; elements spring into view
- Glass surfaces: frosted-white panels (backdrop-blur) float above the textured background
- Thai-first: Nunito's rounded forms work well with Thai script; no tracking adjustments on Thai text
- Dual-role color: Orange = photographer/creator side; Pink = attendee/finder side

## 2. Colors: The Festival Palette

Four named roles carry all the energy. Neutrals support without competing.

### Primary
- **Festival Tangerine** (`#ff8c42`): The brand's core energy. Used for the primary CTA button, the logo mark, active states, and any "action that creates" (upload, manage, add). Never muted or desaturated.
- **Tangerine Deep** (`#cc5500`): The 3D floor shadow under the primary button. Collapses on `:active` to simulate physical depression. Not used as a surface color.

### Secondary
- **Petal Pink** (`#ffb8d1`): Attendee-side accent. Marks the "find my photo" user journey — attendee role card, pink CTA button, step indicators in the attendee flow, and hover states in attendee-side nav links.
- **Pink Deep** (`#be185d`): Petal Pink's pressed-state shadow. Same mechanics as Tangerine Deep.

### Tertiary
- **Celebration Yellow** (`#ffe066`): Reserved for joy moments: star icons, background blob #2, the "How it works" hover highlight. Never used for text; fails contrast at every useful weight.

### Neutral
- **Warm Canvas** (`#fff8f5`): The body background. Near-white with a breath of peach warmth. Its role is to be clearly background — the accents do the emotional work, not the surface tint.
- **Deep Slate** (`#2d3748`): Primary text. Soft-dark (not pure black) to avoid harshness against the warm canvas. All headings and primary body text.
- **Support Slate** (`#64748b`): Supporting text, card descriptions, secondary labels. Verify ≥4.5:1 contrast against `#fff8f5` before every use — the combination is borderline AA. If it fails, use `#475569` instead.
- **Soft Peach** (`#ffc2a1`): Decorative: secondary blob accents, the "pressed" floor shadow on secondary buttons, subtle inner-glow fills.
- **Frosted White** (`rgba(255,255,255,0.85)`): Card and panel surfaces with `backdrop-filter: blur(12px)`. Never use without the blur — without it the glass effect collapses to a flat opaque card.

**The No-Gradient-Text Rule.** Gradient text (`-webkit-text-fill-color: transparent` with `background-clip: text`) is prohibited. The `gradient-text-fun` class in `globals.css` is deprecated — replace every instance with a solid `#ff8c42` or `#ffb8d1` colored span. Gradient text is decorative noise that can't be selected, inverts poorly, and fails the "is this designed or is this AI?" test.

**The Dual-Role Color Rule.** Orange carries the photographer/creator identity; Pink carries the attendee/finder identity. Keep this mapping consistent across role cards, dashboard headers, CTAs, and step indicators. It silently tells users which side of the product they're on.

## 3. Typography

**Body / Display Font:** Nunito (Google Fonts), weights 400–900

**Character:** Single family, multi-weight. Nunito's rounded letterforms are deliberately chosen over geometric sans (no Inter, no Geist): the slightly soft terminals fit the bubbly personality and hold up in Thai script without breaking ligatures. The weight contrast between body (500) and headings (800–900) is dramatic enough to create clear hierarchy without a second typeface. No font pairing — the personality lives in the weight axis alone.

### Hierarchy
- **Display** (900, `clamp(2rem, 8vw, 4.5rem)`, line-height 1.1, letter-spacing −0.02em): Hero headings only (`<h1>` on landing page and key screens). Extreme weight and negative tracking are reserved for the biggest moments.
- **Headline** (800, `clamp(1.5rem, 4vw, 3rem)`, 1.15, −0.02em): Section headings, card headings, dashboard hero names (`<h2>`, prominent `<h3>`).
- **Title** (800, `1.5rem / 24px`, 1.3): Card titles, step headings, role names, modal headings.
- **Body** (500–700, `1rem / 16px`, 1.6): All prose, card descriptions, supporting copy. Do not go below weight 500 — Nunito's lighter weights are too thin for the playful-bold personality, especially in Thai.
- **Label** (700, `0.875rem / 14px`, 1.4): Tags, badges, chips, button text, nav links, form labels.

**The No-Thai-Letterspacing Rule.** Never apply positive `letter-spacing` to Thai-script body text — it breaks glyph clusters and ligatures. Letter-spacing adjustments (`-0.02em`) are permitted only on Latin display/headline text at heading scale.

**The No-Thin-Weight Rule.** Nunito weights below 500 are prohibited for any visible text. The brand is bold and warm — thin text reads as timid.

## 4. Elevation

The system uses **glass layering**, not ambient shadow stacking. Depth comes from frosted surfaces (`backdrop-filter: blur(...)`) floating above a textured background (polka-dot pattern), not from progressively heavier shadows. Shadows serve one specific role each: orange-tinted ambient glow on cards, and a 3D-press "floor" on interactive buttons.

### Shadow Vocabulary
- **Ambient Glow** (`0 10px 40px -10px rgba(255,140,66,0.15)`): Cards at rest. An orange-tinted halo that reads as warmth, not depth. Applied via `.bubbly-card`.
- **Elevated Glow** (`0 20px 50px -10px rgba(255,140,66,0.25)`): Cards on hover — lifts and intensifies the halo simultaneously.
- **Button Floor — Orange** (`0 8px 0 #cc5500`): The solid "floor" under a primary button. Collapses to `0 0 0 #cc5500` on `:active` to simulate physical depression. The drop distance is the travel distance.
- **Button Floor — Pink** (`0 8px 0 #be185d`): Same mechanic for attendee (pink) CTAs.
- **Navbar Glow** (`0 10px 30px rgba(255,140,66,0.10)`): The floating pill nav at rest. Subtler than card glow — the navbar should not compete with content.

**The Tinted Shadow Rule.** All shadows are orange-tinted (`rgba(255,140,66,...)`), never gray. Gray shadows feel borrowed from another product. Orange shadows belong to the same light source as the brand color.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover lift, button press) or structural context (the navbar's permanent floating position). Do not add shadows to decorative elements, icons, or text.

## 5. Components

### Buttons
Soft and friendly, with explicit physical weight. The press mechanic is the system's most distinctive interaction pattern.

- **Shape:** `border-radius: 9999px` (pill) across all variants — no exceptions
- **Primary (Orange):** `background: linear-gradient(135deg, #ff8c42, #ff6b35)`, white text (700), `box-shadow: 0 8px 0 #cc5500, 0 15px 20px rgba(255,107,53,0.3)`. On `:hover:not(:active)`: `translateY(-2px)`, shadow extends to `0 10px 0 #cc5500`. On `:active`: `translateY(8px)`, shadow collapses to `0 0px 0`. Transition: `0.2s cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Secondary:** White bg, `#ff8c42` text, `border: 3px solid #ff8c42`, `box-shadow: 0 6px 0 #ffc2a1`. Same press mechanics with peach floor.
- **Pink (Attendee CTA):** `background: linear-gradient(135deg, #f472b6, #ec4899)`, `box-shadow: 0 8px 0 #be185d`. Same press mechanics.
- **Padding:** `16px 36px` default; `14px 28px` at ≤640px.
- **Font:** Nunito 700, 1rem. No uppercase tracking.
- **Focus:** `outline: 3px solid rgba(255,140,66,0.5)`, `outline-offset: 3px`. Never remove focus indicator.

### Cards / Containers (Bubbly Card)
Gently rounded glass panels that float above the polka-dot background. The system's primary content container.

- **Corner Style:** `32px` radius (panels); `40px` for full-page sections. Never below 20px.
- **Background:** `rgba(255,255,255,0.85)` with `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter: blur(12px)`. Never use without the blur.
- **Border:** `2px solid rgba(255,140,66,0.15)` — almost invisible at rest; intensifies to `rgba(255,140,66,0.30)` on hover.
- **Shadow:** Ambient Glow at rest; Elevated Glow on hover.
- **Hover:** `translateY(-8px) scale(1.02)`, `transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Padding:** `40px` large panels; `24px` compact cards; `20px` step cards.

**The No-Nested-Glass Rule.** Never use glass cards inside glass cards. One frosted surface per hierarchy level. Nested glass is visual mud and a performance drain.

### Navigation
Floating pill navbar, always visible above page content.

- **Style:** `position: fixed`, `top: 16px`, inset `16px–24px` from edges, `border-radius: 9999px`, `background: rgba(255,255,255,0.90)`, `backdrop-filter: blur(24px)`, `border: 4px solid white`, Navbar Glow shadow.
- **Logo mark:** 40px orange circle (`#ff8c42`) with search icon. On hover: `scale(1.1) rotate(12deg)` spring transition.
- **Nav links:** Nunito 700, `#64748b` default. Hover: `#ff8c42` (primary/general), `#ffb8d1` (attendee links), `#ffe066` (how-it-works).
- **Nav CTA:** Inline primary button treatment (orange, pill, `box-shadow: 0 4px 0 #cc5500`).
- **Mobile menu:** Full-screen overlay, `background: rgba(255,255,255,0.95)`, `backdrop-filter: blur(32px)`, centered column, 2xl Nunito links. Animated in with anime.js `opacity + translateY`. `overflow: hidden` on `body` while open.

### Inputs / Fields
- **Style:** White bg, `border: 2px solid #e2e8f0`, `border-radius: 16px`, `padding: 12px 16px`, Nunito 500, 16px min font-size.
- **Placeholder:** `color: #94a3b8`, weight 500. Verify ≥4.5:1 contrast against white — `#94a3b8` on white is ~2.5:1, which fails. Use `#64748b` (`#64748b` on white = 4.6:1) for placeholder text instead.
- **Focus:** `border-color: #ff8c42`, `box-shadow: 0 0 0 3px rgba(255,140,66,0.15)`.
- **Mobile (≤640px):** `font-size: 16px` is mandatory to prevent iOS auto-zoom.

### Decorative Background Blobs
A signature element present on every major page. Not interactive, always behind content.

- **Count:** Three blobs per page — Peach (top-left, ~40vw), Yellow (top-right, ~35vw), Pink (bottom-center, ~45vw).
- **Style:** `border-radius: 50%`, `filter: blur(40px–60px)`, `opacity: 0.3–0.4`, `position: fixed`, `z-index: -1`.
- **Motion:** Morphing border-radius keyframes (8s cycle) + anime.js continuous float drift (random translateX/Y, 4–8s). These are decorative; `@media (prefers-reduced-motion: reduce)` should freeze them.
- **Rule:** Never use blobs as content containers or interactive elements. They are texture, not structure.

## 6. Do's and Don'ts

### Do:
- **Do** use `#ff8c42` Festival Tangerine as the singular hero color — every screen should have it somewhere.
- **Do** apply Orange to photographer/creator actions and Pink to attendee/finder actions, consistently.
- **Do** use `border-radius: 32px–40px` on all card-level surfaces — the roundness is the identity.
- **Do** use the 3D press button mechanic (`box-shadow` floor that collapses on `:active`) for all primary CTAs.
- **Do** use Nunito 800–900 for all headings. The extreme weight is intentional and deliberate.
- **Do** verify `#64748b` (Support Slate) against `#fff8f5` background before every use — the combination is borderline AA. Use `#475569` if it fails.
- **Do** add `@media (prefers-reduced-motion: reduce)` alternatives for all anime.js animations — freeze position and transition via opacity instead.
- **Do** set `font-size: 16px` minimum on all inputs (prevents iOS auto-zoom on Thai mobile).
- **Do** tint all shadows with orange (`rgba(255,140,66,...)`), never gray.
- **Do** always pair `backdrop-filter: blur(12px)` with the frosted-white card background — never one without the other.

### Don't:
- **Don't** use gradient text (`-webkit-text-fill-color: transparent` + `background-clip: text`). The `gradient-text-fun` class is deprecated. Use a solid `#ff8c42` or `#ffb8d1` span for color emphasis.
- **Don't** use blue, cool-neutral, or corporate palettes. Find Dae explicitly rejects the generic enterprise SaaS aesthetic (Stripe-clean, Linear-dark, Notion-beige).
- **Don't** use muted productivity warmth — cream backgrounds with gray body text and conservative san-serif. The warmth comes from saturated accents, not tinted surfaces.
- **Don't** use `border-left` or `border-right` accent stripes greater than 1px on cards or callouts. Use full borders, background tints, or leading icons.
- **Don't** apply positive `letter-spacing` to Thai-script text — it breaks glyph clusters.
- **Don't** use Nunito weights below 500 for any visible text.
- **Don't** use gray-tinted shadows. Every shadow in this system carries orange.
- **Don't** nest glass cards inside glass cards — one frosted layer per hierarchy level.
- **Don't** use the Celebration Yellow (`#ffe066`) for text — it fails contrast at every useful weight.
- **Don't** use identical card grids (same-sized cards with icon + heading + body, repeated 6× with no variation). Vary card density, visual weight, and content type.
- **Don't** build for the sterile AI-tool aesthetic — minimal white, cold typography, blue accents. Find Dae is warm, physical, and celebratory.
