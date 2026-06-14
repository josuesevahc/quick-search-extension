# Store Policy Risk Review

Navigation: [README](../../README.md) | [Security audit](../security/EXTENSION_SECURITY_AUDIT.md) | [Chrome Web Store submission checklist](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md)

Review date: 2026-06-14

## Icon Audit

`npm run icons` runs `scripts/generate-icons.ts`.

Current behavior:

- Generates extension icons only.
- Reads `public/icons/icon.svg`.
- Writes `public/icons/icon-16.png`, `icon-32.png`, `icon-48.png`, and `icon-128.png`.
- Does not generate search engine icons.
- Does not download remote assets.
- Does not create or package official third-party search engine logos.

Search engine display in the popup and options page uses local fallback initials/monograms from provider names. This is intentional for v1, not a failed icon generation path.

Missing search engine icons are a policy/trademark risk choice, not a build bug. The safest v1 strategy is to keep initials/monograms.

Safe future options:

- Keep initials/monograms for v1.
- Add custom generic icons created specifically for Quick Search.
- Consider optional favicon support only in a future version after reviewing permission warnings, data flow, and Chrome Web Store review impact.

Do not automatically add official third-party logos without brand/trademark review.

## Search and Autocomplete Risk

Quick Search does not call external autocomplete APIs while the user types. Typed text stays local until the user explicitly submits a search.

Local search history suggestions are generated only from previous searches submitted through Quick Search and stored in `chrome.storage.local` when the user enables the setting. Search history entries contain:

- submitted query string,
- selected provider ID,
- submission timestamp.

The history is capped at 50 entries by default. Consecutive duplicate queries are not stored. Empty and whitespace-only queries are not stored. Users can disable local suggestions and clear local search history from the options page.

Search history is not saved when the extension detects an incognito extension context. This uses `chrome.extension.inIncognitoContext` and does not require an additional permission.

## Search Settings Risk

Quick Search does not:

- Change Chrome's default search engine.
- Override the New Tab Page.
- Register an omnibox keyword.
- Intercept address-bar searches.
- Read Chrome browsing history.
- Use `webRequest`, `declarativeNetRequest`, host permissions, content scripts, or remote hosted code.

Recommended release path remains Unlisted first, then Public after listing and install-flow validation.
