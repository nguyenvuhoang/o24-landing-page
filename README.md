# Step 28.2 — Banking & Fintech Enhancement

This adds a **client-side conceptual transaction lifecycle** to the existing Banking & Fintech solution page. No server calls, bank accounts or real transactions are involved. Payment responses and codes are explicitly illustrative.

## Installation (safe for customized pages)

1. Copy `src/components/solutions/BankingFlowShowcase.tsx` into the same relative path in your project.
2. In `src/app/solutions/bank-fintech/BankFintechClient.tsx`, add:

```tsx
import { BankingFlowShowcase } from "@/components/solutions/BankingFlowShowcase";
```

3. Insert `<BankingFlowShowcase />` **after the capabilities section**, before the existing `Common use cases` section. Do not overwrite the existing page or CTA.

Optional: use `node scripts/step28-2-integrate.mjs` to insert the import and section into the expected page automatically. The script checks for existing integration and refuses to insert if the expected anchor is missing.

## Validation

```powershell
pnpm exec eslint src/components/solutions/BankingFlowShowcase.tsx src/app/solutions/bank-fintech/BankFintechClient.tsx
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

Check `/solutions/bank-fintech#banking-in-action`. Test the Approved, Declined and Unknown outcome examples. Ensure the Unknown state explicitly says reconciliation is required. Test Run, Step, Reset, Copy JSON, keyboard access and mobile widths.

Production note: The site examples are not live O24 API contracts, not performance metrics and not evidence that any specific banking integration is installed.
