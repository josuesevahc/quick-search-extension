/**
 * Deterministic tests for Quick Search v1.2.0 Visual Refresh
 *
 * These tests cover the correctness properties defined in the design document
 * using only the existing Vitest stack (no new runtime dependencies).
 *
 * Property-based testing with fast-check was deferred to post-v1.2.0.
 * See: temp/QUICK_SEARCH_V1_2_0_PROPERTY_TESTING_DEFERRED_REPORT.md
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { MESSAGES } from '../src/shared/i18n';
import { getSuggestionKeyboardAction } from '../src/domain/suggestion-acceptance';
import { getManifest } from '../src/manifest/manifest.template';

// ─── Helpers ────────────────────────────────────────────────────────────────

function readSrc(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf-8');
}

// ─── 8.1 / 8.2: Token completeness ─────────────────────────────────────────

describe('Token completeness', () => {
  const REQUIRED_QS_TOKENS = [
    // Structural (theme-independent)
    '--qs-radius-sm',
    '--qs-radius-md',
    '--qs-radius-lg',
    '--qs-shadow-sm',
    '--qs-shadow-lg',
    '--qs-space',
    '--qs-hit-target',
    '--qs-font-sans',
    // Color tokens
    '--qs-bg',
    '--qs-surface',
    '--qs-surface-elevated',
    '--qs-primary',
    '--qs-primary-hover',
    '--qs-primary-strong',
    '--qs-border',
    '--qs-border-active',
    '--qs-text',
    '--qs-text-secondary',
    '--qs-text-muted',
    '--qs-danger',
    '--qs-danger-soft',
  ];

  const themeCss = readSrc('src/shared/theme.css');

  it('defines all 21 required --qs-* tokens in theme.css', () => {
    for (const token of REQUIRED_QS_TOKENS) {
      expect(themeCss, `Missing token: ${token}`).toContain(token + ':');
    }
  });

  it('defines --qs-* tokens in both dark and light theme blocks', () => {
    // Color tokens must appear in theme-specific blocks (at least twice: dark + light)
    const colorTokens = REQUIRED_QS_TOKENS.filter(t => !t.includes('radius') && !t.includes('shadow') && !t.includes('space') && !t.includes('hit') && !t.includes('font'));
    for (const token of colorTokens) {
      // Count literal occurrences of the token declaration using split
      const occurrences = themeCss.split(token + ':').length - 1;
      expect(occurrences, `Token ${token} should appear in multiple theme blocks`).toBeGreaterThanOrEqual(2);
    }
  });
});

// ─── 8.3: Legacy token preservation ─────────────────────────────────────────

describe('Legacy token preservation', () => {
  const LEGACY_TOKENS = [
    '--primary-color',
    '--danger-color',
    '--success-color',
    '--bg-color',
    '--surface-color',
    '--text-color',
    '--muted-text-color',
    '--border-color',
    '--hover-color',
    '--selected-color',
    '--avatar-bg-color',
    '--avatar-text-color',
    '--overlay-color',
  ];

  const themeCss = readSrc('src/shared/theme.css');

  it('preserves all 13 legacy CSS tokens in theme.css', () => {
    for (const token of LEGACY_TOKENS) {
      expect(themeCss, `Legacy token removed: ${token}`).toContain(token + ':');
    }
  });
});

// ─── 8.4: i18n key symmetry ──────────────────────────────────────────────────

describe('i18n key symmetry', () => {
  it('every key in en exists in pt_BR with a non-empty value', () => {
    for (const key of Object.keys(MESSAGES.en)) {
      expect(MESSAGES.pt_BR, `Key "${key}" missing from pt_BR`).toHaveProperty(key);
      expect(MESSAGES.pt_BR[key], `Key "${key}" is empty in pt_BR`).toBeTruthy();
    }
  });

  it('every key in pt_BR exists in en with a non-empty value', () => {
    for (const key of Object.keys(MESSAGES.pt_BR)) {
      expect(MESSAGES.en, `Key "${key}" missing from en`).toHaveProperty(key);
      expect(MESSAGES.en[key], `Key "${key}" is empty in en`).toBeTruthy();
    }
  });

  it('localBadge key is present in both locales', () => {
    expect(MESSAGES.en).toHaveProperty('localBadge');
    expect(MESSAGES.pt_BR).toHaveProperty('localBadge');
    expect(MESSAGES.en.localBadge).toBe('Local');
    expect(MESSAGES.pt_BR.localBadge).toBe('Local');
  });
});

// ─── 8.5: Popup DOM structure ────────────────────────────────────────────────

describe('Popup DOM structure', () => {
  const popupHtml = readSrc('src/popup/popup.html');

  it('has .qs-header as a direct section in #app', () => {
    expect(popupHtml).toContain('class="qs-header"');
    expect(popupHtml).toContain('class="qs-header-title"');
    expect(popupHtml).toContain('class="qs-header-badge"');
  });

  it('wraps #search-input and #suggestions-list inside .search-wrapper', () => {
    expect(popupHtml).toContain('class="search-wrapper"');
    // search-wrapper must appear before search-input in source
    const wrapperIdx = popupHtml.indexOf('search-wrapper');
    const inputIdx = popupHtml.indexOf('id="search-input"');
    expect(wrapperIdx).toBeLessThan(inputIdx);
  });

  it('preserves #status with role="status" and aria-live="polite"', () => {
    expect(popupHtml).toContain('id="status"');
    expect(popupHtml).toContain('role="status"');
    expect(popupHtml).toContain('aria-live="polite"');
  });

  it('preserves #suggestions-list with role="listbox"', () => {
    expect(popupHtml).toContain('id="suggestions-list"');
    expect(popupHtml).toContain('role="listbox"');
  });

  it('preserves all required element IDs', () => {
    const requiredIds = [
      'search-input',
      'suggestions-list',
      'status',
      'provider-list',
      'search-new-tab',
      'search-current-tab',
      'temp-override',
      'temp-override-label',
      'settings-link',
    ];
    for (const id of requiredIds) {
      expect(popupHtml, `Missing element ID: #${id}`).toContain(`id="${id}"`);
    }
  });
});

// ─── 8.6: Options DOM order (structural, not CSS) ────────────────────────────

describe('Options page DOM structural order', () => {
  const optionsHtml = readSrc('src/options/options.html');

  it('preferences-section appears before providers-section in HTML source', () => {
    const prefsIdx = optionsHtml.indexOf('class="preferences-section"');
    const providersIdx = optionsHtml.indexOf('class="providers-section"');
    expect(prefsIdx).toBeGreaterThan(-1);
    expect(providersIdx).toBeGreaterThan(-1);
    expect(prefsIdx).toBeLessThan(providersIdx);
  });

  it('actions-section appears before providers-section in HTML source', () => {
    const actionsIdx = optionsHtml.indexOf('class="actions-section"');
    const providersIdx = optionsHtml.indexOf('class="providers-section"');
    expect(actionsIdx).toBeGreaterThan(-1);
    expect(actionsIdx).toBeLessThan(providersIdx);
  });

  it('modal appears after providers-section in HTML source', () => {
    const providersIdx = optionsHtml.indexOf('class="providers-section"');
    const modalIdx = optionsHtml.indexOf('id="modal"');
    expect(modalIdx).toBeGreaterThan(providersIdx);
  });

  it('preserves all element IDs required by options.ts', () => {
    const requiredIds = [
      'title', 'description',
      'providers-title', 'add-provider-btn', 'providers-list',
      'preferences-title',
      'language-label', 'language-select',
      'theme-label', 'theme-select',
      'local-history-label', 'local-history-help', 'search-history-enabled',
      'clear-search-history-btn',
      'restore-defaults-btn',
      'modal', 'modal-title', 'provider-form', 'edit-id',
      'name-label', 'name',
      'url-label', 'url', 'url-help',
      'cancel-btn', 'save-btn',
    ];
    for (const id of requiredIds) {
      expect(optionsHtml, `Missing element ID: #${id}`).toContain(`id="${id}"`);
    }
  });

  it('does not use CSS order, flex-order, or position tricks for reordering', () => {
    const optionsCss = readSrc('src/options/options.css');
    // No flex 'order' property used to reorder sections visually
    expect(optionsCss).not.toMatch(/(?<!\w)order\s*:\s*-?\d+/);
  });
});

// ─── 8.7: Non-color state indicators (static HTML check) ─────────────────────

describe('Non-color state indicators', () => {
  const popupHtml = readSrc('src/popup/popup.html');

  it('popup.html does not hardcode dynamic state classes in static template', () => {
    // .is-default, .is-tab-override, .badge, .tab-badge are applied by popup.ts
    // They must NOT appear as hardcoded classes in the static HTML
    expect(popupHtml).not.toContain('class="is-default"');
    expect(popupHtml).not.toContain('class="is-tab-override"');
    // These classes appear in CSS only, not hardcoded in HTML
  });

  it('popup.css defines visual rules for .is-default .badge and .is-tab-override', () => {
    const popupCss = readSrc('src/popup/popup.css');
    expect(popupCss).toContain('.is-default');
    expect(popupCss).toContain('.is-tab-override');
    expect(popupCss).toContain('.badge');
    expect(popupCss).toContain('.tab-badge');
  });
});

// ─── 8.8: Keyboard navigation — delegates to existing coverage ───────────────

describe('Keyboard navigation (existing coverage delegation)', () => {
  // getSuggestionKeyboardAction is already fully tested in suggestion-acceptance.test.ts
  // These cases verify it still behaves correctly after the visual refresh
  // (which does not modify any TS logic)

  const cases: Array<[string, boolean, boolean, string]> = [
    ['ArrowDown', false, true, 'move-next'],
    ['ArrowUp', false, true, 'move-previous'],
    ['Escape', true, true, 'close'],
    ['Tab', true, true, 'accept'],
    ['ArrowRight', true, true, 'accept'],
    ['Enter', true, true, 'accept'],
    ['Enter', false, true, 'none'],
    ['Enter', false, false, 'submit'],
    ['ArrowRight', false, true, 'none'],
    ['Tab', false, true, 'none'],
    ['Space', false, true, 'none'],
    ['Escape', false, false, 'close'],
  ];

  it.each(cases)(
    'key=%s hasHighlight=%s suggestionsOpen=%s → %s',
    (key, hasHighlight, suggestionsOpen, expected) => {
      expect(getSuggestionKeyboardAction(key, hasHighlight, suggestionsOpen)).toBe(expected);
    },
  );
});

// ─── 8.9: Manifest permissions unchanged ─────────────────────────────────────

describe('Manifest permissions unchanged', () => {
  it('permissions array contains only "storage"', () => {
    const manifest = getManifest('1.0.0');
    expect(manifest.permissions).toEqual(['storage']);
  });

  it('host_permissions is empty', () => {
    const manifest = getManifest('1.0.0');
    expect(manifest.host_permissions).toEqual([]);
  });

  it('manifest_version is 3', () => {
    const manifest = getManifest('1.0.0');
    expect(manifest.manifest_version).toBe(3);
  });
});

// ─── 8.10: No reference to temp print in source files ────────────────────────

describe('Visual reference file not referenced in source', () => {
  const REFERENCE_FILENAME = 'PrintQuickSearchNewVisualInterfacePopup';

  const sourceFiles = [
    'src/popup/popup.html',
    'src/popup/popup.css',
    'src/popup/popup.ts',
    'src/options/options.html',
    'src/options/options.css',
    'src/options/options.ts',
    'src/shared/theme.css',
    'src/shared/i18n.ts',
    'public/_locales/en/messages.json',
    'public/_locales/pt_BR/messages.json',
  ];

  for (const file of sourceFiles) {
    it(`${file} does not reference the temp visual reference PNG`, () => {
      const content = readSrc(file);
      expect(content).not.toContain(REFERENCE_FILENAME);
    });
  }
});
