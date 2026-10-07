# Sprint 1 Contract — Personality Archive MVP

- `goal`: Deliver the first usable Chinese personality archive app: manage profile boxes, add/edit/delete text and PDF materials, generate evidence-grounded tentative reports through a user-supplied provider key, keep local history, and back up/import local data.
- `impl`: React + TypeScript + Vite. Preserve the Product Design prototype hosting files. Organize `src/` in the required `types -> config -> repo -> service -> runtime -> ui` layers. Use IndexedDB (`idb`), PDF.js page extraction, and separate OpenAI/Kimi/Claude direct-browser adapters behind a shared interface. Keep keys in runtime memory only. Render reports from validated structured data; validate exact excerpts against included source material. No astrology screens in this sprint.
- `criteria`:
  1. `npm run build` succeeds; `npm run test:sites` passes.
  2. Unit/UI tests cover profile CRUD and cascade delete; material CRUD and stale report marking; page-based PDF extraction including no-text case; report schema and exact citation validation; provider errors without exposing keys; JSON merge/import conflict handling; key absence from backup.
  3. Manual browser acceptance: responsive archive home and profile details; key entry/reveal/clear, no persistence after refresh; warnings before transmitting text; excluded sources omitted from prompt; report history and stale state visible; all UI copy in Chinese.
  4. Verify dependency direction and no secret values or API key storage in IndexedDB, localStorage, files, or logs.
  5. Document risks: provider browser CORS support is deployment-origin dependent; no live paid API calls are part of this sprint.
- `layer`: vertical slice across `types`, `config`, `repo`, `service`, `runtime`, `ui`.
- `blocked_by`: none.

## Product decisions

- Work name: 星象档案. Visual direction: 星象手册, translated into a dark ink-blue/plum shell, restrained brass accents, paper-like content panels, and subtle celestial navigation ornament; keep reports editorial and evidence-first.
- MBTI, Enneagram, Big Five; tentative language only; no diagnosis and no pseudo-precision scores.
- Local-only IndexedDB. Store extracted PDF pages, filename and page; discard original bytes. No account, cloud sync or backend.
- Keys remain in page-session memory and are cleared on refresh. Providers may refuse direct browser requests; do not introduce a proxy.
- Single-sign astrology and compatibility are phase two.
