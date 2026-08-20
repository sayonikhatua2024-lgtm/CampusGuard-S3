---
name: CampusGuard Command Center
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#12151c'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#c0c7d3'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8a919d'
  outline-variant: '#404751'
  surface-tint: '#a1c9ff'
  primary: '#a1c9ff'
  on-primary: '#00325a'
  primary-container: '#5aa9ff'
  on-primary-container: '#003d6c'
  inverse-primary: '#0060a7'
  secondary: '#42e09a'
  on-secondary: '#003822'
  secondary-container: '#00c07e'
  on-secondary-container: '#00472c'
  tertiary: '#f9bc45'
  on-tertiary: '#422d00'
  tertiary-container: '#d49c25'
  on-tertiary-container: '#503700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a1c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#004880'
  secondary-fixed: '#65fdb5'
  secondary-fixed-dim: '#42e09a'
  on-secondary-fixed: '#002112'
  on-secondary-fixed-variant: '#005233'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#f9bc45'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
  surface-elevated: '#0d0f14'
  border-hairline: '#232833'
  signal-crit: '#ff5c5c'
  text-primary: '#ffffff'
  text-secondary: '#4a5262'
  text-muted: '#333a48'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  code-stat:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.02em
  code-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  badge-mono:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 24px
  panel-gap: 12px
  container-padding: 20px
---

## Brand & Style
The design system for this institutional continuity command center is built on a **Mission-Critical / Corporate Modern** aesthetic, specifically tailored for high-stakes operational environments. It prioritizes technical credibility, absolute reliability, and rapid information synthesis over decorative flair.

The interface simulates a high-density "Command Center" atmosphere. It utilizes an obsidian-dark canvas to reduce eye strain during 24/7 monitoring and to ensure maximum contrast for projector-based presentations. The visual narrative is one of **deterministic precision**—every pixel serves the goal of explaining system failures, assessing institutional risks, and governing AI-driven recovery actions.

**Design Principles:**
- **Authoritative Minimalis:** Large, clear typography for critical states; high-density mono-spaced data for telemetry.
- **Strategic Restraint:** Color is used exclusively for semantic signaling (Status, Information, or Action) rather than decoration.
- **Process Provenance:** Visual cues emphasize the "Why" and "How" behind AI recommendations to build human trust.
- **Architectural Depth:** Layering is achieved through tonal shifts and hairline borders rather than heavy shadows, maintaining a flat, professional technical look.

## Colors
The palette is rooted in a "Deep Obsidian" foundation to support high-readability and professional technical aesthetics.

- **Primary (Electric Cyan):** Reserved for information, analysis, system-level feedback, and interactive elements like sliders or active tabs.
- **Secondary (Emerald Mint):** Indicates "Safe," "Verified," "Success," or "Nominal" health states.
- **Tertiary (Amber Gold):** Signals "At Risk," "Warning," or "Degraded" telemetry.
- **Signal Crimson:** Used exclusively for "Violated," "Blocked," or "Critical" failure states.
- **Neutrals:** A tiered system of near-blacks (`#08090c` to `#171b24`) provides structural depth. Borders use a crisp slate (`#232833`) to define hitboxes without visual clutter.

**Usage Note:** Avoid gradients. Use solid fills or low-opacity tints (10-15%) of the signal colors for container backgrounds to indicate status-tinted zones.

## Typography
The typography system pairs **Inter** for UI controls and narrative explanations with **JetBrains Mono** for all technical telemetry, metrics, and system data.

- **Headlines:** Use Inter with tight tracking and heavy weights for immediate recognition on 1920x1080 displays.
- **Metrics:** `code-stat` is the workhorse for infrastructure health percentages. It must always be legible from a distance.
- **Labels:** Small caps with increased letter-spacing are used for section headers (e.g., "INFRASTRUCTURE STRIP") to create clear visual anchors.
- **Data Tables:** Use `code-data` to ensure columns of numbers align perfectly for easy vertical scanning.

## Layout & Spacing
The layout uses a **Fixed Grid** philosophy optimized for 1920x1080 and 1440x900 displays, ensuring information density remains high without feeling chaotic.

**Grid Architecture:**
- **Desktop:** A 12-column grid with a 24px outer margin and 16px gutters.
- **Command Center View:** Typically utilizes a 3-column asymmetric split (Side Rail 280px | Center Stage 1fr | Right Feed 320px).
- **Density:** Spacing between related telemetry cards is tight (12px) to maximize the volume of data visible on a single screen.

**Reflow Rules:**
On smaller desktop viewports (1366px), the side rails collapse into icon-only bars or move to an accordion-style drawer to keep the "Center Stage" (Impact Analysis/Tournament) primary.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows.

- **Level 0 (Base):** The primary background (`#08090c`).
- **Level 1 (Card/Panel):** Slightly lighter surface (`#0d0f14`) with a 1px hairline border (`#232833`).
- **Level 2 (Active/Popup):** Elevated containers (`#12151c`) used for modals or active selection states.
- **Accent Depth:** Subtle backdrop blurs (8px to 12px) are used on navigation bars and floating safety gates to provide a modern, "glass" command-center feel without compromising performance or readability.
- **Borders:** All interactive elements must have a defined border to stand out against the deep background. Inactive elements use subtle slate, while focused elements use primary cyan.

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. This provides a professional, modern feel that avoids the "industrial/brutalist" sharpness of 0px corners, while remaining significantly more serious than "bubbly" consumer SaaS apps.

- **Base Components (Inputs, Small Buttons):** 4px (`rounded-sm`).
- **Cards & Primary Modules:** 8px (`rounded-lg`).
- **Large Layout Containers:** 12px (`rounded-xl`).
- **Status Badges:** Pill-shaped for instant differentiation from square-ish data cells.

## Components
Consistent styling of these key elements ensures a cohesive mission-critical experience.

- **Buttons:** 
  - *Primary (Critical Action):* Solid Emerald or Cyan, Mono-spaced caps text.
  - *Secondary:* Outline only, hairline border, subtle hover fill.
  - *Destructive/Fault:* Crimson outline with 10% crimson background fill.
- **Infrastructure Cards:** Compact boxes containing a Mono stat (large), a trend sparkline (small), and a status label (label-caps).
- **Incident Dependency Chains:** Vertical or horizontal nodes connected by 1px slate lines. Impacted nodes pulse with a subtle crimson border.
- **Recovery Tournament Cards:** Comparison cards that highlight the "ICO Recommended" plan with a secondary color border and a "Winning" badge.
- **Safety Gate Console:** A high-contrast modal or section with a large, deliberate "AUTHORIZE" button that requires a justification input, emphasizing human accountability.
- **SLA Verification Tables:** Dense, striped rows using `code-data`. Success states are marked with emerald checkmarks; violations with crimson icons.