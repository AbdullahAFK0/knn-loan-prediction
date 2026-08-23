---
name: Cybernetic Terminal
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#9bd59a'
  on-secondary: '#003910'
  secondary-container: '#1b5124'
  on-secondary-container: '#8ac38a'
  tertiary: '#fcf8f8'
  on-tertiary: '#313030'
  tertiary-container: '#dfdcdb'
  on-tertiary-container: '#626060'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#b6f1b5'
  secondary-fixed-dim: '#9bd59a'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#1b5124'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code-snippet:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system is engineered to evoke the high-stakes environment of a machine learning kernel or a black-hat terminal. It prioritizes technical efficiency, data density, and a sense of "system-level" access.

The aesthetic follows a **Neo-Brutalist Technical** approach. It avoids all decorative flourishes, opting instead for functional ornamentation: 1px borders, status indicators, and monospaced data readouts. The interface should feel like a high-performance tool where every pixel serves a diagnostic purpose. The primary emotional response is one of focus, precision, and absolute control over a complex machine.

## Colors
The palette is rooted in a "Matrix" legacy but modernized for high-contrast legibility. 

- **Primary Green (#00ff41):** Used for all interactive elements, system-critical status indicators, and thin borders. It should appear to "glow" against the dark background via subtle outer glows or high-saturation fills.
- **Background (#0a0a0a):** An absolute foundation. Avoid pure black to prevent OLED smearing, but keep it deep enough to make the primary green pop.
- **Surface (#121212):** Used for nested containers, terminal windows, and code blocks.
- **On-Surface-Variant (#888888):** Specifically for metadata, disabled states, and secondary labels to reduce visual noise in data-heavy views.

## Typography
This design system utilizes a dual-font strategy to balance technical flavor with long-form readability.

- **JetBrains Mono** is the system's "structural" font. Use it for all headings, labels, buttons, and navigation elements. It reinforces the terminal aesthetic and ensures that numbers and data align perfectly in vertical columns.
- **Inter** is the "content" font. Use it for descriptions, documentation, and long-form AI explanations. Its high x-height maintains clarity against the dark background.
- **Case Styling:** Labels and secondary navigation should use `uppercase` to mimic legacy terminal command prompts.

## Layout & Spacing
The layout follows a **Fixed-Grid Terminal** model. The screen should be perceived as a series of modular "blades" or "panes" that fit together with zero gaps or specific 1px dividers.

- **Grid:** Use a 12-column grid for desktop. 
- **Rhythm:** All spacing must be multiples of 4px. Use tight internal padding (8px or 12px) to maintain a high information density typical of developer tools.
- **Adaptation:** On mobile, panes stack vertically. The 1px borders should remain consistent, creating a "stacked card" look where the bottom border of one element is the top border of the next.

## Elevation & Depth
In this design system, depth is communicated through **illumination**, not physical distance.

- **Borders over Shadows:** Do not use soft shadows. Instead, use 1px solid borders in Primary Green or Surface-Variant to define edges.
- **Tonal Layering:** Objects closer to the user (e.g., modals) use the `#121212` surface color with a `0 0 10px rgba(0, 255, 65, 0.2)` glow to simulate light emitting from the screen.
- **Dimming:** Background content behind modals should be dimmed to `#000000` at 70% opacity, maintaining the pitch-black aesthetic.

## Shapes
The shape language is strictly **Sharp**. 

- All buttons, input fields, and containers must have a 0px border-radius. 
- Square corners emphasize the rigid, mathematical nature of the software. 
- Interactive elements may use a 45-degree "clipped corner" (chamfer) of 4px for primary actions to provide a subtle "military tech" distinction.

## Components
- **Buttons:** Primary buttons are solid Primary Green with Black text. Secondary buttons are ghost-style with a 1px Green border and Green text. Hover states should trigger a "flicker" or brightness increase.
- **System Indicator:** Every view must include a "System-Online" dot in the top right. It should use a pulsing animation (Primary Green).
- **Inputs:** Text fields are 1px-bordered boxes. The cursor should be a solid green block `_` that blinks at a 1s interval.
- **Cards/Panels:** Every panel should have a "Header" strip in JetBrains Mono, separated from the content by a 1px horizontal line.
- **Terminal Lists:** List items should be preceded by a `>` or `$` prompt symbol.
- **Data Tables:** No vertical lines. Use subtle horizontal 1px lines in `#222222`. Active rows should be highlighted with a Primary Green left-edge border (3px width).