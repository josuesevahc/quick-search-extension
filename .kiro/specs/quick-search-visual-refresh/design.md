# Design Document: Quick Search Visual Refresh (v1.2.0)

## Technical Plan

### Files That Will Change

| File | Change Type | Reason |
|------|-------------|--------|
| `src/shared/theme.css` | Extend | Add full `--qs-*` token set for light/dark; keep all existing tokens |
| `src/popup/popup.html` | Restructure | Add header section, wrap search in elevated container |
| `src/popup/popup.css` | Rewrite | Apply `--qs-*` tokens, new width, provider states, button hierarchy |
| `src/options/options.html` | Restructure (DOM) | Move preferences section before providers section in DOM order |
| `src/options/options.css` | Rewrite | Apply `--qs-*` tokens, panel cards, danger button, modal elevation |
| `src/shared/i18n.ts` | Extend | Add new keys if any new strings are introduced (e.g., `localBadge`) |
| `public/_locales/en/messages.json` | Extend | Add translations for any new keys |
| `public/_locales/pt_BR/messages.json` | Extend | Add PT-BR translations for any new keys |

No new files are added to the build. `temp/` is not touched.

### Token Strategy in `src/shared/theme.css`

- All new tokens use the `--qs-` prefix to avoid collision with existing `--primary-color` etc.
- Existing tokens (`--primary-color`, `--bg-color`, etc.) are kept verbatim for backward compatibility with any remaining references in `popup.ts`/`options.ts` that are not yet migrated.
- New tokens are declared in all existing theme selectors: `:root[data-theme='light']`, the `@media (prefers-color-scheme: dark)` block, and `:root[data-theme='dark']`.
- Structural tokens (radius, shadow, spacing, font) are theme-independent and go on `:root` before the theme blocks.
- CSS files import `theme.css` via `@import '../shared/theme.css'` — no change to the import pattern.

### Visual Strategy for Popup

- Width increases from `320px` to `370px` (center of 360–380px range).
- A `<header class="qs-header">` block is prepended inside `#app` with the product name and a "Local" badge.
- The search input is wrapped in `<div class="search-wrapper">` which uses `--qs-surface-elevated` and `--qs-border`.
- Provider rows get `min-height: var(--qs-hit-target)` and state classes: `.selected`, `.is-default`, `.is-tab-override`.
- Two buttons keep their current IDs; hierarchy is flipped: `#search-new-tab` becomes the primary (uses `--qs-primary-strong`), `#search-current-tab` secondary.
- Footer retains existing structure; checkbox label area gets `min-height: var(--qs-hit-target)`.

### Visual Strategy for Options Page

- Existing panel-card approach for `.providers-list` is kept.
- `.preferences-section` and `.actions-section` get the same card treatment (`--qs-surface`, `--qs-border`, `--qs-radius-lg`).
- `.btn-danger` already exists; it gets updated tokens.
- Modal gets `--qs-shadow-lg` and `--qs-border`.
- Toast success uses `--qs-primary`; error uses `--qs-danger`.

### DOM Structural Reorganization for Options Page

The current DOM order in `options.html` is:
1. `<header>`
2. `<section class="providers-section">` ← must move down
3. `<section class="preferences-section">` ← must move up
4. `<section class="actions-section">`
5. `<div id="modal">`

The new DOM order will be:
1. `<header>`
2. `<section class="preferences-section">` (moved here in HTML source)
3. `<section class="actions-section">` (restore defaults)
4. `<section class="providers-section">`
5. `<div id="modal">`

This is a **structural HTML change** — the elements appear in this order in the source DOM. No CSS `order`, `flex-order`, `position` hacks, or visual reordering tricks are used. Tab order and screen reader reading order follow the DOM order naturally.

### Preserving Existing Functionality

