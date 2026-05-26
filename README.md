# Vanish Gallery

A small, mobile-responsive Next.js demo that uses **HeroUI v3 (beta)** and **Tailwind CSS v4**. Each card in the gallery has a button — tap it more than the threshold (10 times by default) and the image will fade out, clear itself, and reveal a hidden quote in its place.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** (PostCSS plugin)
- **HeroUI v3 beta** (`@heroui/react` + `@heroui/styles`)
- **@gravity-ui/icons** for icons

## Getting started

```bash
# 1. install
npm install

# 2. run dev server
npm run dev

# 3. build for production
npm run build
npm start
```

Then open <http://localhost:3000>.

## How the "vanish" works

- Every `ImageCard` keeps a local click counter.
- The image's opacity / saturation decay as you approach the threshold.
- Once `clicks >= VANISH_THRESHOLD` (10), the `<img>` is unmounted entirely and replaced with a gradient panel that shows a context quote.
- A "Bring it back" button resets the counter so you can play again.

Tune the threshold or images in `lib/images.ts`:

```ts
export const VANISH_THRESHOLD = 10;
```

## Project layout

```
app/
  layout.tsx        # root layout + globals
  page.tsx          # gallery home page
  globals.css       # tailwind + heroui style imports
components/
  ImageCard.tsx     # card with click-to-vanish logic
lib/
  images.ts         # gallery data + threshold
```

## Mobile responsiveness

- The grid is `1 col` on phones, `2 cols` on tablets, `3 cols` on desktop.
- The card action button is full-width on mobile and inline on larger screens.
- Text sizes and spacing scale with breakpoints via Tailwind utilities.
