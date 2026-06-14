# Quick Search

[Português (Brasil)](README.pt-BR.md)

Quick Search is a Chromium Manifest V3 extension for switching between internal search providers and opening searches from a compact popup.

The extension keeps its own provider list, builds URLs from templates that include `{searchTerms}`, and opens searches in the current tab or in a new tab. It does not read page content, browsing history, cookies, bookmarks, or form data.

Repository: <https://github.com/josuesevahc/quick-search-extension>

## Features

- Search field in the popup.
- Active provider list.
- Search in the current tab or a new tab.
- Internal default provider selection.
- Temporary provider preference per tab.
- Light, dark, and browser default theme preference.
- Built-in provider enable/disable controls.
- Custom provider add, edit, and remove flow.
- `https://` URL validation with `{searchTerms}`.
- Settings persisted in `chrome.storage.local`.

## Requirements

- Node.js 20 or newer.
- npm 10 or newer.
- Chrome or another Chromium browser compatible with Manifest V3 extensions.

## Local Setup

```bash
npm install
npm run build
```

To load the extension:

1. Open `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked".
4. Select the generated `dist` folder.
5. Pin Quick Search to the browser toolbar.

## Download and Test

The preferred public distribution path is the Chrome Web Store once Quick Search is approved.

Before the Chrome Web Store listing is available, test builds can be downloaded from GitHub Releases:

- [Latest release](https://github.com/josuesevahc/quick-search-extension/releases/latest)
- [v1.0.0 release](https://github.com/josuesevahc/quick-search-extension/releases/tag/v1.0.0)
- [English manual install guide](docs/release/USER_TESTING_INSTALL_GUIDE.md)
- [Portuguese manual install guide](docs/release/USER_TESTING_INSTALL_GUIDE.pt-BR.md)

Download the release ZIP, unzip it, and load the unzipped folder in Chrome.

Release ZIP files are distributed through GitHub Releases and are not committed to the repository.

## Scripts

```bash
npm run dev
npm run build
npm run icons
npm test
npm run lint
npm run zip
```

- `npm run dev`: builds continuously in watch mode.
- `npm run build`: generates the production extension in `dist/`.
- `npm run icons`: generates PNG icons from `public/icons/icon.svg`.
- `npm test`: runs unit tests.
- `npm run lint`: checks the code style.
- `npm run zip`: builds the extension and creates a release ZIP in `release/`.

## Usage

1. Open the Quick Search popup.
2. Type a search term.
3. Select a provider.
4. Click "Search current tab" or "Search new tab" to submit, or press Enter when no local suggestion is highlighted.
5. Use the options page to manage providers, choose a light/dark/browser-default theme, and restore defaults.

If local search history suggestions are enabled, selecting a suggestion fills the input only. Search is executed only after an explicit submit action.

Custom providers must use an `https://` URL template containing `{searchTerms}`, for example:

```text
https://example.com/search?q={searchTerms}
```

## Project Structure

```text
src/background/   Manifest V3 service worker
src/config/       Application metadata, UI text, and default providers
src/domain/       Provider validation, selection, and URL generation
src/manifest/     Manifest template
src/options/      Options page
src/popup/        Popup UI
src/shared/       Shared browser, DOM, and storage helpers
scripts/          Build, icon, and packaging scripts
tests/            Unit tests
public/icons/     Source icon asset
docs/             Supporting technical documentation
```

## Documentation

- Language: [Portuguese README](README.pt-BR.md)
- Testing: [User testing install guide](docs/release/USER_TESTING_INSTALL_GUIDE.md) / [Portuguese guide](docs/release/USER_TESTING_INSTALL_GUIDE.pt-BR.md)
- Release: [Chrome Web Store submission checklist](docs/release/CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md), [test instructions](docs/release/TEST_INSTRUCTIONS.md), [store listing draft](docs/release/STORE_LISTING_DRAFT.md), and [store policy risk review](docs/release/STORE_POLICY_RISK_REVIEW.md)
- Privacy and security: [Privacy policy](docs/release/PRIVACY_POLICY.md), [permissions justification](docs/release/PERMISSIONS_JUSTIFICATION.md), and [security audit](docs/security/EXTENSION_SECURITY_AUDIT.md)
- Development: [Manual](docs/manual.md) and [platform limitations](docs/platform-limitations.md)
