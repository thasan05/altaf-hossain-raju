---
name: Altaf Hossain Raju Portfolio
description: Executive digital authority platform blending multinational boardroom rigor with grassroots youth empowerment
colors:
  primary: "#D4AF37"
  primary-deep: "#AA822A"
  primary-light: "#F5E6CA"
  secondary: "#14B8A6"
  neutral-bg: "#060A12"
  neutral-surface: "#0F172A"
  neutral-card: "#111827"
  text-primary: "#E2E8F0"
  text-muted: "#94A3B8"
  border-subtle: "#1E293B"
typography:
  display:
    fontFamily: "var(--font-serif), 'Newsreader', Georgia, serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-xl:
    fontFamily: "var(--font-serif), 'Newsreader', Georgia, serif"
    fontSize: "4.25rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-serif), 'Newsreader', Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-sans), 'Manrope', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "var(--font-sans), 'Manrope', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "var(--font-sans), 'Manrope', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
  caption:
    fontFamily: "var(--font-sans), 'Manrope', monospace, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
  micro:
    fontFamily: "var(--font-sans), 'Manrope', system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  card-luxury:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Altaf Hossain Raju Portfolio

## Overview

**Creative North Star: "The Executive Pavilion"**

The visual language reflects the architectural poise of a prestigious executive pavilion—an elevated environment designed for high-stakes decision-makers, boardroom peers, and corporate recruiters. It balances commanding corporate gravitas with genuine human warmth and service leadership. The deep obsidian atmosphere creates focused cinematic contrast, while refined metallic gold and champagne accents highlight verified milestones and operational credentials.

Rather than generic tech minimalism or stark corporate austerity, the interface embraces an editorial luxury ethos. High-contrast typography pairs classical serif headlines with hyper-readable modern sans-serif body copy, supported by authentic, unembellished event and portrait photography. Surfaces are rich, multi-layered, and atmospheric, evoking the quiet confidence of an established multinational sales leader and community founder.

**Key Characteristics:**
- **Cinematic Obsidian Atmosphere:** Deep midnight blue-black canvas (`#060A12`) provides infinite depth and zero eye strain.
- **Selective Auric Warmth:** Metallic gold (`#D4AF37`) is deployed with surgical discipline for active states, key credentials, and primary conversion paths.
- **Bespoke Editorial Serif Pairing:** Classical `Playfair Display` headlines project institutional stature, while `Plus Jakarta Sans` ensures effortless legibility on high-density data.
- **Frosted Glass Precision:** Tactile glassmorphism cards with fine 1px slate borders, subtle backdrop blur, and directional auric hover glows.
- **Authentic Documentary Photography:** Real-world auditorium keynotes, campus summits, and official portraits ground every claim in verifiable truth.

## Colors

The palette establishes an authoritative executive tone through an obsidian night canvas punctuated by noble auric golds and subtle growth teals.

### Primary
- **Auric Gold** (`#D4AF37`): The signature prestige accent. Used exclusively for primary call-to-action buttons, headline gradient highlights, active navigation indicators, and verified credential badges.
- **Deep Amber Bronze** (`#AA822A`): Deep companion shade for button hover states, active pressed states, and low-light gradient endpoints.
- **Pale Champagne** (`#F5E6CA`): Light highlight tone for subtle text gradients, refined borders, and decorative pill rings.

### Secondary
- **Teal Emergence** (`#14B8A6`): Symbolizes organic growth, youth empowerment, and community energy. Deployed sparingly in secondary metric badges, community highlights (LCB), and dual-tone gradient borders.

### Neutral
- **Obsidian Midnight** (`#060A12`): The foundational background canvas. A rich, deep navy-black that eliminates harsh pure-black contrast while maintaining infinite depth.
- **Slate Surface** (`#0F172A`): Intermediate elevation for floating navigation shells, toolbars, and nested containers.
- **Obsidian Glass Card** (`#111827` / `rgba(17, 24, 39, 0.8)`): Primary container background with backdrop blur (`blur(12px)`) for all modular content cards.
- **Slate Light** (`#E2E8F0`): Primary body typography color providing high-contrast readability without fluorescent glare.
- **Muted Slate** (`#94A3B8`): Secondary descriptive text, metadata dates, verification notes, and inactive tabs.
- **Subtle Slate Border** (`#1E293B` / `rgba(255, 255, 255, 0.07)`): Crisp 1px structural framing across cards, dividers, and input borders.