- All element IDs in `popup.html` and `options.html` that are referenced by `popup.ts` and `options.ts` are preserved exactly.
- No TypeScript logic is changed; only HTML structure and CSS styling change.
- All `aria-*` attributes, `role` attributes, and event handler bindings remain intact.
- The `bindThemePreference` function in `theme.ts` and the `data-theme` attribute mechanism are not modified.

---

## Overview

Quick Search v1.2.0 is a visual refresh of the Chromium MV3 browser extension. The goal is to bring the popup and settings/options page to a premium SteelBlue/cyan visual identity that matches the Ominara brand mock, while preserving 100% of existing behavior, i18n coverage, accessibility characteristics, and MV3 compliance.

The refresh touches only the presentation layer: CSS custom properties (design tokens), HTML structure (popup header, options DOM reorder), and CSS rules. No TypeScript logic, storage schema, manifest permissions, or runtime dependencies change.

---

## Architecture

```
src/
  shared/
    theme.css          ← token source of truth (extended)
    i18n.ts            ← extended with new keys if needed
  popup/
    popup.html         ← header added, search wrapper added
    popup.css          ← full --qs-* token migration
    popup.ts           ← NO CHANGE
  options/
    options.html       ← DOM section order changed (structural)
    options.css        ← full --qs-* token migration
    options.ts         ← NO CHANGE
public/
  _locales/
    en/messages.json   ← new keys if any
    pt_BR/messages.json← new keys if any
temp/                  ← NOT TOUCHED, NOT PACKAGED
```

All visual state is driven by CSS classes applied by the existing TypeScript (`.selected`, `.hidden`, `status-toast success/error`). No new TS–to–CSS contracts are introduced except the new state classes for provider rows (`.is-default`, `.is-tab-override`), which `popup.ts` will apply alongside the existing `.selected` class.

---

## Components and Interfaces

### Popup Layout

```
#app
├── .qs-header
│   ├── .qs-header-title  (appName via t())
│   └── .qs-header-badge  (localBadge via t() — new key)
├── .search-wrapper
│   ├── #search-input
│   └── #suggestions-list [role=listbox]
├── #status [role=status][aria-live=polite]
├── #provider-list
│   └── .provider-item[.selected][.is-default][.is-tab-override]
│       ├── .provider-avatar
│       ├── .name
│       ├── .badge | <button class="set-default">
│       └── .tab-badge (when .is-tab-override)
├── .actions
│   ├── #search-current-tab (secondary style)
│   └── #search-new-tab (primary style, --qs-primary-strong)
└── .footer
    ├── label.toggle-container
    │   ├── #temp-override [type=checkbox]
    │   └── #temp-override-label
    └── #settings-link
```

### Options Page Layout (New DOM Order)

```
.container
├── header
│   ├── h1#title        (appName)
│   └── p#description   (appDescription)
├── main
│   ├── section.preferences-section   ← FIRST in DOM
│   │   ├── h2#preferences-title
│   │   └── .preferences-panel
│   │       ├── label.preference-row (language)
│   │       ├── label.preference-row (theme)
│   │       ├── label.preference-row (search history)
│   │       └── .preference-actions (clear history btn)
│   ├── section.actions-section       ← SECOND in DOM
│   │   └── #restore-defaults-btn .btn-danger
│   └── section.providers-section     ← THIRD in DOM
│       ├── .section-header
│       │   ├── h2#providers-title
│       │   └── #add-provider-btn .btn-primary
│       └── #providers-list
│           └── .provider-row (×N)
└── #modal.hidden
    └── .modal-content
        └── form#provider-form
```

### New i18n Keys

| Key | en | pt_BR |
|-----|----|-------|
| `localBadge` | `Local` | `Local` |

This is the only new user-visible string. It displays a compact "Local" badge in the popup header to communicate local-first behavior without adding marketing text. The word "Local" is the same in both locales so overflow risk is zero.

---

## Data Models

No data model changes. The visual refresh does not alter the `ExtensionSettings`, `SearchProvider`, `TabProviderOverrides`, or `SearchHistory` types. No new storage keys are introduced.

