# Requirements Document

## Introduction

This feature implements a visual refresh of the Quick Search Chromium MV3 extension for version 1.2.0. The goal is to bring the popup and settings/options page closer to the Ominara visual mock using SteelBlue/cyan as the primary identity color, a premium deep dark theme, elevated surfaces, consistent spacing and radius, and better state differentiation — while preserving 100% of existing functionality, all i18n support, local-first behavior, and MV3 compliance.

A single structural change is also included: extra options and general preferences are moved to the top of the settings page, above the long list of search engines, to improve usability.

No new runtime dependencies, remote assets, network calls, tracking, or manifest permissions are introduced.

Visual reference used: `temp/design/PrintQuickSearchNewVisualInterfacePopup.png` (reference only — not packaged as a runtime asset).

---

## Glossary

- **Extension**: The Quick Search Chromium MV3 browser extension.
- **Popup**: The compact browser action popup rendered by `src/popup/popup.html`.
- **Options_Page**: The full settings page rendered by `src/options/options.html`.
- **Theme_System**: The CSS custom property system in `src/shared/theme.css` that provides design tokens for light, dark, and system color schemes.
- **Token**: A CSS custom property (variable) that represents a reusable design value (color, radius, shadow, spacing).
- **Provider**: A configured search engine entry with a name, URL template, enabled state, and optional default/built-in flag.
- **Selected_Provider**: The provider currently chosen to execute the next search in the Popup.
- **Default_Provider**: The provider marked as the persistent default via `defaultProviderId` in storage.
- **Tab_Override**: A per-tab temporary provider selection stored in `tabProviderOverrides`.
- **Suggestion**: A local search history entry shown in the autocomplete list under the search field.
- **i18n_System**: The combination of `src/shared/i18n.ts` and `public/_locales/*/messages.json` that provides all user-facing strings in English and Portuguese (Brazil).
- **WCAG_AA**: Web Content Accessibility Guidelines Level AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text and UI components).
- **MV3**: Manifest Version 3, the Chromium extension platform this extension targets.

---

## Requirements

### Requirement 1: Expand Design Token System

**User Story:** As a developer maintaining the extension, I want a comprehensive set of CSS design tokens in `src/shared/theme.css`, so that all visual changes across Popup and Options_Page are driven by a single consistent source of truth.

#### Acceptance Criteria

1. THE Theme_System SHALL define the following tokens for both light and dark themes: `--qs-bg`, `--qs-surface`, `--qs-surface-elevated`, `--qs-primary`, `--qs-primary-hover`, `--qs-primary-strong`, `--qs-border`, `--qs-border-active`, `--qs-text`, `--qs-text-secondary`, `--qs-text-muted`, `--qs-danger`, `--qs-danger-soft`.
2. THE Theme_System SHALL define the following theme-independent structural tokens: `--qs-radius-sm`, `--qs-radius-md`, `--qs-radius-lg`, `--qs-shadow-sm`, `--qs-shadow-lg`, `--qs-space`, `--qs-hit-target`, `--qs-font-sans`.
3. WHEN the `data-theme` attribute is set to `dark` or resolved to dark via `system`, THE Theme_System SHALL apply a deep dark palette where `--qs-bg` is approximately `#090d12` and `--qs-primary` is `#1889a0`.
4. WHEN the `data-theme` attribute is set to `light` or resolved to light via `system`, THE Theme_System SHALL apply a light palette where `--qs-primary` is `#126f83` or darker to ensure WCAG_AA contrast on white surfaces.
5. THE Theme_System SHALL preserve support for `prefers-color-scheme` via the existing `system` theme resolution path.
6. FOR ALL token pairs used as text-on-background, THE Theme_System SHALL produce a contrast ratio of at least 4.5:1 (WCAG_AA normal text).
7. THE Theme_System SHALL NOT remove or rename any previously existing token used by popup.ts or options.ts (backward compatibility).