### Named Rules
**The Rarity of Gold Rule.** Auric Gold (`#D4AF37`) must occupy less than 10% of any viewport. Its power derives strictly from rarity and focus; overusing gold diminishes executive gravitas into decorative noise.

**The Pure Obsidian Rule.** The page background must never use flat `#000000`. The subtle navy undertone of Obsidian Midnight (`#060A12`) is essential to preserve rich chromatic resonance beneath glass surfaces.

## Typography

**Display Font:** Playfair Display (fallback: Georgia, Cambria, serif)  
**Body Font:** Plus Jakarta Sans (fallback: system-ui, -apple-system, sans-serif)  
**Label/Mono Font:** Monospace (system monospace, for metadata, badges, and counters)

**Character:** The typography bridges the timeless authority of classical corporate leadership with the contemporary clarity of global tech and venture platforms.

### Hierarchy
- **Display** (Bold 700, 3.75rem / 60px on desktop, line-height: 1.1, tracking: -0.02em): Used exclusively for the Hero Section headline and major brand statements.
- **Headline** (Bold 700, 2.25rem / 36px on desktop, line-height: 1.2, tracking: -0.01em): Section titles (e.g., "Verified Impact", "Career Trajectory", "Executive Ventures").
- **Title** (Semi-bold 600, 1.25rem / 20px, line-height: 1.4): Role titles, venture headings, speaking topic names, and modal headers.
- **Body** (Regular 400 & Light 300, 1rem / 16px, line-height: 1.6, max line length: 65ch): Executive bio narrative, project descriptions, and responsibilities.
- **Label** (Semi-bold 600, 0.75rem / 12px, tracking: 0.05em, uppercase): Category badges, metric labels, PMP® credential pills, and date ranges.

### Named Rules
**The Editorial Serif Rule.** Serif typography (`Playfair Display`) is reserved strictly for headings (`h1`, `h2`, `h3`, and prominent quotes). Never render body paragraphs, form labels, or UI buttons in serif.

**The Label Case Rule.** All category tags, system tags, and micro-badges must be rendered in uppercase monospace or sans-serif with expanded letter spacing (`tracking-wider`).

## Layout

The spatial model organizes complex multi-sector accomplishments into a calm, scannable editorial layout.

- **Primary Container:** Centered layout with max-width `80rem` (`1280px` / `max-w-7xl`), flanked by responsive gutter padding (`1rem` / `16px` on mobile, `1.5rem` / `24px` on tablet, `2rem` / `32px` on desktop).
- **Grid Architecture:** 12-column asymmetric desktop grid (e.g., 7-column narrative / 5-column media card in Hero; 5-column contact dossier / 7-column message form). Stacks into a clean single column on screens `< 1024px`.
- **Vertical Spacing Rhythm:** Generous section breathing room (`6rem` to `8rem` / `96px` to `128px` between major sections on desktop; `3rem` to `4rem` on mobile).
- **Density Discipline:** Card internals use a strict `1.5rem` (`24px`) padding scale to preserve whitespace around dense bulleted achievements and metrics.

## Elevation & Depth

Depth is established through translucent tonal layering and subtle luminous edge reflections rather than heavy opaque drop shadows.

