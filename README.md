# Step 18 — Docker CI/CD for .NET 10 Microservices

Copy the two files in `src/` to the corresponding paths in your `C:\O24\o24-landing-page` repository.

The existing blog index reads `src/data/blog.ts` and the existing `src/app/sitemap.ts` uses `getPublishedArticlePaths()`; neither file needs editing.

## Verify

```powershell
npx tsc --noEmit
npx eslint src/data/blog.ts src/app/blog/docker-cicd-dotnet-10-microservices/page.tsx
npm run build
```

## Note
Article code samples are architectural starting points, not an independently built and tested GitHub Actions/ASP.NET Core demo repo. Replace all placeholders before using in production.
