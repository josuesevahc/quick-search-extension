# Chrome Web Store Submission Checklist

Language: English | [Português (Brasil)](CHROME_WEB_STORE_SUBMISSION_CHECKLIST.pt-BR.md)

Navigation: [README](../../README.md) | [User testing install guide](USER_TESTING_INSTALL_GUIDE.md) | [Privacy policy](PRIVACY_POLICY.md) | [Security audit](../security/EXTENSION_SECURITY_AUDIT.md)

Use this checklist for the first Quick Search submission.

## Release Decision

Recommended first release visibility: Unlisted.

Reason:

Unlisted allows a real Chrome Web Store review and install flow without broad public discovery. Move to Public after the package, listing, privacy policy URL, screenshots, and review outcome are verified.

Private is appropriate only for an internal closed pilot. Public is reasonable after the first accepted unlisted release has been tested.

## Pre-Submission Checks

- [ ] Confirm working tree contains no secrets, CRX private keys, `.env` files, OAuth credentials, or generated signing materials.
- [ ] Run `npm install`.
- [ ] Run `npm run release:check`.
- [ ] Run `npm run release:zip`.
- [ ] Confirm the ZIP exists under `release/`.
- [ ] Confirm the ZIP root contains `manifest.json`.
- [ ] Confirm `manifest.json` requests only `storage`.
- [ ] Confirm `host_permissions` is empty.
- [ ] Confirm there is no `chrome_settings_overrides`.
- [ ] Confirm there is no `chrome_url_overrides`.
- [ ] Confirm there is no `omnibox` key.
- [ ] Confirm there are no content scripts.
- [ ] Confirm the extension does not use remote hosted code.
- [ ] Confirm no source maps, tests, docs, local config, or `node_modules` are included in the ZIP.
- [ ] Complete the manual tests in `docs/release/TEST_INSTRUCTIONS.md`.

## GitHub Release Test Build

- [ ] Create a GitHub tag for the release version.
- [ ] Create a GitHub Release from that tag.
- [ ] Attach the generated ZIP from `release/` to the GitHub Release.
- [ ] Verify the README download link points to the GitHub Releases page.
- [ ] Verify `docs/release/USER_TESTING_INSTALL_GUIDE.md` explains download, unzip, install, update, remove, troubleshooting, and privacy notes.
- [ ] Verify `docs/release/USER_TESTING_INSTALL_GUIDE.pt-BR.md` contains equivalent Portuguese guidance.
- [ ] Confirm the generated ZIP remains ignored or untracked and is not committed to the repository.

## Bilingual Documentation Rule

Any user-facing, release-facing, privacy, store listing, install guide, or README change must update English and Portuguese docs together. If only one language is updated, the task is incomplete.

English remains the primary repository language, and Portuguese documentation must remain equivalent for end users. Portuguese release-doc counterparts use the `*.pt-BR.md` naming convention beside the English source file.

## Privacy Policy

- [ ] Publish `docs/release/PRIVACY_POLICY.md` at a stable public URL.
- [ ] Add the privacy policy URL in the Chrome Developer Dashboard.
- [ ] Confirm the policy states that search terms are sent to the user-selected provider when the user submits a search.
- [ ] Confirm the policy states that the developer does not receive search terms or settings.

## Store Listing

- [ ] Use the listing draft in `docs/release/STORE_LISTING_DRAFT.md`.
- [ ] Keep the description accurate and narrow.
- [ ] Do not claim that the extension changes Chrome's default search engine.
- [ ] Do not claim private or anonymous searching across third-party providers.
- [ ] Mention that searches are user-initiated from the popup.
- [ ] Mention that the extension requests no host permissions.
- [ ] Prepare screenshots without personal data.
- [ ] Ensure screenshot UI language matches or is explained by the listing language.

## Privacy Practices Tab

- [ ] Enter the single purpose statement from `docs/release/PERMISSIONS_JUSTIFICATION.md`.
- [ ] Justify `storage`.
- [ ] Confirm no host permissions are listed.
- [ ] Confirm data is not sold.
- [ ] Confirm data is not used for unrelated purposes.
- [ ] Confirm data is not used for creditworthiness or lending.
- [ ] Disclose that submitted search terms are sent to the user-selected provider as part of opening the search URL if the dashboard asks about off-device transmission.

## Manual Dashboard Steps

1. Open the Chrome Developer Dashboard.
2. Create a new item.
3. Upload `release/quick-search-extension-1.0.0.zip`.
4. Complete Store listing fields using `docs/release/STORE_LISTING_DRAFT.md`.
5. Upload screenshots and icon assets.
6. Set category to Productivity.
7. Complete Privacy practices using `docs/release/PERMISSIONS_JUSTIFICATION.md`.
8. Add the hosted privacy policy URL.
9. Set visibility to Unlisted for the first reviewed release.
10. Submit for review.
11. After approval, install from the Web Store listing and repeat the manual tests.
12. Move visibility to Public only after install and disclosure checks pass.

## Google Cloud Project

Not required for the current release.

Quick Search does not use OAuth, Google APIs, Firebase, backend services, or the Chrome Web Store Publish API.

## Chrome Web Store Publish API

Not required for the current release.

Use manual Developer Dashboard upload for v1. Consider the Publish API only after the manual release process is stable and there is a need for automated publishing.

## Submission Status

Ready for first submission after:

- automated release checks pass,
- the ZIP is generated by `npm run release:zip`,
- the privacy policy is hosted at a public URL,
- screenshots are prepared,
- manual Chrome load tests pass.