Surfaces rest on the deep `#060A12` base. Glass cards (`luxury-card`) float above it with `rgba(17, 24, 39, 0.8)` background fill, `12px` backdrop blur, and a delicate `1px` translucent white border (`rgba(255, 255, 255, 0.07)`).

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5)`): Resting elevation for glass cards, delivering soft ambient separation without visual weight.
- **Card Auric Hover** (`box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px -5px rgba(212, 175, 55, 0.15)`): Interactive hover state that slightly lifts the card (`translateY(-2px)`) while casting a subtle auric halo.
- **Button Glow** (`box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.25)`): Adds radiant energy to the primary gold call-to-action button.

### Named Rules
**The Ambient Restraint Rule.** Glowing borders and colored shadow halos are strictly interactive responses (hover, active focus). Elements at rest remain grounded in subtle slate borders.

## Shapes

- **Pill Geometry (`rounded-full` / `9999px`):** Reserved for interactive CTAs, quick filters, navigation capsules, and prominent role badges (e.g., PMP® badge).
- **Curved Cards (`rounded-2xl` / `16px` on mobile, `rounded-3xl` / `24px` on desktop):** Content cards, modals, and preview media containers feature smooth, generous curvature that softens high-density data.
- **Form Controls (`rounded-xl` / `12px`):** Input fields, text areas, and option selectors utilize crisp, tactile medium radii.
- **1px Border Framing:** All cards and interactive boundaries carry an explicit 1px stroke to preserve clean definition against the deep dark canvas.

## Components

### Buttons
- **Shape:** Pill curvature (`rounded-full` / `9999px`) on desktop; rounded rectangular (`rounded-xl` / `12px`) for stacked mobile buttons.
- **Primary:** Metallic gradient fill (`from-amber-300 via-amber-400 to-amber-500`), bold obsidian text (`#060A12`), uppercase tracking (`tracking-wider`), and soft gold shadow (`0 10px 20px -5px rgba(212, 175, 55, 0.3)`).
- **Secondary:** Deep slate glass fill (`rgba(15, 23, 42, 0.9)`), crisp 1px border (`#334155`), slate text (`#E2E8F0`). On hover: border shifts to `rgba(212, 175, 55, 0.5)` with white text.
- **Ghost / Link:** Plain text with hover auric color shift and directional arrow motion (`group-hover:translate-x-0.5`).

### Chips & Badges
- **Style:** Compact pill (`rounded-full`) or micro-tag (`rounded-md`).
- **Variants:**
  - *PMP® Credential:* Amber tint background (`rgba(212, 175, 55, 0.15)`), amber text (`#FCD34D`), 1px gold border.
  - *Category Filter:* Inactive in subtle slate (`#1E293B`); active in gold border glow with amber text.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (`16px`) to `rounded-3xl` (`24px`).
- **Background:** Multi-stop slate gradient with backdrop blur (`blur(12px)`).
- **Border:** 1px `rgba(255, 255, 255, 0.07)` at rest; shifts to `rgba(212, 175, 55, 0.3)` on hover.
- **Internal Padding:** `1.5rem` (`24px`) to `2.5rem` (`40px`).

### Inputs / Fields
- **Style:** Deep slate container (`rgba(15, 23, 42, 0.9)`), 1px border (`#1E293B`), text-base (`16px`) on mobile to eliminate iOS Safari auto-zoom, and muted placeholder text (`#64748B`).
- **Focus:** 1px border shift to Auric Gold (`#D4AF37`) with zero default browser outline.

### Navigation
- **Desktop:** Floating pill capsule (`bg-[#0F172A]/70` with `backdrop-blur-sm` and `border-slate-800`). Active section marked with subtle amber background highlight and pill border.
- **Mobile:** Fixed bottom action bar for primary reachability plus full-screen slide-down modal drawer for comprehensive section jumping.

## Do's and Don'ts

### Do:
- **Do** maintain the 10% maximum coverage rule for Auric Gold (`#D4AF37`).
- **Do** use `Newsreader` exclusively for headers and prominent pull quotes.
- **Do** ensure all form inputs on mobile use `text-base` (`16px`) to prevent browser auto-zooming.
- **Do** accompany every card with a crisp 1px border to separate it from the obsidian background.
- **Do** preserve authentic documentary event photography, portraits, and supervisor contact references.

### Don't:
- **Don't** use pure black (`#000000`) for the canvas; always use Obsidian Midnight (`#060A12`).
- **Don't** use generic stock photos, AI-generated human faces, or fabricated client testimonials.
- **Don't** mix non-canonical fonts; keep typography strictly within `Newsreader`, `Manrope`, and monospace.
- **Don't** apply heavy drop shadows to elements at rest; reserve dramatic glows for hover and active focus states.
- **Don't** use neon or saturated rainbow badges; keep secondary accents constrained to Teal Emergence (`#14B8A6`) and Slate neutrals.
