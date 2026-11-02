# Step 26.1D — Responsive, Motion & Accessibility hardening

This drop-in package contains **four sections** based on steps 26.1A, 26.1B.1 and 26.1C. It does not touch `page.tsx`, Supabase, dashboard, APIs, or introduce packages.

## Integration

Back up any local edits first. **Do not overwrite files blindly if you customized them since the preceding steps.** Compare with `git diff -- src/components/sections/...` and selectively merge changes. Copy the `src/` tree to the project root when ready.

## Changes

- Hero: smaller minimum mobile headline, responsive spacing and sensible minimum widths.
- Product preview: scrollable 44px+ tab targets; roving tab focus and ArrowLeft/ArrowRight/Home/End keyboard behavior; accessible tab panel and minimum-width protection.
- In Action: narrower mobile gutters, code overflow containment, one concise status live region; suppress repeated verbose screen-reader announcements. Respects `prefers-reduced-motion` by removing visual width animation and fast-forwarding timer stages after the user clicks Run.
- Architecture: CSS connector is aligned to the icon rail; localized screen-reader announcement on layer change; prevents long JSON lines from widening layout.

All JSON and performance indicators are examples, not live banking activity.

## Local verification

```powershell
pnpm exec eslint src/components/sections/Hero.tsx src/components/sections/O24ProductPreview.tsx src/components/sections/O24InAction.tsx src/components/sections/Architecture.tsx
pnpm exec tsc --noEmit
pnpm test
pnpm build
pnpm dev
```

### Browser acceptance matrix

- Widths: 320, 375, 390, 768, 1024, 1440 px; no page-level horizontal scroll. Verify both themes.
- 200% browser zoom: text and controls remain operable.
- Keyboard-only: Tab to preview tabs; use Left/Right/Home/End to switch and focus. Tab through Scenario, Run, Pause, Step, Reset, Copy JSON; architecture selectors and Next/Previous.
- Reduced motion: DevTools -> Rendering -> Emulate CSS media feature `prefers-reduced-motion: reduce`; flow steps advance immediately after Run and width transitions are off.
- Check that JSON scrolls within its own panel and CTA `/demo` remains reachable.
- Mobile: inspect spacing at 320px, all buttons visible and clickable; ensure no page-level scrollbars.

### Measure performance against a baseline

Use production build (`pnpm build && pnpm start`) and Chrome DevTools Lighthouse, 3 runs mobile and desktop per condition, same network/device settings. Compare medians of LCP, INP, CLS, transferred JS, layout shifts. Suggested goals: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 (field Core Web Vitals guidance); lab Lighthouse cannot conclusively measure field INP. No scores are asserted by this package. Check `next build` output and DevTools Performance for long tasks and main-thread work.

### Scope

No changes to navigation, CRM, Supabase, migrations, or production data. This is an optimization pass rather than a redesign or synthetic test result.