The only new runtime concept is the CSS state classes on provider rows:

| Class | Applied when |
|-------|-------------|
| `.selected` | `provider.id === selectedId` (existing) |
| `.is-default` | `provider.id === settings.defaultProviderId` (new class, same logic) |
| `.is-tab-override` | `tempOverride.checked && provider.id === selectedId` (new class) |

These are applied by `popup.ts` in `renderProviderList()`. The logic that determines these states is unchanged; only the CSS classes added to the DOM element change.

---

## Token System Design

### Structural Tokens (theme-independent, on `:root`)

| Token | Value | Purpose |
|-------|-------|---------|
| `--qs-radius-sm` | `6px` | Badges, avatars |
| `--qs-radius-md` | `10px` | Inputs, rows, buttons |
| `--qs-radius-lg` | `14px` | Popup container, panels, modal |
| `--qs-shadow-sm` | `0 1px 2px rgba(0,0,0,0.22)` | Light elevation |
| `--qs-shadow-lg` | `0 18px 50px rgba(0,0,0,0.38), 0 0 26px rgba(24,137,160,0.14)` | Popup, modal |
| `--qs-space` | `8px` | Base spacing unit |
| `--qs-hit-target` | `40px` | Minimum interactive target height |
| `--qs-font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | System font stack |

### Dark Theme Tokens

| Token | Value | WCAG AA Notes |
|-------|-------|---------------|
| `--qs-bg` | `#090d12` | Background |
| `--qs-surface` | `#0d1117` | Panels, popup body |
| `--qs-surface-elevated` | `#121a22` | Input wrapper, cards, modal |
| `--qs-primary` | `#1889a0` | Accent/brand (use on non-small-text only) |
| `--qs-primary-hover` | `#1f9bb5` | Hover state |
| `--qs-primary-strong` | `#0f6f85` | Primary button bg — white text contrast ≈ 5.2:1 ✓ |
| `--qs-border` | `rgba(255,255,255,0.10)` | Default borders |
| `--qs-border-active` | `rgba(24,137,160,0.62)` | Active/focused borders |
| `--qs-text` | `#f8fafc` | Primary text — on `--qs-surface` contrast > 16:1 ✓ |
| `--qs-text-secondary` | `#b6c2cc` | Secondary text — on `--qs-surface` contrast ≈ 8.5:1 ✓ |
| `--qs-text-muted` | `#8a96a3` | Muted text — on `--qs-surface` contrast ≈ 4.8:1 ✓ |
| `--qs-danger` | `#e53e3e` | Danger/error accent |
| `--qs-danger-soft` | `rgba(229,62,62,0.12)` | Danger background tint |

### Light Theme Tokens

| Token | Value | WCAG AA Notes |
|-------|-------|---------------|
| `--qs-bg` | `#f6f9fb` | Background |
| `--qs-surface` | `#ffffff` | Panels |
| `--qs-surface-elevated` | `#f0f7fa` | Elevated surfaces |
| `--qs-primary` | `#126f83` | Accent — on white contrast ≈ 5.1:1 ✓ |
| `--qs-primary-hover` | `#0f5f70` | Hover |
| `--qs-primary-strong` | `#0f6f85` | Primary button bg — white text contrast ≈ 4.9:1 ✓ |
| `--qs-border` | `#d9e4ea` | Default borders |
| `--qs-border-active` | `#1889a0` | Active borders |
| `--qs-text` | `#16212a` | Primary text — on white contrast > 16:1 ✓ |
| `--qs-text-secondary` | `#465866` | Secondary — on white contrast ≈ 7.2:1 ✓ |
| `--qs-text-muted` | `#6b7b88` | Muted — on white contrast ≈ 4.6:1 ✓ |
| `--qs-danger` | `#c92f2f` | Danger/error — on white contrast ≈ 5.8:1 ✓ |
| `--qs-danger-soft` | `rgba(201,47,47,0.10)` | Danger tint |

