# Aaru — Style Reference
> Deep space data console

**Theme:** dark

Aaru presents a stark, high-contrast dark interface, emphasizing precision and data with luminous accents. The design uses deep blacks and sharp whites, punctuated by a vivid violet and an energetic yellow-green. Typography is confident and compact, with subtle letter spacing adjustments. Components are minimal, often border-only or ghosted, conveying a sense of understated power.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#000000` | `--color-midnight-ink` | Page backgrounds, primary text, prominent borders for ghost elements, button text on accent backgrounds |
| Carbon | `#0a0a0a` | `--color-carbon` | Secondary surface backgrounds, input fields, subtle borders and text |
| Cloud White | `#ffffff` | `--color-cloud-white` | Primary text, prominent interactive elements and borders against dark backgrounds |
| Silver Thread | `#bababa` | `--color-silver-thread` | Muted text, decorative strokes, subtle accents |
| Dove Gray | `#9d9d9d` | `--color-dove-gray` | Navigation links, secondary body text, ghost input borders |
| Pewter | `#858484` | `--color-pewter` | Fainter body text and borders |
| Deep Violet | `#1019ec` | `--color-deep-violet` | Section backgrounds, colored text, decorative accents — creates impactful visual breaks |
| Electric Yellow | `#ebfb10` | `--color-electric-yellow` | Primary action backgrounds, header banner highlighting, energetic accents |

## Tokens — Typography

### abcOracle — Primary font for body text, navigation, buttons, and medium-sized headings. Weight 330 provides a light, precise feel, while 400 offers standard readability. · `--font-abcoracle`
- **Substitute:** system-ui
- **Weights:** 330, 400
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 34px, 50px
- **Line height:** 1.25, 1.33, 1.43, 1.50
- **Letter spacing:** -0.025em (at 50px), -0.010em (at 34px), 0.025em, 0.040em, 0.080em
- **Role:** Primary font for body text, navigation, buttons, and medium-sized headings. Weight 330 provides a light, precise feel, while 400 offers standard readability.

### gtPantheon — Used for large headings and display text. Its light weight combined with tight letter spacing creates a sophisticated, refined presence that commands attention without being heavy. · `--font-gtpantheon`
- **Substitute:** serif
- **Weights:** 330
- **Sizes:** 20px, 30px, 40px
- **Line height:** 1.20, 1.25
- **Letter spacing:** -0.050em (at 40px), -0.025em (at 30px)
- **Role:** Used for large headings and display text. Its light weight combined with tight letter spacing creates a sophisticated, refined presence that commands attention without being heavy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.08px | `--text-caption` |
| body | 14px | 1.43 | 0.025px | `--text-body` |
| heading | 34px | 1.25 | -0.01px | `--text-heading` |
| heading-lg | 40px | 1.25 | -0.05px | `--text-heading-lg` |
| display | 50px | 1.25 | -0.025px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| inputs | 0px |
| buttons | 0px |
| default | 6px |

### Layout

- **Section gap:** 24px
- **Card padding:** 30px
- **Element gap:** 8px

## Components

### Ghost Primary Button
**Role:** Primary action button, outlined in white against dark backgrounds.

