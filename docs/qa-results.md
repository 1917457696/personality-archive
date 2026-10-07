# Sprint 1 QA results and limitations

Date: 2026-10-07

## Automated checks

- `npm run build`: passed. Produces `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
- `npm run test:sites`: passed, 4/4.
- `npm test`: passed, 9/9. Coverage includes strict citation validation and finding suppression, PDF page matching, excluded-source prompt selection, backup key exclusion/conflict detection, stale flags, PDF page extraction/no-text response, oversized-material preflight, mocked provider error redaction, IndexedDB cascade deletion, and merge replacement.
- TypeScript `tsc --noEmit`: passed.
- No live provider requests were made.

## Browser acceptance

- Verified archive home/profile creation, opening a profile, adding text, settings and cascade deletion in the in-app browser.
- Checked the archive grid at 1366×850 and 390×844. The mobile header keeps import/export controls available.
- Entered a fake placeholder (not a real key), refreshed, and confirmed the API Key field was empty. Removed temporary QA profiles afterward.
- Exact visual comparison to a source mockup was not possible because the selected visual direction was provided as text rather than a reference image. The implemented screens use the agreed 星象手册 direction.

## UX and data handling notes

- The archive home displays existing people as a responsive grid when no profile is selected; top navigation returns to that grid.
- Extracted PDFs are read-only page sources. Add a separate text note for annotations; prompts and citations use the original page text.
- A report finding is displayed only if it contains at least one exact quote verified against the selected source. PDF citations must match that exact page. Text citations never retain a page number. A dimension with no verified findings shows an evidence-insufficient message.
- The report preflight rejects prompts above 40,000 characters and asks users to deselect sources or shorten content. It never truncates material or retries with a reduced prompt.
- API keys stay in React runtime state and are absent from IndexedDB/export. Mocked network and authorization errors are sanitized; only generic service status is surfaced.

## Limitations

- Provider browser CORS behavior depends on deployment origin, browser, provider account, and key permissions. No backend proxy is included. Models listed in settings are defaults/examples and may not be enabled for every account. No live provider-origin checks were made because no user API keys were supplied.
- Build reports a large JavaScript chunk due to bundled PDF.js worker (about 1.04 MB uncompressed). Consider lazy-loading the PDF path in a later performance pass.
- The `security-best-practices` skill was not available in the current skill catalog; a manual security review found no key persistence/logging in the app layers.

## Type and architecture checks

- `src/ui` imports `types`, `config`, and the runtime façade; it does not import repo/service modules directly. No `localStorage`, `sessionStorage`, or console logging calls are present in the app layers.
- Historical Sprint 1 QA snapshot: provider defaults at that verification point were OpenAI `gpt-4o-mini` / `gpt-4.1-mini`, Kimi `kimi-k2.5`, and Claude `claude-haiku-4-5-20251001` / `claude-sonnet-4-6`. See the provider-catalog decision for the current list.
