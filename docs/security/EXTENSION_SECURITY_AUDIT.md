# Extension Security Audit

Audit date: 2026-06-14

Scope: source files, Manifest V3 template, generated `dist/` output, dependency lockfile, existing release ZIP path, and Chrome Web Store release posture for Quick Search 1.0.0.

References reviewed:

- Chrome Web Store Program Policies: https://developer.chrome.com/docs/webstore/program-policies/policies
- Chrome Web Store quality guidelines FAQ for search settings: https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines-faq
- Manifest V3 security guidance: https://developer.chrome.com/docs/extensions/develop/migrate/improve-security
- Manifest V3 overview: https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3
- Chrome Web Store privacy fields: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Chrome tabs API permissions: https://developer.chrome.com/docs/extensions/reference/api/tabs

## Executive Summary

Quick Search is suitable for a low-risk first release path if it remains a popup-only, user-initiated search launcher.

The extension uses Manifest V3, has no host permissions, does not inject content scripts, does not use remote hosted code, and does not override Chrome search settings or the New Tab Page.

One permission reduction was made during this audit: the `tabs` permission was removed. The extension still uses the Tabs API for user-triggered tab navigation and tab-ID cleanup, but it does not read sensitive tab properties such as URL, title, favicon, or pending URL.

## Manifest V3 Compliance

Status: Pass.

Manifest characteristics:

- `manifest_version`: 3
- Background script: service worker at `background.js`
- Extension UI: action popup and options page
- Host permissions: none
- Content scripts: none
- Settings overrides: none
- Chrome URL overrides: none
- Omnibox keyword: none
- Remote code permissions: none

The manifest does not include a custom `content_security_policy`. Chrome's default Manifest V3 extension CSP applies. The project does not require looser CSP settings.

## Permissions Review

Current permissions:

| Permission | Status | Justification |
| --- | --- | --- |
| `storage` | Required | Stores user-facing settings in `chrome.storage.local`: enabled providers, custom provider templates, internal default provider, and temporary per-tab provider preferences. |

Current host permissions:

| Permission | Status | Justification |
| --- | --- | --- |
| none | Correct | The extension does not read or modify website content and does not need origin access. |

Removed during audit:

| Permission | Reason |
| --- | --- |
| `tabs` | Not required because Quick Search does not read sensitive tab properties. Chrome's Tabs API allows common tab actions such as creating tabs and navigating tabs without the `tabs` permission. |

Permissions not recommended for v1:

- `activeTab`: not needed because the extension does not inject scripts, inspect the active page, or need temporary host access.
- `scripting`: not needed because the extension does not inject code.
- Host permissions: not needed because provider searches are opened by navigation, not by fetching or reading search result pages.
- `declarativeNetRequest` or `webRequest`: not needed and would create unnecessary search-redirect policy risk.
- `searchProvider`, `chrome_settings_overrides`, or New Tab overrides: not needed and should be excluded from v1.

## Remote Hosted Code and Dynamic Execution

Status: Pass.

Findings:

- No remote script loading was found.
- No `eval`, `new Function`, `importScripts`, or dynamic script execution was found.
- HTML files load bundled local module scripts only.
- Built JavaScript is emitted into `dist/assets/` and `dist/background.js`.
- Built-in provider URLs are navigation targets, not executable code.

## CSP Review

Status: Pass.

The manifest does not define a custom CSP. This avoids accidentally allowing unsupported Manifest V3 CSP values such as remote script sources, `'unsafe-eval'`, or `'unsafe-inline'`.

If a CSP is added later, use a Manifest V3 object form such as:

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

Do not add remote script hosts, `'unsafe-eval'`, or broad network allowances.

## Secrets and Sensitive Strings

Status: Pass.

The audit scan did not find committed secrets, credentials, tokens, private keys, OAuth client secrets, CRX private keys, `.env` files, generated signing keys, hardcoded local absolute paths, or test-only URLs in extension runtime files.

The repository intentionally includes public project metadata such as GitHub URLs in `package.json` and README files.

## Dependency Vulnerability Review

Status: Pass.

Commands run:

```powershell
npm audit
npm audit --omit=dev
```

Result: 0 known vulnerabilities reported.

All dependencies are development dependencies used for building, linting, testing, and icon generation. No npm package is bundled as a runtime dependency via `dependencies`.

## Build Output and Packaging

Status: Pass after release-script hardening.

Generated package root: `dist/`

Expected files:

- `manifest.json`
- `background.js`
- `src/popup/popup.html`
- `src/options/options.html`
- bundled CSS and JS under `assets/`
- icons under `icons/`

Development-only files must not be included in the Chrome Web Store ZIP:

- `.git`
- `.env` and `.env.*`
- `.pem`, `.key`, `.map`
- `node_modules`
- `tests`, `docs`, coverage, Playwright reports
- TypeScript source files and config files
- local editor configuration

The release scripts in `scripts/release/` enforce these checks before producing a ZIP under `release/`.

## Data Handling

Status: Acceptable with clear disclosure.

Data stored locally:

- Provider list and enabled/disabled state
- Custom provider names and HTTPS search URL templates
- Internal default provider ID
- Temporary tab provider override by numeric tab ID

Data processed during use:

- Search terms typed into the extension popup

Data transmission:

- When the user submits a search, the extension builds the selected provider URL and opens it in the current tab or a new tab.
- The selected search provider receives the query as part of normal web navigation.
- The extension developer does not receive search terms or settings.

Data not accessed:

- Page content
- Browsing history
- Cookies
- Bookmarks
- Form data
- Account identity
- Location
- Financial, health, or authentication data

Chrome storage is used only for user-facing extension settings.

## Search Behavior and Policy Review

Status: Low risk if v1 remains popup-only.

The extension does not:

- Change Chrome's default search provider
- Override Chrome search settings
- Override the New Tab Page
- Register an omnibox keyword
- Intercept or redirect browser searches
- Use `webRequest` or `declarativeNetRequest`
- Automatically redirect queries

The extension does:

- Let the user type a query in the popup
- Let the user choose a provider inside the popup
- Open a provider URL only after a user action
- Store an internal default provider for the extension UI only
- Store a temporary per-tab preference for the extension UI only

Important wording: "default provider" means Quick Search's internal default provider, not Chrome's default search engine.

## Single Purpose Review

Status: Pass.

Single purpose: provide a compact popup for user-initiated searches across user-selected search providers.

The current behavior matches that purpose. There is no telemetry, ads, affiliate logic, monetization, background browsing, page scraping, or unrelated browsing feature.

## Release Recommendation

Recommended v1 release path:

- Exclude default Chrome search provider changes.
- Keep only user-triggered search switching from the popup.
- Publish first as Unlisted for validation with real Chrome Web Store review and install flows.
- Move to Public after the listing, screenshots, privacy policy URL, and review result are verified.

Private release is only necessary if the developer wants a closed internal pilot before any public listing is discoverable.

## Open Risks

1. Search query disclosure to third-party providers
   - Risk: user-entered search terms are sent to the selected provider by design.
   - Mitigation: disclose this clearly in the privacy policy and store listing.

2. Custom provider templates
   - Risk: users can add an HTTPS provider controlled by someone else.
   - Mitigation: templates must be HTTPS and must include `{searchTerms}`; users choose and manage providers themselves.

3. Store wording around "default"
   - Risk: reviewers may confuse internal default provider with Chrome default search provider.
   - Mitigation: documentation and listing draft use "internal default provider" and explicitly state that Chrome search settings are not changed.

## Blockers

No source-level security blocker was found for first submission after the `tabs` permission removal and release-script hardening.