Background: transparent (rgba(0, 0, 0, 0)), Text: Cloud White (#ffffff), Border: 1px solid Cloud White (#ffffff). Padding: 30px vertical, 0px horizontal. Radius: 0px. This button suggests importance through its explicit border, rather than a solid fill.

### Accent Primary Button
**Role:** High-emphasis action button with a solid yellow-green fill.

Background: Electric Yellow (#ebfb10), Text: Midnight Ink (#000000), Border: 1px solid Midnight Ink (#000000). Padding: 0px vertical, 12-14px horizontal. Radius: 0px. Used for calls to action that require immediate attention.

### Ghost Secondary Button
**Role:** Secondary action button, typically for 'Join us' type actions against a dark background.

Background: Cloud White (#ffffff), Text: Carbon (#0a0a0a), Border: 1px solid Carbon (#0a0a0a). Padding: 0px vertical, 12-14px horizontal. Radius: 0px. Provides a softer visual weight than the Ghost Primary Button.

### Navigation Link
**Role:** Standard navigation item in the header.

Text color: Cloud White (#ffffff) for active, Dove Gray (#9d9d9d) for inactive. Font: abcOracle, weight 400. Hover state: probably text color change per color usage data (not available).

### Text Input Field
**Role:** Standard input field for user data.

Background: Carbon (#0a0a0a), Text color: Cloud White (#ffffff), Placeholder text: Dove Gray (#9d9d9d, assumed color based on typical contrast with white text). Border: 1px solid transparent (with very low opacity white or light gray). Padding: 8px vertical, 12-64px horizontal. Radius: 0px.

### Header Banner
**Role:** Top notification/announcement banner.

Background: Electric Yellow (#ebfb10), Text: Midnight Ink (#000000). Padding: Implicit from content. Radius: 0px. Used for urgent or important announcements.

## Do's and Don'ts

### Do
- Prioritize Midnight Ink (#000000) for all significant backgrounds and Cloud White (#ffffff) for primary text to maintain high contrast.
- Use Electric Yellow (#ebfb10) exclusively for high-impact calls to action and critical notifications, such as filled buttons and header banners.
- Apply Deep Violet (#1019ec) to delineate distinct content sections or for impactful text emphasis that requires visual separation.
- Maintain a clear visual hierarchy by utilizing abcOracle for body text and navigation, and gtPantheon for larger, more dramatic headings.
- Employ consistent 0px border-radius for all buttons and inputs to reinforce the sharp, precise aesthetic.
- Utilize 30px vertical padding for explicit button interactions (Ghost Primary Button) and 0px radius to create a defined presence.
- Subtly adjust letter spacing in headings: -0.050em for gtPantheon at 40px and -0.025em for gtPantheon at 30px to enhance sophistication.

### Don't
- Avoid generic, rounded corners on interactive elements; all buttons and inputs should maintain a sharp, 0px radius.
- Do not introduce mid-tone grey backgrounds that soften the dark theme; stick to Midnight Ink (#000000) and Carbon (#0a0a0a) for surfaces.
- Refrain from using Electric Yellow (#ebfb10) for decorative or non-action elements; its impact is reserved for functional prominence.
- Do not add drop shadows or significant elevation effects to components; maintain a flat, precise UI aesthetic.
- Avoid large, expansive body text; keep text concise and utilize abcOracle with moderate line-heights for information density.
- Do not deviate from the established font families; abcOracle and gtPantheon are the only approved typefaces.
- Do not use generic blue for links or interactive elements; all interactive states should leverage the existing neutral or accent palette, or utilize white borders for ghost actions.

## Imagery

This site uses minimal, highly abstract imagery, focusing on generative 'point cloud' graphics that evoke data processing and complex simulations. These are typically monochromatic or subtle gradients, serving as atmospheric backdrops rather than explicit content. Icons are outlined, simple, and monochromatic, emphasizing clarity and function. The overall density of imagery is low, with visuals supporting the text-dominant presentation.

## Layout

The page primarily uses a full-bleed layout, with max-width content sections centered within the viewport. The hero section is full-bleed dark with a prominent centered headline and abstract background animation. Subsequent sections alternate between deep black (#000000) and vivid deep violet (#1019ec) backgrounds, creating strong visual rhythm and clear separation. Content is often arranged in a single column or distinct text blocks, occasionally using two-column text-and-detail arrangements. Navigation is a sticky top bar with clearly delineated links and a high-contrast action button. Vertical spacing is spacious, providing breathing room for the precise textual content.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff (Cloud White)
- background: #000000 (Midnight Ink)
- border: #ffffff (Cloud White)
- accent: #1019ec (Deep Violet)
- primary action: #ebfb10 (filled action)

Example Component Prompts:
- Create a Primary Action Button: #ebfb10 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
- Design an accent primary button: Background #ebfb10 (Electric Yellow), text #000000 (Midnight Ink), 1px solid #000000 border, 0px radius, 0px vertical padding, 14px horizontal padding, abcOracle font. 
- Build a hero section with a headline: Full-bleed Midnight Ink (#000000) background. Headline 'Rendering human granularity.' in gtPantheon, weight 330, size 50px, color #ffffff (Cloud White), letter-spacing -0.025em. 
- Create a text input field: Background #0a0a0a (Carbon), text color #ffffff (Cloud White), 8px vertical padding, 12px left padding, 0px radius, using abcOracle font.

## Similar Brands

- **Palantir** — Shares a focus on complex data, dark UI, and a serious, technical aesthetic with strong typographic hierarchy.
- **OpenAI** — Exhibits a research-heavy, cutting-edge technology vibe with a preference for clean, high-contrast layouts and minimal adornment.
- **Databricks** — Uses dark themes and focuses on data-intensive platforms, often employing sharp typography and strategic color accents for emphasis.
- **DeepMind** — Leverages dark interfaces and precise typography to convey scientific rigor and advanced AI research.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #000000;
  --color-carbon: #0a0a0a;
  --color-cloud-white: #ffffff;
  --color-silver-thread: #bababa;
  --color-dove-gray: #9d9d9d;
  --color-pewter: #858484;
  --color-deep-violet: #1019ec;
  --color-electric-yellow: #ebfb10;

  /* Typography — Font Families */
  --font-abcoracle: 'abcOracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtpantheon: 'gtPantheon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.08px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.025px;
  --text-heading: 34px;
  --leading-heading: 1.25;
  --tracking-heading: -0.01px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.05px;
  --text-display: 50px;
  --leading-display: 1.25;
  --tracking-display: -0.025px;

  /* Typography — Weights */
  --font-weight-w330: 330;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --section-gap: 24px;
  --card-padding: 30px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;

  /* Named Radii */
  --radius-inputs: 0px;
  --radius-buttons: 0px;
  --radius-default: 6px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #000000;
  --color-carbon: #0a0a0a;
  --color-cloud-white: #ffffff;
  --color-silver-thread: #bababa;
  --color-dove-gray: #9d9d9d;
  --color-pewter: #858484;
  --color-deep-violet: #1019ec;
  --color-electric-yellow: #ebfb10;

  /* Typography */
  --font-abcoracle: 'abcOracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtpantheon: 'gtPantheon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.08px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: 0.025px;
  --text-heading: 34px;
  --leading-heading: 1.25;
  --tracking-heading: -0.01px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -0.05px;
  --text-display: 50px;
  --leading-display: 1.25;
  --tracking-display: -0.025px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
}
```
