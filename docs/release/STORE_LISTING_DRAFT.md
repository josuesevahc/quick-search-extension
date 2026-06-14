# Chrome Web Store Listing Draft

Navigation: [README](../../README.md) | [Chrome Web Store submission checklist](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md) | [Privacy policy](PRIVACY_POLICY.md)

## Name

Quick Search

## Short Description

Search with your chosen provider from a compact popup.

## Detailed Description

Quick Search is a lightweight search launcher for Chrome.

Open the extension popup, type a search term, choose a provider, and open the result in the current tab or a new tab. You can choose an internal default provider for the extension, temporarily prefer a provider for the current tab, choose a light, dark, or browser-default theme, enable or disable built-in providers, and add custom HTTPS provider templates.

Quick Search does not change Chrome's default search engine, does not override the New Tab Page, and does not intercept address-bar searches. Searches happen only when you submit a query from the extension popup.

Optional local search history suggestions can be enabled in settings. Suggestions are generated only from searches submitted through Quick Search and stored on your device. Selecting a local suggestion only fills the input; search is executed only after an explicit submit action. Typed text is not sent to external autocomplete services while you type.

Privacy-focused basics:

- No ads
- No analytics
- No telemetry
- No affiliate logic
- No remote hosted code
- No host permissions
- No page-content access
- No browsing-history access
- No external autocomplete calls while typing

Your search query is sent directly to the provider you select when you submit a search, just like navigating to that provider's search URL.

## Category

Productivity

## Language

Primary listing language: English

The extension supports English and Brazilian Portuguese. It follows the browser language by default and includes a manual language selector in settings. Theme preference is stored locally and can follow the browser default, light mode, or dark mode.

## Single Purpose Field

Quick Search provides a compact popup for user-initiated searches across user-selected search providers. Users type a query, choose a provider, and open the search in the current tab or a new tab.

## Permission Justification Field

`storage`: Saves user-facing settings locally, including enabled providers, custom HTTPS provider templates, the extension's internal default provider, temporary provider preferences for tabs, language preference, theme preference, and optional local search history suggestions.

Quick Search requests no host permissions and does not read website content.

## Privacy Practices Suggested Answers

Use the Chrome Web Store dashboard wording available at submission time. Suggested position:

- The extension does not collect data for the developer.
- The extension does not sell data.
- The extension does not use data for unrelated purposes.
- The extension does not use data for creditworthiness or lending.
- Search terms typed into the popup are sent to the user-selected search provider when the user submits a search.
- Typed text is not sent to external autocomplete providers before submission.
- Optional local search history suggestions are stored only on the user's device and can be cleared.

If the dashboard asks whether data is transmitted off the user's device, disclose that search terms are included in the URL opened at the selected search provider.

## Screenshot Checklist

Prepare screenshots that show:

1. Popup with search field and provider list.
2. Popup with a provider selected and local suggestions visible only if using non-personal sample terms.
3. Options page with built-in providers.
4. Custom provider form showing the HTTPS template requirement.
5. Language selector, theme selector, and local history suggestions setting.

Avoid showing personal search terms, personal browser tabs, account names, bookmarks, or private URLs.

## Promotional Tile Notes

Use the app icon and a clean screenshot. Do not imply that Quick Search changes Chrome's default search engine.

## Support URL

https://github.com/josuesevahc/quick-search-extension/issues

## Privacy Policy URL

Publish `docs/release/PRIVACY_POLICY.md` as a stable public web page before submission, then paste that URL into the Developer Dashboard privacy policy field.

## Release Notes for 1.0.0

Initial release of Quick Search:

- Search from the popup with built-in providers.
- Open searches in the current tab or a new tab.
- Choose an internal default provider for the extension.
- Set temporary provider preferences per tab.
- Manage custom HTTPS provider templates.
- Optional local search history suggestions stored on device.
- English and Brazilian Portuguese UI.
