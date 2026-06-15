# Implementation Tasks: Quick Search Visual Refresh (v1.2.0)

## Overview

Tasks are ordered for safe, sequential execution: tokens → i18n → popup HTML → popup CSS → options HTML → options CSS → tests → final validation.

### Source files altered (8)
- `src/shared/theme.css`
- `src/popup/popup.html`
- `src/popup/popup.css`
- `src/options/options.html`
- `src/options/options.css`
- `src/shared/i18n.ts`
- `public/_locales/en/messages.json`
- `public/_locales/pt_BR/messages.json`

### Test files created/altered (1)
- `tests/visual-refresh.test.ts` (new — Vitest only, no new runtime deps)

### Operational files in temp/ (reference/documentation only — not packaged)
- `temp/QUICK_SEARCH_V1_2_0_PROPERTY_TESTING_DEFERRED_REPORT.md` (created — documents deferred PBT)
- `temp/design/PrintQuickSearchNewVisualInterfacePopup.png` (pre-existing — visual reference only, not imported/copied/referenced/packaged)
- `temp/design/QUICK_SEARCH_VISUAL_STACK_ANALYSIS.md` (pre-existing — technical reference only)

### Files NOT altered (prohibited scope)
- Any `.ts` logic/domain/storage/service-worker file
- `package.json`, `package-lock.json`
- Manifest, build config, `vite.config.ts`, `vitest.config.ts`
- Any file under `src/background/`, `src/domain/`, `src/config/`, `src/manifest/`

No new dependencies added. Tests use existing Vitest stack only.

---

## Tasks

- [x] 1. Expand design token system in theme.css
  - [x] 1.1 Add structural tokens (theme-independent) to `:root`: `--qs-radius-sm`, `--qs-radius-md`, `--qs-radius-lg`, `--qs-shadow-sm`, `--qs-shadow-lg`, `--qs-space`, `--qs-hit-target`, `--qs-font-sans`
  - [x] 1.2 Add dark theme `--qs-*` color tokens to `[data-theme='dark']` and `@media (prefers-color-scheme: dark)` block: `--qs-bg: #090d12`, `--qs-surface`, `--qs-surface-elevated`, `--qs-primary: #1889a0`, `--qs-primary-hover`, `--qs-primary-strong`, `--qs-border`, `--qs-border-active`, `--qs-text`, `--qs-text-secondary`, `--qs-text-muted`, `--qs-danger`, `--qs-danger-soft`
  - [x] 1.3 Add light theme `--qs-*` color tokens to `[data-theme='light']` and `@media (prefers-color-scheme: light)` block: `--qs-primary: #126f83`, and all other color tokens with WCAG AA-compliant values
  - [x] 1.4 Add `@media (prefers-reduced-motion: reduce)` block disabling all CSS transitions and animations
  - [x] 1.5 Verify all legacy tokens are present and unchanged in every theme block (`--primary-color`, `--bg-color`, `--surface-color`, `--text-color`, `--muted-text-color`, `--border-color`, `--hover-color`, `--selected-color`, `--avatar-bg-color`, `--avatar-text-color`, `--overlay-color`, `--danger-color`, `--success-color`)

- [x] 2. Add localBadge i18n key
  - [x] 2.1 Add `localBadge: 'Local'` to `MESSAGES.en` and `MESSAGES.pt_BR` in `src/shared/i18n.ts`
  - [x] 2.2 Add `"localBadge": { "message": "Local" }` to `public/_locales/en/messages.json`
  - [x] 2.3 Add `"localBadge": { "message": "Local" }` to `public/_locales/pt_BR/messages.json`

- [x] 3. Restructure popup.html
  - [x] 3.1 Add `<header class="qs-header">` as first child of `#app`, containing `<span class="qs-header-title">` (appName) and `<span class="qs-header-badge">` (localBadge)
  - [x] 3.2 Wrap `#search-input` and `#suggestions-list` inside `<div class="search-wrapper">`
  - [x] 3.3 Verify all existing element IDs (`#search-input`, `#suggestions-list`, `#status`, `#provider-list`, `#search-new-tab`, `#search-current-tab`, `#temp-override`, `#temp-override-label`, `#settings-link`) are preserved exactly
  - [x] 3.4 Verify ARIA attributes are preserved: `role="listbox"` on suggestions list, `role="option"` on suggestion items, `role="status"` and `aria-live="polite"` on `#status`

