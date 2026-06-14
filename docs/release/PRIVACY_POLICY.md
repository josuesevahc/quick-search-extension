# Privacy Policy for Quick Search

Navigation: [README](../../README.md) | [Permissions justification](PERMISSIONS_JUSTIFICATION.md) | [Chrome Web Store submission checklist](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md)

Effective date: 2026-06-14

Status note: Chrome Web Store v1.0.0 has already been submitted and is still under review. The theme preference and safe local suggestion acceptance behavior described here are prepared in `main` for a future update and are not a new Chrome Web Store upload yet.

Quick Search is a browser extension that lets you type a search query, choose a search provider, and open the search in the current tab or a new tab.

## Data Quick Search Stores

Quick Search stores the following settings locally in your browser using `chrome.storage.local`:

- Enabled and disabled search providers
- Custom provider names and HTTPS search URL templates
- The extension's internal default provider
- Temporary provider preferences for individual tabs
- Manual language preference
- Theme preference
- Optional local search history suggestions, if enabled

These settings are used only to provide the extension's search switching functionality.

Optional local search history suggestions are stored only on your device. They contain the submitted query string, the selected provider ID, and the time the search was submitted. You can disable local suggestions and clear local search history from the options page.

## Search Queries

When you type a search query into Quick Search and submit it, the extension creates a URL for the provider you selected and opens that URL in Chrome.

The selected search provider receives your query as part of normal web navigation. For example, if you choose Google, Bing, DuckDuckGo, or another provider, that provider receives the query according to its own privacy policy and terms.

Typed text is not sent to Google, Bing, Brave, Perplexity, DuckDuckGo, or any external autocomplete provider while you type. Local suggestions, if enabled, are accepted into the input only. Search terms are sent to the selected search provider only after you submit a search.

Quick Search's developer does not receive, collect, transmit, sell, or share your search queries or local search history.

## Data Quick Search Does Not Access

Quick Search does not read or collect:

- Page content
- Browsing history
- Cookies
- Bookmarks
- Form data
- Passwords
- Account identity
- Location
- Financial information
- Health information

## Data Sharing

Quick Search does not send data to any developer-operated server.

Search queries are sent only to the search provider selected by the user when the user submits a search.

Local search history suggestions, if enabled, remain in `chrome.storage.local` on the user's device.

## Remote Code, Analytics, and Ads

Quick Search does not use remote hosted code, analytics, telemetry, tracking, advertising, affiliate links, or monetization logic.

## Chrome Web Store Limited Use Statement

Quick Search's use of information complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. Data is used only to provide the extension's single purpose: user-initiated search switching from the extension popup.

## Contact

For support or privacy questions, use the support contact configured in the Chrome Web Store listing or the repository issue tracker:

https://github.com/josuesevahc/quick-search-extension/issues
