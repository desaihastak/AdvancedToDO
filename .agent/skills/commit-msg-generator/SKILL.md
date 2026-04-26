---
name: commit-msg-generator
description: "Generates a high-quality, logic-driven Conventional Commit message by analyzing staged git changes. Use when the user asks to generate a commit message, prepare a commit, or analyze staged changes for git."
---

Analyze the currently staged git changes (git diff --staged), reading ALL files completely.

══════════════════════════════════════════
STEP 1 — REASON FIRST (do not output this)
══════════════════════════════════════════

────────────────────────────
A) SCOPE
────────────────────────────

- Derive from directory structure / feature area (e.g. auth, ui, api, db, config)
- Use the domain of the PROBLEM being fixed, not the utility touched
- Cross-cutting changes with no clear owner → omit scope
- Never use a raw filename as scope

────────────────────────────
B) TYPE — with disambiguation
────────────────────────────

Evaluate these IN ORDER. Stop at first true match.
For each candidate type, apply its disambiguation check before accepting it.

[ feat ]
Match: New user-facing capability that didn't exist before
Disambiguation: - Was this added to FIX something broken? → fix instead - Was this restoring previously working behavior? → fix instead - Is it a new code path that only fires for an existing edge case? → fix instead - Only true new capability the user gains = feat

[ fix ]
Match: Corrects behavior that was wrong, insufficient, insecure, or broken
Disambiguation: - Is the error handling purely speculative (no known breakage)? → feat or chore instead - Did it restructure code AS THE METHOD of fixing? → still fix (structure = method, not reason) - Was the old code just messy but functionally correct? → refactor instead - Fix wins over refactor whenever correctness was the motivation

[ perf ]
Match: Measurably improves speed/memory with zero behavior change
Disambiguation: - Did this fix a timeout, OOM crash, or incorrect slow result? → fix instead - Was the original behavior correct, just slow? → perf - Correctness problems always trump perf, even if speed improved

[ refactor ]
Match: Code restructured/cleaned, behavior was CORRECT and UNCHANGED before
Disambiguation: - Was the old code wrong, insufficient, or producing bad output? → fix instead - Was the replacement already used elsewhere and considered "correct"? → strengthens fix signal - Only accept refactor when behavior was already correct and this is purely structural

[ test ]
Match: ONLY test files changed
Disambiguation: - Did source logic change too? → use that type, mention tests in bullets - Tests added for a known gap in existing correct code = test - Tests added as part of a bug fix = include in fix bullets, not test

[ docs ]
Match: ONLY documentation, comments, or type annotations changed
Disambiguation: - Did any logic change alongside the docs? → use that type, mention docs in bullets - Were the docs correcting a description of wrong behavior alongside a fix? → fix

[ style ]
Match: ZERO runtime effect — pure formatting (whitespace, quotes, semicolons)
Disambiguation: - Did any CSS/classname change affect what users SEE? → feat or fix instead - Did any rename affect behavior? → refactor or fix - style = zero runtime effect, nothing else

[ build ]
Match: Build system, bundler, compiler, or dev tooling config changed
Disambiguation: - Did a dep upgrade fix a security CVE or broken behavior? → fix instead - Did it unlock new runtime behavior? → feat instead - Pure build tooling with no runtime effect = build - package.json scripts, tsconfig, webpack/vite config, eslint = build - Version bumps with no behavior change = chore

[ ci ]
Match: CI/CD pipeline, deployment automation, workflow files
Disambiguation: - Does the Dockerfile change what the built artifact contains? → build instead - Pure pipeline/automation with no effect on the artifact itself = ci

[ chore ]
Match: Everything else — renames, version bumps, project metadata, housekeeping
Disambiguation: - Does it touch build tooling? → build instead - Does it touch pipeline? → ci instead - Does it fix a bug? → fix instead - chore = truly none of the above

────────────────────────────
C) MASTER OVERRIDE RULE
────────────────────────────
The type = the REASON, not the shape.

Structural change to fix a bug → fix
New code added to fix a bug → fix
Dep upgraded to fix a security hole → fix
Refactored AND fixed → fix (mention refactor in bullets)
Cleaned up AND added a feature → feat (mention cleanup in bullets)
The dominant REASON wins. Secondary effects go in bullets.

────────────────────────────
D) INTENT — extract the human motivation
────────────────────────────
Look for signals:

- Changed/added comments in the diff → often state the why directly
- Replacement is stricter, uses a proper library, handles more cases → correctness fix
- Existing proven function reused → trust signal, strengthens fix
- Variable/function renames only → clarity goal, strengthens refactor
- Tests changed → reveal what was broken or newly required
- Dep/config change → environment, security, or tooling motivation

Summarize as one phrase: the human motivation behind this change.

══════════════════════════════════════════
STEP 2 — WRITE the commit message
══════════════════════════════════════════

Format:
<type>(<scope>): <short imperative summary ≤72 chars>

- What was wrong or missing (the problem)
- What was done and why this approach
- Why this approach over alternatives, if non-obvious
- Any side effects, files affected, or breaking changes

Rules:

- Imperative mood: "fix", "add", "replace" — not "fixed" or "fixes"
- 2–5 bullets, each meaningful
- Do NOT mention AI or add commentary
- Output ONLY the commit message in a single markdown code block
