vKnight Engineering — Step 17

Copy src/app/blog/rabbitmq-event-driven-transactions-dotnet-10/page.tsx into your Next.js project (new file).
Replace src/data/blog.ts with the bundled registry (based on Step 16, preserving all 4 previously published articles).
Do NOT replace src/app/sitemap.ts: Step 15 uses getPublishedArticlePaths() and automatically includes published posts.

Validation in your project:
  npx tsc --noEmit
  npx eslint src/data/blog.ts src/app/blog/rabbitmq-event-driven-transactions-dotnet-10/page.tsx
  npm run build

Code examples are educational sketches with abstract types; they are not copy-paste complete banking software.
No fabricated publication date in metadata or JSON-LD.
