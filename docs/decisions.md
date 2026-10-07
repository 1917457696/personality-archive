# Decision notes

## 2026-10-07 — Browser-only PDF sources are read-only

The extracted page text is the canonical evidence record. Editing a flattened aggregate could make the displayed source disagree with page citations and report prompts. Keep PDF pages immutable in the first release; users can add a separate text note when they want to annotate or revise an excerpt.

## 2026-10-07 — Require verified evidence for each shown finding

A report finding is only useful here if a reader can return to a supplied quote. Drop a finding when every quote fails exact-source validation, and strip page metadata from non-PDF sources. This avoids presenting unsupported model statements as evidence-backed analysis.

## 2026-10-07 — Limit each report prompt without truncation

Use a 40,000-character preflight across the included material and prompt. If it exceeds the limit, ask the user to deselect sources or reduce their content. The app does not silently omit, summarize, or shorten material.

## 2026-10-07 — Direct provider adapters and model identifiers

OpenAI, Kimi, and Claude requests use separate adapters implementing the same request interface. Configured model identifiers are defaults, not an account entitlement guarantee; provider offerings and permissions can change. Browser CORS may prevent direct calls from some deployed origins.

## 2026-10-07 — Remove the small legacy Kimi option

The shared report preflight has a fixed 40,000-character cap. Remove the legacy 8k-context model from the built-in list so the app does not offer a model whose context is smaller than the safety cap. Kimi K2.5 remains a default option; user accounts may still have different model entitlements.

## 2026-10-07 — Phase 2 astrology is an ephemeral entertainment feature

Add single Western sun-sign relationship readings and two-person compatibility as separate top-level areas. Use the 12 signs directly, without collecting birth date, time, or place. Reuse the selected provider/model and session-memory API key. Before each request, disclose that only the current astrology inputs and optional labels are sent and that charges may apply; never send archive data. Phrase results as non-scientific, exploratory entertainment with no certainty or match score. Keep them in page-session memory only, outside IndexedDB, report history, and backups.

## 2026-10-07 — Optional compatibility labels are address-only

Each person may use 女, 男, a custom label up to 20 characters, or no label (the default). Labels support wording only and must not influence compatibility reasoning. Single-sign analysis focuses on relationships; compatibility analyzes overview, complementary dynamics, friction points, and practical advice.