- [x] 4. Rewrite popup.css with --qs-* tokens
  - [x] 4.1 Set popup container width to `370px`, apply `--qs-bg`, `--qs-font-sans`
  - [x] 4.2 Style `.qs-header`: compact height, flex row, space-between, title with `--qs-text`, badge with `--qs-primary` background and `--qs-radius-sm`
  - [x] 4.3 Style `.search-wrapper`: `--qs-surface-elevated` background, `1px solid var(--qs-border)`, `--qs-radius-md`
  - [x] 4.4 Style `#search-input`: token-based colors, `:focus-visible` outline using `--qs-border-active`
  - [x] 4.5 Style `#suggestions-list` and `.suggestion-item`: hover/active background using `--qs-primary` at low opacity, left border accent using `--qs-primary`
  - [x] 4.6 Style `.provider-item`: `min-height: var(--qs-hit-target)`, hover with `--qs-surface-elevated`, `:focus-visible` outline
  - [x] 4.7 Style `.provider-item.selected`: low-opacity `--qs-primary` background tint, `--qs-border-active` left or full border
  - [x] 4.8 Style `.provider-item.is-default .badge`: `--qs-primary` text color, small badge visual
  - [x] 4.9 Style `.provider-item.is-tab-override`: distinct accent (amber/`#b45309` in light, `#fbbf24` in dark) not conflicting with primary or danger
  - [x] 4.10 Style `.actions`: `#search-new-tab` primary (`--qs-primary-strong` bg, white text), `#search-current-tab` secondary (`--qs-surface` bg, `--qs-text`)
  - [x] 4.11 Style `.footer`: top border `var(--qs-border)`, `.toggle-container` `min-height: var(--qs-hit-target)`, `#settings-link` `:focus-visible`

- [x] 5. Midpoint checkpoint
  - [x] 5.1 Run `npm test` — all existing tests must pass
  - [x] 5.2 Run `npm run build` — must complete without errors
  - [x] 5.3 Run `npm run lint` — must report no new errors

- [x] 6. Restructure options.html (structural DOM reorder)
  - [x] 6.1 Reorder sections in `options.html` source to this exact DOM order: `<header>` → `<section class="preferences-section">` → `<section class="actions-section">` → `<section class="providers-section">` → `<div id="modal">`
  - [x] 6.2 Confirm this is a source-order change in HTML — no CSS `order`, `flex-order`, `position`, or `z-index` workarounds
  - [x] 6.3 Verify all existing element IDs referenced by `options.ts` are preserved exactly (`#title`, `#description`, `#language-select`, `#theme-select`, `#search-history-toggle`, `#clear-history-btn`, `#restore-defaults-btn`, `#providers-list`, `#add-provider-btn`, `#modal`, `#provider-form`, etc.)

- [x] 7. Rewrite options.css with --qs-* tokens
  - [x] 7.1 Style page: `--qs-bg` background, `--qs-font-sans`, max-width container centered
  - [x] 7.2 Style `header`: strong `h1` with `--qs-text`, description with `--qs-text-secondary`, bottom border with `--qs-border`
  - [x] 7.3 Style section panels (`.preferences-section`, `.actions-section`, `.providers-section`): `--qs-surface` background, `1px solid var(--qs-border)`, `--qs-radius-lg`, consistent padding
  - [x] 7.4 Style `.preference-row`: `min-height: var(--qs-hit-target)`, flex row, `:focus-visible` on all `select`, `input[type=checkbox]`
  - [x] 7.5 Style `#restore-defaults-btn` (`.btn-danger`): `--qs-danger` border and text, `--qs-danger-soft` background on hover
  - [x] 7.6 Style `.provider-row`: `min-height: var(--qs-hit-target)`, hover `--qs-surface-elevated`, `:focus-visible` outline
  - [x] 7.7 Style provider action buttons: compact, `min-height: var(--qs-hit-target)`
  - [x] 7.8 Style `#modal`: `--qs-surface-elevated` background, `--qs-shadow-lg`, `1px solid var(--qs-border)`, `--qs-radius-lg`
  - [x] 7.9 Style toast: success variant uses `--qs-primary` accent, error variant uses `--qs-danger` accent

