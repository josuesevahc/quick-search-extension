# Test Instructions

Run these checks before uploading a ZIP to the Chrome Web Store.

## Automated Checks

From the repository root:

```powershell
npm install
npm run release:check
```

The release check runs:

- `npm audit`
- `npm test`
- `npm run lint`
- `npm run build`
- manifest validation
- package-output checks for forbidden files and risky content patterns

## Build the Release ZIP

```powershell
npm run release:zip
```

Expected output:

```text
release/quick-search-extension-1.0.0.zip
```

## Manual Load Test

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked".
5. Select the repository's `dist/` folder.
6. Pin Quick Search to the toolbar.

## Popup Search Flow

1. Open the Quick Search popup.
2. Type `test search`.
3. Select Google.
4. Click the current-tab search action.
5. Confirm the current tab navigates to a Google search URL.
6. Go back or open another page.
7. Open the popup again.
8. Select DuckDuckGo.
9. Use the new-tab search action.
10. Confirm a new tab opens with a DuckDuckGo search URL.

## Internal Default Provider

1. Open the popup.
2. Click "Set default" for a provider.
3. Close and reopen the popup.
4. Confirm the selected provider is treated as Quick Search's internal default.
5. Confirm Chrome's default search engine in `chrome://settings/search` is unchanged.

## Temporary Tab Provider

1. Open a normal web page.
2. Open the Quick Search popup.
3. Select a provider.
4. Enable the temporary provider option for the current tab.
5. Close and reopen the popup on the same tab.
6. Confirm the selected provider remains active for that tab.
7. Open a different tab.
8. Confirm the temporary preference does not apply globally.
9. Close the original tab.
10. Confirm no error appears in the extension service worker console.

## Options Page

1. Open the options page from the popup.
2. Disable a built-in provider.
3. Confirm it disappears from the active provider list in the popup.
4. Re-enable the provider.
5. Add a custom provider with this template:

```text
https://example.com/search?q={searchTerms}
```

6. Confirm the custom provider appears in the popup.
7. Edit the custom provider.
8. Remove the custom provider.
9. Restore defaults.

## Validation Cases

Confirm the custom provider form rejects:

- Empty name
- Empty URL
- `http://` URLs
- URLs without `{searchTerms}`
- `javascript:` URLs
- malformed URLs

## Policy Regression Checks

Before upload, verify:

- `dist/manifest.json` has `manifest_version: 3`.
- `dist/manifest.json` requests only `storage`.
- `dist/manifest.json` has empty `host_permissions`.
- There is no `chrome_settings_overrides`.
- There is no `chrome_url_overrides`.
- There is no `omnibox` key.
- There are no content scripts.
- There are no source maps in `dist/`.
- There are no `.env`, `.pem`, `.key`, tests, docs, or `node_modules` files in the ZIP.

## Chrome Web Store Draft Test

Recommended first submission visibility: Unlisted.

After upload, install from the Web Store draft or unlisted listing and repeat:

- Popup search flow
- Options page flow
- Internal default provider flow
- Temporary tab provider flow
- Chrome default search engine unchanged check
