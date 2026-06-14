import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTranslator, detectBrowserLocale } from '../src/shared/i18n';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('i18n', () => {
  it('resolves manual language overrides', () => {
    expect(createTranslator('pt_BR').t('searchPlaceholder')).toBe('Digite sua pesquisa...');
    expect(createTranslator('en').t('searchPlaceholder')).toBe('Type your search...');
  });

  it('falls back to English for unsupported locales', () => {
    vi.stubGlobal('chrome', { i18n: { getUILanguage: () => 'fr-FR' } });
    vi.stubGlobal('navigator', { language: 'fr-FR' });

    expect(detectBrowserLocale()).toBe('en');
    expect(createTranslator(null).t('searchPlaceholder')).toBe('Type your search...');
  });
});
