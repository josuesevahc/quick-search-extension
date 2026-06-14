# Permissions Justification

Use this content when completing the Chrome Web Store privacy and permissions fields.

## Single Purpose

Quick Search provides a compact popup for user-initiated searches across user-selected search providers. Users type a query, choose a provider, and open the search in the current tab or a new tab.

## Requested Permissions

### `storage`

Justification:

Quick Search uses `chrome.storage.local` to save user-facing settings, including enabled search providers, custom HTTPS provider templates, the extension's internal default provider, and temporary per-tab provider preferences.

The stored settings remain on the user's device. They are not sent to the developer or to any developer-operated server.

## Host Permissions

Quick Search requests no host permissions.

Justification:

The extension does not read, scrape, inject into, or modify websites. Search providers are opened through normal browser navigation after the user submits a query.

## Permissions Not Used

The extension does not request:

- `tabs`
- `activeTab`
- `scripting`
- `webRequest`
- `declarativeNetRequest`
- `cookies`
- `history`
- `bookmarks`
- `identity`
- host permissions

## Prior Permission Removed

The `tabs` permission was removed during release readiness review.

Reason:

Quick Search uses the Tabs API only to create or navigate tabs and to track numeric tab IDs for temporary provider preferences. It does not read tab URLs, titles, favicons, or pending URLs. Chrome's Tabs API does not require the `tabs` permission for the current behavior.

## Search Settings Statement

Quick Search does not change Chrome's default search provider, does not override Chrome search settings, does not override the New Tab Page, does not register an omnibox keyword, and does not intercept browser address-bar searches.
