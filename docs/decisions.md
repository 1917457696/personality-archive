# Decision notes

## 2026-10-07 — Browser-only PDF sources are read-only

The extracted page text is the canonical evidence record. Editing a flattened aggregate could make the displayed source disagree with page citations and report prompts. Keep PDF pages immutable in the first release; users can add a separate text note when they want to annotate or revise an excerpt.

## 2026-10-07 — Require verified evidence for each shown finding

A report finding is only useful here if a reader can return to a supplied quote. Drop a finding when every quote fails exact-source validation, and strip page metadata from non-PDF sources. This avoids presenting unsupported model statements as evidence-backed analysis.

## 2026-10-07 — Show personality conclusions before report detail

Readers need a concise answer to “what personality tendencies does this suggest?” before the supporting narrative. New reports therefore provide a tentative conclusion for MBTI, Enneagram, and Big Five above the overall observation and evidence details. A conclusion is shown only when its dimension retains at least one exactly verified finding; otherwise it is replaced with an explicit insufficient-evidence message. Keep the field optional in the stored type so existing IndexedDB records and JSON backups remain readable without migration. Older reports show a notice that they lack the new conclusion overview.

## 2026-10-07 — Limit each report prompt without truncation

Use a 40,000-character preflight across the included material and prompt. If it exceeds the limit, ask the user to deselect sources or reduce their content. The app does not silently omit, summarize, or shorten material.

## 2026-10-07 — Direct provider adapters and model identifiers

OpenAI, Kimi, Claude, and DeepSeek requests use separate adapters implementing the same request interface. OpenAI uses Responses; the other three use their documented Chat Completions or Messages formats. Configured model identifiers are defaults, not an account entitlement guarantee; provider offerings and permissions can change. Browser policy or account settings may prevent direct calls from some deployed origins.

## 2026-10-07 — Remove the small legacy Kimi option

The shared report preflight has a fixed 40,000-character cap. Remove the legacy 8k-context model from the built-in list so the app does not offer a model whose context is smaller than the safety cap. Kimi K2.5 remains a default option; user accounts may still have different model entitlements.

## 2026-10-07 — Phase 2 astrology is an ephemeral entertainment feature

Add single Western sun-sign relationship readings and two-person compatibility as separate top-level areas. Use the 12 signs directly, without collecting birth date, time, or place. Reuse the selected provider/model and session-memory API key. Before each request, disclose that only the current astrology inputs and optional labels are sent and that charges may apply; never send archive data. Phrase results as non-scientific, exploratory entertainment with no certainty or match score. Keep them in page-session memory only, outside IndexedDB, report history, and backups.

## 2026-10-07 — Optional compatibility labels are address-only

Each person may use 女, 男, a custom label up to 20 characters, or no label (the default). Labels support wording only and must not influence compatibility reasoning. Single-sign analysis focuses on relationships; compatibility analyzes overview, complementary dynamics, friction points, and practical advice.

## 2026-10-07 — Refresh provider catalog and plain-language guidance

Add DeepSeek using its OpenAI-compatible Chat Completions API. Update OpenAI to its Responses API and current GPT-6 models; refresh Claude model IDs to the current Sonnet/Opus family while retaining Haiku as a lighter option. Keep Kimi K2.5, the latest generally documented Kimi model. These IDs are a curated default list and may change or require account access. Sources checked 2026-10-07: [OpenAI models](https://developers.openai.com/api/docs/models), [OpenAI Responses JSON mode](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses), [Anthropic models](https://platform.claude.com/docs/en/models/overview), [DeepSeek API model list and compatibility](https://api-docs.deepseek.com/guides/tool_call), [Kimi prompt guide](https://platform.kimi.ai/docs/guide/prompt-best-practice).

Replace implementation-focused API setup warnings with practical user guidance: identify what will be sent, mention potential provider charges, and recommend entering the Key on a personal device and removing sensitive material before sending.

## 2026-10-07 — Explain local archive persistence and zodiac elements

The archive remains account-free in the first version and is persisted in IndexedDB for the same browser profile and site origin. Explain that it will be available on return in that browser, but browser-data clearing can remove it and another device requires a JSON backup/import. Do not add account/cloud storage without a product decision.

For astrology, explain that “sun sign” means the familiar birthday zodiac sign used by this simplified flow. Label each sign with its traditional fire/earth/air/water element and describe those as cultural symbolism, not factual personality assessment. References: [Astrology.com elements](https://www.astrology.com/elements), [Astro.com introduction to the four elements](https://www.astro.com/astrology/in_elements_e.htm).