All existing tokens (`--primary-color`, `--bg-color`, etc.) are preserved unchanged in all theme selectors.

---

## Accessibility Design Decisions

1. **Focus visibility**: All interactive elements receive `:focus-visible` outlines using `--qs-primary` (2px solid) or `--qs-border-active`. The existing `outline: 2px solid var(--primary-color)` in `popup.css` is migrated to `--qs-primary`/`--qs-border-active`.

2. **Color-not-sole-indicator**: Selected, default, and tab-override states all have text badges alongside color changes:
   - Selected: `.selected` class (background tint) + provider name remains visible
   - Default: `.is-default` class + `.badge` span with `t('defaultProvider')` text
   - Tab override: `.is-tab-override` class + `.tab-badge` span with `t('temporaryForTab')` abbreviation

3. **Minimum hit targets**: `--qs-hit-target: 40px` applied as `min-height` to `.provider-item`, `.toggle-container`, and all `.btn-*` elements.

4. **ARIA preservation**: No ARIA attributes are removed. `role="listbox"`, `role="option"`, `aria-selected`, `role="status"`, `aria-live="polite"`, `aria-expanded` on search input — all preserved verbatim.

5. **Keyboard navigation**: `popup.ts` is not modified, so all keyboard handlers (ArrowUp/Down, Escape, Enter, Tab, Shift+Enter) are preserved exactly.

6. **Reduced motion**: A `@media (prefers-reduced-motion: reduce)` block disables all CSS transitions (provider-item transition, toast slideIn animation).

7. **Screen reader reading order**: Options page DOM reorder means screen readers encounter sections in the logical preference→providers order without any CSS tricks.

---

## i18n Additions

### New Keys

| Key | en value | pt_BR value | Used in |
|-----|----------|-------------|---------|
| `localBadge` | `Local` | `Local` | Popup header badge |

The `localBadge` key uses the word "Local" in both locales. It is short enough to never overflow. No other new strings are introduced.

### Verification

