# Wrike — Style Reference
> Organized Digital Workspace — like well-lit, interactive blueprints on a high-resolution display.

**Theme:** light

This system projects an image of digital precision and intelligent organization. It uses a restrained palette of muted blues and grays, punctuated by a vibrant, almost neon, green used sparingly for active elements. The overall impression is one of approachable authority, where clarity and structured information presentation are prioritized. Slightly rounded corners on cards and buttons soften the otherwise crisp, modern aesthetic of system-like interfaces.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Graphite | `#162136` | `--color-midnight-graphite` | Primary text, prominent headings, button text on light backgrounds, dark footer background elements. The core dark neutral. |
| Cloud White | `#ffffff` | `--color-cloud-white` | Page background, card backgrounds, text on dark interactive elements. Provides clean, open space. |
| Subtle Gray | `#f2f5fa` | `--color-subtle-gray` | Secondary background for sections and cards, button backgrounds. Adds visual texture without strong contrast. |
| Slate Indigo | `#2b3a57` | `--color-slate-indigo` | Secondary text, descriptive body copy, card headings. A slightly warmer, muted dark for informational density. |
| System Blue | `#0073d3` | `--color-system-blue` | Interactive elements like links, selected states, and icon accents. A clear, cool blue for actionable items. |
| Wrike Green | `#00e05c` | `--color-wrike-green` | Primary Call-to-Action buttons, active indicators, brand highlights. This vivid green is the primary brand accent, conveying energy and action. |
| Ash Gray | `#657694` | `--color-ash-gray` | Tertiary text, subtle borders, inactive elements. Soft, cool gray for less hierarchical information. |
| Light Cloud | `#c1c9d8` | `--color-light-cloud` | Divider lines, subtle shadows, UI elements borders. A very light, cool gray for structural definition. |
| Deep Space Gradient | `linear-gradient(to left, rgb(0, 153, 128), rgb(0, 178, 89), rgb(0, 224, 92), rgb(0, 178, 89), rgb(0, 153, 128))` | `--color-deep-space-gradient` | Prominent brand elements, hero sections (bottom section). This multi-stage green gradient is a critical brand visual, hinting at depth and dynamism. |

## Tokens — Typography

### TT Norms Pro — Primary typeface for all UI elements, headings, body text, and interactive components. The variable weights and specific OpenType features allow for precise typographic control and a consistent brand voice across all sizes. · `--font-tt-norms-pro`
- **Substitute:** Inter
- **Weights:** 400, 600, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px, 48px, 64px
- **Line height:** 1.10, 1.20, 1.25, 1.30, 1.38, 1.40, 1.50, 1.60, 2.00
- **Letter spacing:** -0.48px at 48px, -0.64px at 64px, etc.
- **OpenType features:** `"ss01" on, "ss02" on, "ss03" on, "ss04" on, "ss06" on, "tnum" on`
- **Role:** Primary typeface for all UI elements, headings, body text, and interactive components. The variable weights and specific OpenType features allow for precise typographic control and a consistent brand voice across all sizes.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.4 | — | `--text-body-lg` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 32px | 1.2 | — | `--text-heading-lg` |
| display-sm | 48px | 1.1 | -0.48px | `--text-display-sm` |
| display | 64px | 1.1 | -0.64px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| input | 0px |
| buttons | 12px |
| largeButton | 40px |
| smallButton | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(24, 31, 56, 0.25) 0px 25px 45px -45px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1220px
- **Section gap:** 64px
- **Element gap:** 4px

## Components

### Secondary Ghost Button
**Role:** Subordinate action

Transparent background with 'Midnight Graphite' text, '#162136', and a thin 'Midnight Graphite' border. Rounded corners at 4px. Padding 3px vertical, 10px horizontal.

### Pill Ghost Button
**Role:** Navigation or tertiary action

Transparent background with black text, '#000000', and a thin black border. Pill shape with 24px radius. No specific vertical padding, 0px horizontal.

### Nav Button
**Role:** Navigation links

'Subtle Gray' background, '#f2f5fa', with browser default link blue text '#0000ee'. Pill shape with 40px radius. No specific vertical padding, 32px horizontal. This likely represents an active state or a login button.

### Input Field
**Role:** User data entry

'Cloud White' background, '#ffffff', with 'Midnight Graphite' text, '#162136'. Input has a 'Midnight Graphite' border and 0px radius. Padding 22px top, 2px bottom, 20px left.

### Dark Section Input Field
**Role:** Input field on dark backgrounds

Transparent background, 'Cloud White' text, '#ffffff', and a 'Midnight Graphite' border, '#162136'. 0px radius. Padding 22px top, 2px bottom, 20px left. Placeholder text seems to be 'Slate Indigo' #2b3a57.

## Do's and Don'ts