---

### Requirement 2: Popup Visual Refresh

**User Story:** As a user opening the Quick Search Popup, I want a visually premium, compact interface that clearly communicates the selected provider, default provider, and temporary tab mode, so that I can search efficiently without confusion.

#### Acceptance Criteria

1. THE Popup SHALL render at a width between 360px and 380px.
2. THE Popup SHALL include a compact header area that displays the product name using the existing `appName` i18n key and a small status badge using the existing `appDescription` i18n key or a new key routed through the i18n_System.
3. THE Popup SHALL render the search field inside an elevated surface container visually distinct from the background, using `--qs-surface-elevated` and `--qs-border`.
4. WHEN local Suggestion items are displayed, THE Popup SHALL render each Suggestion with a highlighted visual treatment using `--qs-primary` as accent, clearly distinguishable from the list background.
5. THE Popup SHALL render each Provider row with a minimum height of 40px and a hover state using `--qs-surface-elevated` and `--qs-border`.
6. WHEN a Provider is the Selected_Provider, THE Popup SHALL visually distinguish it using a background from `--qs-primary` at low opacity and a border using `--qs-border-active`.
7. WHEN a Provider is the Default_Provider, THE Popup SHALL display a badge using the existing `defaultProvider` i18n key, visually distinct from the selected state badge.
8. WHEN Tab_Override is active, THE Popup SHALL visually indicate the temporary state on the provider row or checkbox label, distinguishable from both the Selected_Provider and Default_Provider states.
9. THE Popup SHALL render two action buttons with clear visual hierarchy: the primary action (`searchNewTab`) SHALL use `--qs-primary-strong` as background, and the secondary action (`searchCurrentTab`) SHALL use a surface-level style.
10. THE Popup SHALL render a footer with the temporary override checkbox and settings link, separated from the action buttons by a border.
11. WHEN the temporary override checkbox is displayed, THE Popup SHALL provide a clickable target area of at least 40px height.
12. ALL interactive elements in the Popup (input, suggestions, provider rows, buttons, checkbox, settings link) SHALL have a visible `:focus-visible` outline using `--qs-primary` or `--qs-border-active`.
13. THE Popup SHALL preserve the `aria-live` region for status messages.
14. THE Popup SHALL NOT add new user-visible text strings outside the i18n_System.
15. THE Popup SHALL NOT introduce any new runtime dependencies or remote assets.

---

### Requirement 3: Options Page Visual Refresh and Reorganization

**User Story:** As a user configuring the extension on the Options_Page, I want general preferences and extra options at the top of the page with the provider list below, so that important settings are not buried under a long list of search engines.

#### Acceptance Criteria

1. THE Options_Page SHALL render the Preferences section (language, theme, local history, clear history, restore defaults) before the providers list section in the visual and DOM order.
2. THE Options_Page SHALL render the providers list section after the preferences section.
3. THE Options_Page SHALL render a strong header with the product name and description using the existing `appName` and `appDescription` i18n keys.
4. THE Options_Page SHALL render each section (preferences, providers) inside a panel or card element using `--qs-surface` background, `--qs-border` border, and `--qs-radius-lg` radius.
5. THE Options_Page SHALL render each Provider row with hover and focus states using `--qs-surface-elevated` and `--qs-border`.
6. THE Options_Page SHALL render the restore-defaults button with a style using `--qs-danger` for border and text color, indicating a destructive action.
7. THE Options_Page SHALL render the provider edit/remove controls as compact buttons with a minimum hit target of 40px.
8. THE Options_Page SHALL render the modal with elevated shadow using `--qs-shadow-lg` and a border using `--qs-border`.
9. WHEN a save or error toast is displayed, THE Options_Page SHALL show it with the appropriate semantic color (`--qs-primary` for success, `--qs-danger` for error).
10. ALL interactive elements in the Options_Page (selects, checkboxes, buttons, inputs, provider rows) SHALL have a visible `:focus-visible` outline.
11. THE Options_Page SHALL preserve the logical reading order: header → preferences → provider list → modal (when open).
12. THE Options_Page SHALL NOT change the meaning, behavior, or storage schema of any existing preference.
13. THE Options_Page SHALL NOT add new user-visible text strings outside the i18n_System.
14. THE Options_Page SHALL NOT introduce any new runtime dependencies or remote assets.

