# Sprint 2 Contract — Astrology Guide and Compatibility

- `goal`: Add a single Western sun-sign relationship reading and a two-person zodiac compatibility flow to 星象档案, reusing the existing BYOK provider settings while keeping results ephemeral.
- `impl`: Add typed astrology inputs/results in `types`; a static config list for the 12 Western sun signs and their traditional elements; `service/astrologyService.ts` to build prompts, invoke the existing provider adapters, and validate structured JSON; a small runtime façade; and UI navigation/forms/results. Explain the element groups as astrology symbolism, not scientific personality assessment. Do not use archive repository storage, change IndexedDB schema, or include astrology results in backup. Use the current in-memory API key and selected provider/model. Send only current sign selections, their static element mapping, and optional compatibility labels after an explicit cost/data confirmation.
- `criteria`:
  1. Navigation exposes 人格档案、单星分析、双人配对; single and pair flows work at desktop and mobile sizes and retain the 星象手册 visual direction.
  2. Single-sign result includes relationship tendencies, emotional needs, fitting partner traits, common friction points, practical advice, and a non-scientific/entertainment caveat.
  3. Single and pair selectors label each sun sign with its fire/earth/air/water element and briefly explain the cultural category. Pair input contains two independent sign selectors and optional gender labels (`女`, `男`, custom up to 20 characters, or unspecified); gender affects address only, not compatibility reasoning. Pair result includes overview, complementary dynamics, friction points, practical advice, and a caveat; no numeric match score.
  4. Use existing BYOK settings. Missing key opens the shared settings UI; cancellation sends no request. Before sending, disclose that only astrology inputs go to the selected provider and that charges may apply. No archived profiles/materials are sent.
  5. Results remain in page-session memory only; refresh clears them. No IndexedDB writes, report-history entries, or backup changes.
  6. Unit tests cover sign input mapping, valid/invalid response schemas, omitted/custom gender, prompt data boundaries, missing key, mocked network/HTTP/format errors, and no persistence. Build, TypeScript, Sites tests, and desktop/mobile browser acceptance pass. No automated live provider calls.
- `layer`: `types -> config -> service -> runtime -> ui`; repo layer unchanged.
- `blocked_by`: none; builds on Sprint 1 provider adapters and settings.

## Product decisions

- Single-sign analysis focuses on love and relationship dynamics, not careers or broad life predictions.
- Reuse the active OpenAI/Kimi/Claude/DeepSeek provider, model, and session-only key.
- Pair signs are selected separately; gender labels are optional and contextual only.
- Results are not saved. Astrology is framed as an entertainment/cultural lens, not evidence-based assessment or reliable prediction.
- The app accepts the 12 Western sun signs directly; no birth date, birth time, or birthplace is requested. Each sign's element is derived from static configuration and included in the displayed and generated astrology context.