### Do
- Use TT Norms Pro for all text, applying specific weights (400, 600, 700) from the typography scale according to role.
- Prioritize 'Wrike Green' (#00e05c) for all primary calls-to-action to maximize brand recognition and user engagement.
- Apply 20px border radius for all content cards to maintain a soft yet structured appearance.
- Maintain a clear visual hierarchy by limiting shadows to '#162136' text and navigation elements, using `rgba(24, 31, 56, 0.25) 0px 25px 45px -45px`.
- Utilize 'Subtle Gray' (#f2f5fa) for secondary backgrounds and minor interactive elements, creating light contrast without harshness.
- Incorporate the 'Deep Space Gradient' where significant brand emphasis is required, such as hero sections or key promotional areas.
- Ensure input fields have a solid 'Midnight Graphite' border (#162136) to clearly delineate interactive areas.

### Don't
- Do not introduce additional bold or semibold weights beyond TT Norms Pro 600 or 700 within body text contexts.
- Avoid using bright, high-saturation colors other than 'Wrike Green' (#00e05c) for interactive elements to prevent visual clutter.
- Do not apply `box-shadow` effects to standard content cards; their elevation is managed by background color distinction.
- Refrain from using sharp, 0px radius corners on buttons; maintain a minimum of 4px radius for all interactive buttons.
- Do not use dark text colors on dark backgrounds without sufficient contrast; ensure a ratio of at least 16:1 for accessibility, generally 'Cloud White' (#ffffff) on 'Midnight Graphite' (#162136).

## Imagery

This site features a mixture of abstract product graphics and tightly cropped, clean product screenshots with UI overlays. The graphics often integrate the brand's vibrant green, using geometric shapes and subtle gradients to imply data flow and connectivity. Photography, when present, consists of professional, staged and slightly desaturated shots of individuals utilizing computers in a work context, often with blurred backgrounds, serving to humanize the technical aspect. Icons are primarily outlined, monochrome using 'Midnight Graphite' or 'System Blue', with a consistent stroke weight. The overall role of imagery is to explain and reinforce the product's capabilities in a highly organized and polished manner, balancing visual interest with informational clarity.

## Layout

The page maintains a centered max-width of 1220px for primary content, set against a full-width background. The hero section is a split layout: prominent headline on the left and a detailed product UI illustration composed of layered elements on the right. Section rhythms are defined by alternating background colors (Cloud White and Subtle Gray) and are separated by a consistent '64px' section gap. Content is often arranged in symmetrical two-column layouts featuring text and imagery/cards. A three-column card grid is used for displaying features. The footer utilizes a dark background with white text and features a more complex grid for links. The header is a sticky top bar containing the brand logo, navigation, and primary CTAs.

## Agent Prompt Guide

Quick Color Reference:
- Text (primary): #162136
- Background (page): #ffffff
- CTA (Wrike Green): #00e05c
- Border (input): #162136
- Accent (System Blue): #0073d3

Example Component Prompts:
- Create a primary call-to-action button: background #00e05c, text #162136, TT Norms Pro weight 700 size 16px, border-radius 12px, padding 14px 22px.
- Render a feature card: background #f2f5fa, border-radius 20px, with a heading at TT Norms Pro weight 600 size 24px #162136, and body text at TT Norms Pro weight 400 size 16px #2b3a57.
- Design an input field: background #ffffff, border 1px solid #162136, text color #162136, padding 22px 20px 2px 20px, TT Norms Pro weight 400 size 16px.
- Generate a secondary ghost button: background transparent, text #162136, border 1px solid #162136, TT Norms Pro weight 600 size 13px, border-radius 4px, padding 3px 10px.

## Similar Brands

- **Asana** — Uses a clean, light interface with prominent, distinct brand colors for interactive elements and a similar structured grid layout for feature presentation.
- **Monday.com** — Employs vibrant, high-contrast brand colors against a clean, mostly white background, with similar slightly rounded corners on UI elements.
- **ClickUp** — Features a light theme with clear information hierarchy, strong accent colors for CTAs, and distinct card-based layouts for showcasing features.
- **Jira** — Utilizes a functional, system-like interface with a strong emphasis on information organization and a similar muted color palette with a prominent blue for interactive states.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-graphite: #162136;
  --color-cloud-white: #ffffff;
  --color-subtle-gray: #f2f5fa;
  --color-slate-indigo: #2b3a57;
  --color-system-blue: #0073d3;
  --color-wrike-green: #00e05c;
  --color-ash-gray: #657694;
  --color-light-cloud: #c1c9d8;
  --color-deep-space-gradient: #00b259;
  --gradient-deep-space-gradient: linear-gradient(to left, rgb(0, 153, 128), rgb(0, 178, 89), rgb(0, 224, 92), rgb(0, 178, 89), rgb(0, 153, 128));

  /* Typography — Font Families */
  --font-tt-norms-pro: 'TT Norms Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --text-display-sm: 48px;
  --leading-display-sm: 1.1;
  --tracking-display-sm: -0.48px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -0.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1220px;
  --section-gap: 64px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-input: 0px;
  --radius-buttons: 12px;
  --radius-largebutton: 40px;
  --radius-smallbutton: 4px;

  /* Shadows */
  --shadow-xl: rgba(24, 31, 56, 0.25) 0px 25px 45px -45px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-graphite: #162136;
  --color-cloud-white: #ffffff;
  --color-subtle-gray: #f2f5fa;
  --color-slate-indigo: #2b3a57;
  --color-system-blue: #0073d3;
  --color-wrike-green: #00e05c;
  --color-ash-gray: #657694;
  --color-light-cloud: #c1c9d8;
  --color-deep-space-gradient: #00b259;

  /* Typography */
  --font-tt-norms-pro: 'TT Norms Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --text-display-sm: 48px;
  --leading-display-sm: 1.1;
  --tracking-display-sm: -0.48px;
  --text-display: 64px;
  --leading-display: 1.1;
  --tracking-display: -0.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Shadows */
  --shadow-xl: rgba(24, 31, 56, 0.25) 0px 25px 45px -45px;
}
```
