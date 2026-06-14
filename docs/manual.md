# Quick Search Manual

This manual covers the local development flow for Quick Search.

## Setup

Install dependencies from the repository root:

```bash
npm install
```

## Development Build

Run the watch build while developing:

```bash
npm run dev
```

The command rebuilds the extension into `dist/` whenever source files change.

## Production Build

Generate the production extension:

```bash
npm run build
```

Create a ZIP package:

```bash
npm run zip
```

The ZIP output is created in `release/`.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked".
4. Select the generated `dist` folder.
5. Pin Quick Search to the toolbar.

## Verify the Extension

Open the popup and check the main search flow:

1. Type a search term.
2. Select a provider.
3. Press Enter to search in the current tab.
4. Press Shift+Enter or use the new-tab action to open a new tab.
5. Set a default provider.
6. Enable the temporary provider option for the current tab.

Open the options page and check provider management:

1. Add a custom provider.
2. Edit a custom provider.
3. Disable and enable built-in providers.
4. Remove a custom provider.
5. Restore default providers.

## Quality Checks

```bash
npm test
npm run build
npm run lint
npm audit
```