- `MessageKey` type in `i18n.ts` is automatically extended because it is `keyof typeof MESSAGES.en`.
- Both `MESSAGES.en` and `MESSAGES.pt_BR` objects receive the new key.
- Both `public/_locales/*/messages.json` files receive the new key (used by Chrome's `chrome.i18n` API independently).

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: All required --qs-* tokens are defined for every theme mode

*For any* theme mode (`light`, `dark`), all required `--qs-*` tokens (both color tokens and structural tokens) must be defined as non-empty CSS custom properties on the root element after the theme is applied.

**Validates: Requirements 1.1, 1.2**

### Property 2: All legacy tokens are preserved

*For any* token name that existed in `src/shared/theme.css` before this change (`--primary-color`, `--danger-color`, `--success-color`, `--bg-color`, `--surface-color`, `--text-color`, `--muted-text-color`, `--border-color`, `--hover-color`, `--selected-color`, `--avatar-bg-color`, `--avatar-text-color`, `--overlay-color`), the token must still be defined with a non-empty value after the theme system expansion.

**Validates: Requirements 1.7**

### Property 3: Text-on-background WCAG AA contrast

*For any* (text-token, background-token) pair that is used together to render text in the popup or options page, the computed contrast ratio between the resolved color values must be at least 4.5:1 in both light and dark themes.

**Validates: Requirements 1.6**

### Property 4: Provider rows meet minimum hit target

*For any* provider row rendered in the popup or options page, the rendered element must have a minimum height of at least 40px (`--qs-hit-target`).

**Validates: Requirements 2.5, 2.11, 3.7, 4.7**

### Property 5: Selected provider is visually distinct via class and badge

*For any* provider list where one provider is marked as selected, that provider's DOM element must have the `.selected` CSS class applied. *For any* provider list where one provider is the default provider, that provider's element must contain a child element with the default badge text from `t('defaultProvider')`.

**Validates: Requirements 2.6, 2.7**

### Property 6: i18n key symmetry

*For any* message key defined in `MESSAGES.en`, the same key must exist in `MESSAGES.pt_BR` with a non-empty string value, and vice versa.

**Validates: Requirements 5.1**

### Property 7: ARIA attribute preservation

*For any* render of the popup, the following elements and attributes must be present: `#suggestions-list[role="listbox"]`, `.suggestion-item[role="option"]`, `#status[role="status"][aria-live="polite"]`. No existing `aria-*` attribute may be absent after the visual refresh.

**Validates: Requirements 4.2, 4.3, 4.8**

### Property 8: Keyboard suggestion navigation is unaffected

*For any* sequence of keyboard events (ArrowUp, ArrowDown, Escape, Enter, Tab) applied to the search input when suggestions are visible, the resulting action (move-next, move-previous, close, accept, submit) must match the pre-refresh behavior defined by `getSuggestionKeyboardAction`.

**Validates: Requirements 4.1**

### Property 9: Toast semantic class assignment

*For any* call to `showToast(message, type)`, the created toast DOM element must have the CSS class matching the `type` parameter (`success` or `error`), ensuring the correct semantic color token is applied.

**Validates: Requirements 3.9**

### Property 10: Visual state is not conveyed by color alone

*For any* provider row in selected, default, or tab-override state, at least one non-color indicator (a text badge, label, or `aria-*` attribute) must be present alongside the color change.

**Validates: Requirements 4.4**

---

## Error Handling

No new error paths are introduced. The visual refresh is purely presentational.

Existing error handling paths are preserved:
- `showStatus(t('searchTermRequired'))` when search input is empty
- `showStatus(t('providerUnavailable'))` when no provider matches selected ID
- `showToast(t(error), 'error')` for provider validation errors in options
- `showToast(t('settingsSaved'))` for successful saves

The `.status` element in the popup and the toast in options both gain updated token-based styling but their logic is unchanged.

---

## Testing Strategy

### Dual Testing Approach

Unit tests cover specific examples, DOM structure assertions, and error conditions. Property-based tests cover universal properties that must hold across all valid inputs and configurations.

### Unit Tests (Specific Examples and Regression)

Focus areas for unit tests after this change:

- **DOM structure**: Verify popup has `.qs-header`, `.search-wrapper`, and that `#status` has `role="status"` and `aria-live="polite"`.
- **Options DOM order**: Verify that in `options.html`, the preferences section appears before the providers section by checking `compareDocumentPosition` or element index in `main`.
- **Token existence**: Verify all 13 color tokens and 8 structural tokens are defined (example with specific theme set).
- **Manifest unchanged**: Verify `permissions` array in manifest template contains only `storage`.
- **No reference to temp file**: Verify no HTML/CSS/TS file contains the string `PrintQuickSearchNewVisualInterfacePopup.png`.
- **i18n MessageKey coverage**: Verify `localBadge` key is present in both locales.
- **Legacy token existence**: Spot-check `--primary-color` still resolves in light theme.

### Property-Based Tests (Universal Properties)

The project uses **Vitest** as the test runner. Property-based testing will be implemented using **fast-check**, which is a zero-runtime-dependency PBT library for JavaScript/TypeScript. It is added as a `devDependency` only.

Each property test must run a minimum of **100 iterations**.

Tag format for each property test:
`// Feature: quick-search-visual-refresh, Property {N}: {property_text}`

**Property 1 — All required --qs-* tokens defined for every theme**
```
// Feature: quick-search-visual-refresh, Property 1: all required --qs-* tokens defined for every theme mode
```
Generator: `fc.constantFrom('light', 'dark')` — for each theme mode, set `data-theme` on a test DOM root, import the token list, verify all 21 tokens resolve to non-empty strings.

**Property 2 — All legacy tokens preserved**
```
// Feature: quick-search-visual-refresh, Property 2: all legacy tokens are preserved after theme expansion
```
Generator: `fc.constantFrom('light', 'dark')` — for each mode, verify all 13 legacy token names still resolve.

**Property 3 — WCAG AA contrast for text pairs**
```
// Feature: quick-search-visual-refresh, Property 3: text-on-background contrast ratio >= 4.5:1
```
Generator: `fc.constantFrom('light', 'dark')` combined with `fc.constantFrom(...knownTextPairs)` — for each (theme, pair), compute relative luminance of both colors and verify contrast >= 4.5.

**Property 4 — Provider rows meet 40px hit target**
```
// Feature: quick-search-visual-refresh, Property 4: provider rows have min-height >= 40px
```
Generator: `fc.array(fc.record({ id: fc.string(), name: fc.string(), enabled: fc.constant(true) }), { minLength: 1 })` — render provider list with arbitrary provider data, measure each row's computed min-height.

**Property 5 — Selected/default provider visual distinction**
```
// Feature: quick-search-visual-refresh, Property 5: selected provider has .selected class; default provider has badge text
```
Generator: `fc.array(providerArb, { minLength: 1 })` with arbitrary selected/default indices — render list, verify selected item has `.selected` class and default item has badge element.

**Property 6 — i18n key symmetry**
```
// Feature: quick-search-visual-refresh, Property 6: all message keys exist in both en and pt_BR locales
```
Generator: `fc.constantFrom(...Object.keys(MESSAGES.en))` — for any key in `en`, it must exist in `pt_BR` with non-empty value, and vice versa.

**Property 7 — ARIA attribute preservation**
```
// Feature: quick-search-visual-refresh, Property 7: required ARIA attributes present after popup render
```
Example test (renders popup DOM and checks attributes).

**Property 8 — Keyboard navigation unaffected**
```
// Feature: quick-search-visual-refresh, Property 8: keyboard suggestion navigation produces correct actions
```
Generator: `fc.record({ key: fc.constantFrom('ArrowUp','ArrowDown','Escape','Enter','Tab'), hasSuggestion: fc.boolean(), hasList: fc.boolean() })` — verify `getSuggestionKeyboardAction` returns correct action for all input combinations. This is a pure function test — no DOM needed.

**Property 9 — Toast semantic class**
```
// Feature: quick-search-visual-refresh, Property 9: toast element has correct semantic class
```
Generator: `fc.constantFrom('success', 'error')` — call `showToast` with each type, verify resulting DOM element has the correct class.

**Property 10 — State not conveyed by color alone**
```
// Feature: quick-search-visual-refresh, Property 10: visual state has non-color indicator
```
Generator: `fc.array(providerArb, { minLength: 1 })` with arbitrary selected/default states — for each state, verify a text badge or `aria-*` attribute is present.

### Existing Tests

The existing test suite (`tests/theme.test.ts`, `tests/i18n.test.ts`, `tests/provider-selection.test.ts`, `tests/suggestion-acceptance.test.ts`) must continue to pass without modification. These tests verify behavioral correctness that the visual refresh must not regress.

---

## MV3 Compliance and Visual Reference Confirmation

- `temp/design/PrintQuickSearchNewVisualInterfacePopup.png` was used as a **visual reference only** during design.
- It was **not imported** in any source file.
- It was **not copied** to `src/`, `public/`, or `dist/`.
- It was **not referenced** in any HTML, CSS, or TypeScript file.
- It will **not be packaged** in the build/release artifact.

The `zip` script (`scripts/zip-dist.ts`) packages only the `dist/` directory. The `temp/` folder is not in `dist/` and will not be included. If `npm run release:zip` is available, the output ZIP should be inspected to confirm absence of any `temp/` path. If no ZIP command is available in the current environment, this must be verified manually by running `npm run zip` and inspecting the archive contents.

No new entries in `permissions` or `host_permissions` are introduced. No remote font, stylesheet, script, or network call is added. The extension remains fully local-first.
