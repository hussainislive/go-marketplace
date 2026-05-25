---
name: Premium Lifestyle
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#edeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#56414a'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#8a707b'
  outline-variant: '#ddbfca'
  surface-tint: '#b1137a'
  primary: '#a70172'
  on-primary: '#ffffff'
  primary-container: '#c82c8c'
  on-primary-container: '#fff0f4'
  inverse-primary: '#ffafd4'
  secondary: '#972ca9'
  on-secondary: '#ffffff'
  secondary-container: '#ef7ffe'
  on-secondary-container: '#6f0082'
  tertiary: '#575757'
  on-tertiary: '#ffffff'
  tertiary-container: '#706f6f'
  on-tertiary-container: '#f6f3f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd8e8'
  primary-fixed-dim: '#ffafd4'
  on-primary-fixed: '#3d0027'
  on-primary-fixed-variant: '#8a005d'
  secondary-fixed: '#ffd6fe'
  secondary-fixed-dim: '#f9abff'
  on-secondary-fixed: '#35003f'
  on-secondary-fixed-variant: '#7b028f'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  hero-title:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  hero-title-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  section-title:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  container-max: 1200px
---

## Brand & Style
The design system is centered on a "Premium Minimalist" aesthetic, blending the high-end editorial feel of luxury brands with the functional precision of modern software. The target audience values exclusivity, clarity, and ease of use. The UI should evoke a sense of calm sophistication through generous whitespace, deliberate information density, and a refined "Linear-level" attention to detail.

The style leverages **Minimalism** with a focus on high-quality typography and subtle **Tonal Layers**. It draws inspiration from modern lifestyle platforms, utilizing a strict grid and soft, intentional shadows to create a sense of depth and tangible quality without clutter.

## Colors
This design system utilizes a high-contrast palette where vibrant primary tones are set against expansive, clean surfaces. The primary brand identity is expressed through a rich pink-to-purple gradient, used sparingly for calls to action and key brand moments.

The interface primarily lives on a pure white surface (`#FFFFFF`), using a soft gray (`#FAFAFC`) to define container areas or background sections. Typography is grounded in a deep charcoal (`#232323`) to maintain high readability while appearing softer than pure black. Borders and dividers are kept extremely light to maintain the minimalist "boundary-less" feel.

## Typography
The system relies exclusively on **Inter** to achieve a systematic, utilitarian, yet modern look. The typographic hierarchy is dramatic, using a large Hero Title to anchor marketing and landing pages. 

- **Tight Tracking:** Headlines should use slight negative letter spacing (-0.01em to -0.02em) to maintain a cohesive, "tight" look.
- **Line Height:** Body text uses a generous 1.6x line height to ensure maximum readability against the high-whitespace layout.
- **Weight Usage:** Reserve Bold (700) for hero sections and Semibold (600) for UI headers. Standard body text must always be Regular (400).

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop, centered on the screen with a maximum width of 1200px. This ensures content remains legible and prevents line lengths from becoming too long on ultra-wide monitors.

- **Desktop (1440px+):** 12-column grid, 24px gutters, 80px side margins.
- **Tablet (768px - 1024px):** 8-column grid, 20px gutters, 40px side margins.
- **Mobile (Under 768px):** 4-column grid, 16px gutters, 20px side margins.

Vertical rhythm is maintained using a 4px baseline. Components should generally use 16px, 24px, or 32px of internal padding to maintain the "airy" feel.

## Elevation & Depth
Depth is communicated through **Ambient Shadows** rather than traditional layers. The interface should feel flat but "lifted" off the page.

- **Default State:** Elements like cards use a very soft, diffused shadow: `0 2px 12px rgba(0,0,0,0.06)`. This creates a subtle distinction from the background without harsh edges.
- **Hover/Active State:** Upon interaction, elements should appear to lift further: `0 8px 32px rgba(0,0,0,0.12)`.
- **Flat Borders:** For non-interactive containers, use a 1px solid border of `#ECECF1` without shadows to keep the UI grounded and clean.

## Shapes
The shape language is "Soft-Modern," utilizing varied corner radii to distinguish between different component scales. Large containers like cards use a generous 20px radius to feel friendly and approachable (Airbnb-style). Interactive elements like buttons and inputs use slightly tighter radii (14px and 16px respectively) to feel more precise and "clickable." 

Avoid sharp 0px corners entirely; even the smallest UI elements should have at least a 4px radius.

## Components
- **Buttons:** Primary buttons use the `primary-main` gradient with white text. They feature a 14px corner radius and a subtle lift on hover. Secondary buttons use a white background with a 1px `#ECECF1` border and charcoal text.
- **Cards:** Influenced by premium hospitality apps, cards use the 20px radius, a white surface, and the default ambient shadow. Content within cards should have 24px of padding.
- **Input Fields:** Inputs feature a 16px radius, a `#FAFAFC` background, and a 1px `#ECECF1` border. On focus, the border transitions to the primary pink or purple.
- **Chips:** Small, pill-shaped tags used for categorization. These should use the `label-bold` typography and a light grey background with no shadow.
- **Lists:** Clean, borderless list items separated by the `#F0F0F5` divider. High horizontal padding (16px) to ensure items don't feel cramped.
- **Checkboxes/Radios:** Circular or soft-square shapes using the primary gradient for the "checked" state, maintaining the premium aesthetic.