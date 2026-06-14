import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultSettings,
  getSettings,
  resetSettings,
  saveSettings,
  setDefaultProvider,
  setLanguage,
  setSearchHistoryEnabled,
  setTabProviderOverride,
  recordSearch,
  clearSearchHistory,
} from '../src/shared/storage';

let storageData: Record<string, unknown>;

beforeEach(() => {
  storageData = {};
  vi.restoreAllMocks();
  vi.stubGlobal('chrome', {
    storage: {
      local: {
        get: vi.fn(async (key: string) => ({ [key]: storageData[key] })),
        set: vi.fn(async (value: Record<string, unknown>) => {
          storageData = { ...storageData, ...value };
        }),
      },
    },
  });
});

describe('storage settings', () => {
  it('restores default settings', async () => {
    await resetSettings();

    expect(storageData.settings).toEqual(createDefaultSettings());
  });

  it('falls back safely when storage is corrupted', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    storageData.settings = {
      providers: [
        {
          id: 'bad',
          name: 'Bad',
          searchUrlTemplate: 'http://bad.example.com?q={searchTerms}',
          enabled: true,
          isBuiltIn: false,
        },
      ],
      defaultProviderId: 'bad',
      tabProviderOverrides: { 10: 'bad' },
    };

    await expect(getSettings()).resolves.toEqual(createDefaultSettings());
    expect(warnSpy).toHaveBeenCalledWith('[Quick Search] Invalid settings in chrome.storage.local; using defaults.');
  });

  it('normalizes invalid default provider ids', async () => {
    const settings = createDefaultSettings();
    settings.defaultProviderId = 'missing';
    await saveSettings(settings);

    await expect(getSettings()).resolves.toMatchObject({ defaultProviderId: 'google' });
  });

  it('persists an explicit internal default provider', async () => {
    await resetSettings();
    await setDefaultProvider('bing');

    await expect(getSettings()).resolves.toMatchObject({ defaultProviderId: 'bing' });
  });

  it('persists a valid temporary provider override by tab', async () => {
    await resetSettings();
    await setTabProviderOverride(123, 'duckduckgo');

    const settings = await getSettings();
    expect(settings.tabProviderOverrides[123]).toBe('duckduckgo');
  });

  it('persists a manual language override', async () => {
    await resetSettings();
    await setLanguage('pt_BR');

    await expect(getSettings()).resolves.toMatchObject({ language: 'pt_BR' });
  });

  it('does not record search history while disabled', async () => {
    await resetSettings();
    await recordSearch('docs', 'google', 1);

    await expect(getSettings()).resolves.toMatchObject({ searchHistory: [] });
  });

  it('records and clears local search history when enabled', async () => {
    await resetSettings();
    await setSearchHistoryEnabled(true);
    await recordSearch('docs', 'google', 1);
    await clearSearchHistory();

    await expect(getSettings()).resolves.toMatchObject({ searchHistory: [] });
  });
});
