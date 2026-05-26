# The Cockroach Gallery

A mobile-responsive Next.js demo where **every tap summons a cockroach** that scuttles onto the image. Reach the threshold (10 by default) and the swarm converges to **eat the image whole**, revealing a hidden message underneath.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** (PostCSS plugin)
- **HeroUI v3 beta** (`@heroui/react` + `@heroui/styles`)
- **@gravity-ui/icons** for UI icons
- **@iconify/react** for the cockroach itself (Microsoft Fluent Emoji Flat — `fluent-emoji-flat:cockroach`)
- CSS keyframe animations (no animation library needed)

## Getting started

```bash
# 1. install (important: must run with full network access)
npm install

# 2. run dev server
npm run dev

# 3. build for production
npm run build
npm start
```

Then open <http://localhost:3000>.

## How the swarm works

The interaction has three phases — `intact → eating → vanished`:

1. **Intact**: each press of "Summon a cockroach" spawns a new `<Cockroach>` SVG at a random position with a random rotation and size. It scales in with a bounce, then scuttles continuously with a CSS keyframe animation.
2. **Eating** (triggered at the 10th tap):
   - Every cockroach smoothly **converges to the center** of the image (CSS `transform` transition).
   - Each one pulses in a **`chomp` animation** (rapid scale up/down).
   - The image runs an **`image-eaten` keyframe**: opacity drops, blur ramps up, saturation drains, and it shrinks toward zero over ~1.3s.
3. **Vanished**: the image is fully unmounted and replaced with a `reveal-pane` showing the hidden quote.

### Tunable knobs

In `lib/images.ts`:

```ts
export const VANISH_THRESHOLD = 10;
```

In `components/ImageCard.tsx`:

```ts
const EATING_DURATION_MS = 1300;
```

In `app/globals.css` — the keyframes themselves:

- `roach-spawn` — pop-in scale animation when a roach is added
- `roach-scuttle` — continuous subtle jiggle on each roach
- `roach-chomp` — pulse during the eating phase
- `image-eaten` — fade + blur + scale-down of the image
- `reveal-fade-in` — entrance of the hidden context

## Project layout

```
app/
  layout.tsx        # root layout + globals
  page.tsx          # gallery home page (client component)
  globals.css       # tailwind + heroui + cockroach keyframes
components/
  ImageCard.tsx     # phase state machine + tap handler + render
  Cockroach.tsx     # inline SVG cockroach
lib/
  images.ts         # gallery data + VANISH_THRESHOLD
next.config.ts      # remote image hosts + outputFileTracingRoot
```

## Mobile responsiveness

- Grid: 1 col on phones, 2 cols on tablets (`sm`), 3 cols on desktop (`lg`).
- Action button: full-width on mobile, inline on `sm+`.
- All text scales via Tailwind breakpoints.
- Touch-friendly: tap target is the full button width.

## Notes on the implementation

- Each cockroach is positioned via CSS custom properties `--x` / `--y` (percentages of the image container). To converge them on "eating", we just override `.is-eating .roach-anchor` to `left: 50%; top: 50%` — the CSS transition on `left`/`top` handles the smooth motion. Percentages on `left`/`top` resolve against the **containing block**, which is the image; this is the key difference from `transform: translate(X%, Y%)` (which resolves against the element's own box) — and was the cause of an early bug where every roach stacked at the center.
- The rotation is held in a separate `--rot` custom property on the inner glyph, so it survives across spawn / scuttle / chomp without conflict.
- Re-clicks during the eating or vanished phase are no-ops; "Shoo them away" resets state and clears the roach swarm.

## Known caveats

- The sandbox `npm install` may fail with `EAI_AGAIN` (DNS) inside some restricted environments — use a normal shell or grant full network access.
- The cockroach SVG is intentionally simple; if you want it more lifelike, replace `<Cockroach />` with a more detailed SVG or a Lottie animation.
