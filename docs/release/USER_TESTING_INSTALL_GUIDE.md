# User Testing Install Guide

Language: English | [Português (Brasil)](USER_TESTING_INSTALL_GUIDE.pt-BR.md)

Navigation: [README](../../README.md) | [Chrome Web Store submission checklist](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.md)

This guide is for pre-store manual testing.

The recommended public distribution path for Quick Search is the Chrome Web Store. Until the extension is approved and listed there, testers can download a test ZIP from GitHub Releases and load it manually in Chrome.

## Download the Test Build

- [Latest release](https://github.com/josuesevahc/quick-search-extension/releases/latest)
- [v1.0.0 release](https://github.com/josuesevahc/quick-search-extension/releases/tag/v1.0.0)
- [All releases](https://github.com/josuesevahc/quick-search-extension/releases)

Download the `.zip` asset attached to the release, unzip it on your computer, and load the unzipped extension folder in Chrome.

Important: Chrome cannot load the ZIP directly. You must unzip it first, then select the unzipped extension folder.

## Install in Chrome

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on "Developer mode".
4. Click "Load unpacked".
5. Select the unzipped extension folder.
6. Pin Quick Search to the Chrome toolbar.
7. Open the Quick Search popup.
8. Type a search term, choose a provider, and test opening searches.

## Update to a Newer Test Build

1. Download the newer ZIP from GitHub Releases.
2. Unzip the newer ZIP.
3. Replace the previous unzipped extension folder with the newer folder.
4. Open `chrome://extensions`.
5. Find Quick Search.
6. Click the reload button for the extension.
7. Open the popup and confirm the new build works.

If Chrome still shows the old build, remove the extension and load the new unzipped folder again.

## Remove the Test Build

1. Open `chrome://extensions`.
2. Find Quick Search.
3. Click "Remove".
4. Confirm removal.

You can also delete the unzipped extension folder from your computer after removing it from Chrome.

## Troubleshooting

### Chrome says the package is invalid

You probably selected the ZIP file instead of the unzipped folder. Unzip the file first, then click "Load unpacked" and select the extracted folder.

### Chrome does not show Quick Search after loading

Check that you selected the folder that contains `manifest.json`. If you selected a parent folder, Chrome may not find the extension.

### The "Load unpacked" button is missing

Developer mode is probably off. Open `chrome://extensions` and turn on "Developer mode" in the top-right area of the page.

### The extension is installed but not visible

Quick Search may not be pinned. Click the extensions icon in the Chrome toolbar, find Quick Search, and pin it.

### The old build is still loaded

Chrome may still be using the previous unzipped folder. Replace the old folder, then click reload on `chrome://extensions`. If that does not work, remove Quick Search and load the newer unzipped folder again.

## Privacy Note

Quick Search opens a search URL only after you type a query and submit a search.

Your search terms go to the search provider you selected, such as Google, Bing, DuckDuckGo, or another provider, as part of normal web navigation. Quick Search does not collect, sell, or share user data with the extension developer.
