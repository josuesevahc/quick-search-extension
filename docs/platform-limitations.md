# Platform Limitations

Quick Search is built on Chromium Manifest V3. This document summarizes the browser platform limits that shape the extension design.

## Global Search Engine

Chrome does not provide a runtime API that lets an extension dynamically change the browser's global default search engine.

Quick Search uses its own internal provider list and opens the selected provider URL through browser tab APIs.

## Native Search Engines

Chrome does not provide an API for reading every search engine configured by the user in `chrome://settings/searchEngines`.

Quick Search ships with common built-in providers and lets users add custom providers inside the extension.

## Native Provider List

Chrome does not let an extension dynamically inject multiple providers into the browser's native search engine list.

The provider list shown in the popup belongs to Quick Search and is stored in `chrome.storage.local`.

## Tabs Permission

The `tabs` permission is used to update the current tab, open a new tab, and associate a temporary provider preference with the current tab ID.

Quick Search does not read page content, browsing history, cookies, bookmarks, or form data.

## Service Worker Lifetime

Manifest V3 service workers are event-driven and can be stopped by the browser when idle.

Quick Search stores persistent settings in `chrome.storage.local`; the service worker only handles installation and tab cleanup events.