---

### Requirement 4: Accessibility Compliance

**User Story:** As a user who relies on keyboard navigation or assistive technologies, I want the refreshed Popup and Options_Page to remain fully accessible, so that the visual improvements do not regress my ability to use the extension.

#### Acceptance Criteria

1. THE Popup SHALL preserve all existing keyboard navigation behaviors for Suggestions (ArrowUp, ArrowDown, Escape, Enter, Tab) without modification.
2. THE Popup SHALL preserve the `role="listbox"` and `role="option"` ARIA attributes on the suggestions container and items.
3. THE Popup SHALL preserve the `role="status"` and `aria-live="polite"` attributes on the status element.
4. WHEN visual states are used to indicate Selected_Provider, Default_Provider, or Tab_Override, THE Extension SHALL NOT rely solely on color to convey that information — badges or text labels SHALL also be present.
5. THE Extension SHALL respect `prefers-reduced-motion` by limiting or removing CSS transitions when the user has requested reduced motion.
6. THE Extension SHALL preserve `prefers-color-scheme` behavior through the existing system theme resolution path.
7. FOR ALL new or modified interactive elements, THE Extension SHALL maintain a minimum clickable target of 40px in height.
8. THE Extension SHALL NOT remove or degrade any existing `aria-*` attribute or keyboard event handler.

---

### Requirement 5: i18n and Text Integrity

**User Story:** As a user with English or Portuguese (Brazil) as their language preference, I want all interface text to remain correctly translated and properly laid out in both languages after the visual refresh, so that no text overflows or becomes unreadable.

#### Acceptance Criteria

1. THE i18n_System SHALL provide translations for any new user-visible string introduced by the visual refresh in both the `en` and `pt_BR` locales.
2. WHEN the Popup renders with the `pt_BR` locale, THE Popup SHALL NOT overflow its 360–380px container for any existing or new translated string.
3. WHEN the Options_Page renders with the `pt_BR` locale, THE Options_Page SHALL NOT truncate or hide any preference label or button text.
4. THE Extension SHALL NOT hardcode any user-visible string outside of `src/shared/i18n.ts` and `public/_locales/*/messages.json`.
5. THE i18n_System SHALL continue to export the `MessageKey` type as a union of all message keys, including any newly added keys.

---

### Requirement 6: MV3 Compliance and Security Constraints

**User Story:** As an extension author submitting to the Chrome Web Store, I want the visual refresh to introduce no new permissions, remote resources, or security risks, so that the extension continues to comply with MV3 policies and our local-first privacy commitment.

#### Acceptance Criteria

1. THE Extension SHALL NOT add any new entry to the `permissions` or `host_permissions` arrays in the manifest.
2. THE Extension SHALL NOT load any remote font, remote stylesheet, or remote script at runtime.
3. THE Extension SHALL NOT make any network call for the purpose of visual rendering (no remote autocomplete, no tracking pixel, no analytics).
4. THE Extension SHALL NOT package the visual reference file `temp/design/PrintQuickSearchNewVisualInterfacePopup.png` in the build output.
5. THE Extension SHALL NOT reference the visual reference file in any HTML, CSS, or TypeScript source file that is part of the build.
6. THE Extension build (`npm run build`) SHALL complete without errors after the visual refresh changes.
7. THE Extension linter (`npm run lint`) SHALL report no new errors introduced by the visual refresh changes.
8. THE Extension test suite (`npm test`) SHALL pass without failures caused by the visual refresh changes.