- [x] 8. Write deterministic tests in tests/visual-refresh.test.ts
  - [x] 8.1 Token completeness (dark): set `data-theme='dark'` on a JSDOM element, import theme.css via inline style injection, assert all 21 `--qs-*` tokens resolve to non-empty strings
  - [x] 8.2 Token completeness (light): same as 8.1 for `data-theme='light'`
  - [x] 8.3 Legacy token preservation: assert all 13 legacy token names still defined in both themes
  - [x] 8.4 i18n key symmetry: import MESSAGES from i18n.ts, assert every key in `en` exists in `pt_BR` with non-empty value and vice versa; assert `localBadge` is present in both
  - [x] 8.5 Popup DOM structure: parse `popup.html` as string, assert `.qs-header` exists, `.search-wrapper` wraps `#search-input`, `#status` has `role="status"` and `aria-live="polite"`, `#suggestions-list` has `role="listbox"`
  - [x] 8.6 Options DOM order: parse `options.html` as string, assert `.preferences-section` appears before `.providers-section` in source order (indexOf check)
  - [x] 8.7 Non-color state indicators (manual validation note): `.is-default`, `.is-tab-override`, `.badge`, and `.tab-badge` are rendered dynamically by `popup.ts` via `create()` — they are NOT in the static HTML. Test instead that the static `popup.html` does not incorrectly hardcode these elements, and document manual validation: open extension in Chrome, confirm default provider shows "Default" badge and tab-override row shows distinct visual treatment
  - [x] 8.8 Keyboard navigation — delegate to existing coverage: `getSuggestionKeyboardAction` is already exported from `src/domain/suggestion-acceptance.ts` and fully covered by `tests/suggestion-acceptance.test.ts`. This sub-task verifies the existing test still passes after the visual refresh (`npm test` output) — no new test code needed, no TS logic changes made
  - [x] 8.9 Manifest permissions unchanged: read and parse `src/manifest/manifest.template.ts` source, assert `permissions` contains only `storage` and `host_permissions` is absent or empty
  - [x] 8.10 No reference to temp print: assert no file in `src/` or `public/` contains the string `PrintQuickSearchNewVisualInterfacePopup`

- [x] 9. Second checkpoint
  - [x] 9.1 Run `npm test` — full suite including visual-refresh.test.ts must pass
  - [x] 9.2 Run `npm run build` — must succeed
  - [x] 9.3 Run `npm run lint` — must report zero new errors

- [ ] 10. Final validation and delivery
  - [x] 10.1 Run `npm test` — confirm full suite passes
  - [x] 10.2 Run `npm run build` — confirm success
  - [x] 10.3 Run `npm run lint` — confirm zero new errors
  - [x] 10.4 Run `npm run release:check` — record result (pass or "command not found")
  - [x] 10.5 Run `git status --short` — confirm only allowed files modified; no commit executed
  - [x] 10.6 Run `npm run zip` or `npm run release:zip` to produce release artifact; inspect ZIP contents to confirm `temp/` is absent; if command unavailable, register this and provide manual steps
  - [x] 10.7 Confirm `temp/design/PrintQuickSearchNewVisualInterfacePopup.png` was not imported, copied, referenced in any source file, or packaged in any build artifact
  - [x] 10.8 Provide manual visual validation checklist: exact steps to load the extension in Chrome unpacked, what to verify in dark theme popup, light theme popup, and reorganized options page
  - [x] 10.9 List all files altered or created during implementation
  - [x] 10.10 Generate commit proposal without executing: `style(ui): align Quick Search visual design with Ominara mock`
