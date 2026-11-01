# vKnight Step 21 — Developer funnel and related guides

## Copy files to `C:\O24\o24-landing-page`

This package updates the actual Header, Footer, navigation and Blog files provided in previous steps. Back up customized files before overwriting. Seven existing article `page.tsx` files are unchanged: `src/app/blog/layout.tsx` adds end-of-article recommendations automatically.

### Files
- `src/data/navigation.ts` — Developer Hub in main nav
- `src/components/layout/Header.tsx` — active link state
- `src/components/layout/Footer.tsx` — real developer resources, no placeholder links
- `src/components/analytics/TrackedLink.tsx` — Vercel Analytics click events
- `src/components/blog/RelatedArticles.tsx` — related articles, dynamic via current pathname
- `src/app/blog/layout.tsx` — mounts recommendations on all published article routes
- `src/app/blog/page.tsx` — blog to Hub tracking
- `src/app/developers/DeveloperHubClient.tsx` — Hub to demo/solutions tracking

### Analytics events
- `engineering_blog_to_hub`: blog listing -> `/developers`
- `engineering_article_to_hub`: article -> `/developers`
- `engineering_hub_to_demo`: Hub or article CTA -> `/demo`
- `engineering_hub_to_solution`: Hub -> solution pages
- `engineering_related_article`: reading another guide

Only click intent is tracked, *not* demo form submissions, qualified leads or conversions. No personal data is emitted. Existing `@vercel/analytics` must be enabled in the root layout. For actual form completion, add a separate server-verified success event at the demo submission handler later.

### Verify
```
npx tsc --noEmit
npx eslint src/data/navigation.ts src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/analytics/TrackedLink.tsx src/components/blog/RelatedArticles.tsx src/app/blog src/app/developers/DeveloperHubClient.tsx
npm run build
```
Visit `/blog`, `/blog/cqrs-pattern-dotnet-10`, `/developers`, `/demo`. Related articles must show only on article routes, not `/blog`. Vercel Analytics events may require a deployed site and event dashboard availability.

### Caution
This baseline uses source files from earlier steps, not your live Git working tree. If any source files have changed since, merge the relevant edits rather than replace blindly. The blog layout adds a second related-content block to articles which already have manual recommendation sections; these can be consolidated in a later cleanup.
