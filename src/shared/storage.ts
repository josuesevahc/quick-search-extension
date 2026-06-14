import { SearchProvider, validateProviderList } from '../domain/provider';
import { DEFAULT_PROVIDERS } from '../config/default-providers';
import {
  DEFAULT_SEARCH_HISTORY_LIMIT,
  SearchHistoryEntry,
  addSearchHistoryEntry,
  normalizeSearchHistory,
} from '../domain/search-history';
import { SupportedLocale, SUPPORTED_LOCALES } from './i18n';

export type ExtensionSettings = {
  providers: SearchProvider[];
  defaultProviderId: string | null;
  tabProviderOverrides: Record<number, string>;
  language: SupportedLocale | null;
  searchHistoryEnabled: boolean;
  searchHistory: SearchHistoryEntry[];
};

const STORAGE_KEY = 'settings';

export function createDefaultSettings(): ExtensionSettings {
  return {
    providers: DEFAULT_PROVIDERS.map(provider => ({ ...provider })),
    defaultProviderId: 'google',
    tabProviderOverrides: {},
    language: null,
    searchHistoryEnabled: false,
    searchHistory: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getFallbackProviderId(providers: SearchProvider[]): string | null {
  const google = providers.find(provider => provider.id === 'google' && provider.enabled);
  return google?.id ?? providers.find(provider => provider.enabled)?.id ?? null;
}

function normalizeSettings(rawSettings: unknown): ExtensionSettings {
  if (!isRecord(rawSettings) || !validateProviderList(rawSettings.providers)) {
    return createDefaultSettings();
  }

  const providers = rawSettings.providers.map(provider => ({ ...provider }));
  const activeProviderIds = new Set(providers.filter(provider => provider.enabled).map(provider => provider.id));

  const rawDefaultProviderId = rawSettings.defaultProviderId;
  const defaultProviderId =
    typeof rawDefaultProviderId === 'string' && activeProviderIds.has(rawDefaultProviderId)
      ? rawDefaultProviderId
      : getFallbackProviderId(providers);

  const tabProviderOverrides: Record<number, string> = {};
  if (isRecord(rawSettings.tabProviderOverrides)) {
    Object.entries(rawSettings.tabProviderOverrides).forEach(([tabId, providerId]) => {
      const numericTabId = Number(tabId);
      if (Number.isInteger(numericTabId) && numericTabId >= 0 && typeof providerId === 'string' && activeProviderIds.has(providerId)) {
        tabProviderOverrides[numericTabId] = providerId;
      }
    });
  }

  const rawLanguage = rawSettings.language;
  const language =
    typeof rawLanguage === 'string' && SUPPORTED_LOCALES.includes(rawLanguage as SupportedLocale)
      ? (rawLanguage as SupportedLocale)
      : null;

  const searchHistoryEnabled =
    typeof rawSettings.searchHistoryEnabled === 'boolean'
      ? rawSettings.searchHistoryEnabled
      : false;

  return {
    providers,
    defaultProviderId,
    tabProviderOverrides,
    language,
    searchHistoryEnabled,
    searchHistory: normalizeSearchHistory(rawSettings.searchHistory, DEFAULT_SEARCH_HISTORY_LIMIT),
  };
}

export async function getSettings(): Promise<ExtensionSettings> {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  const rawSettings = data[STORAGE_KEY];
  const isInvalidSettings = !!rawSettings && (!isRecord(rawSettings) || !validateProviderList(rawSettings.providers));
  const settings = normalizeSettings(rawSettings);
  if (isInvalidSettings) {
    console.warn('[Quick Search] Invalid settings in chrome.storage.local; using defaults.');
  }
  return settings;
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: normalizeSettings(settings) });
}

export async function resetSettings(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: createDefaultSettings() });
}

export async function setDefaultProvider(providerId: string | null): Promise<void> {
  const settings = await getSettings();
  settings.defaultProviderId = providerId && settings.providers.some(provider => provider.id === providerId && provider.enabled)
    ? providerId
    : getFallbackProviderId(settings.providers);
  await saveSettings(settings);
}

export async function setTabProviderOverride(tabId: number, providerId: string): Promise<void> {
  const settings = await getSettings();
  if (settings.providers.some(provider => provider.id === providerId && provider.enabled)) {
    settings.tabProviderOverrides[tabId] = providerId;
  }
  await saveSettings(settings);
}

export async function clearTabProviderOverride(tabId: number): Promise<void> {
  const settings = await getSettings();
  delete settings.tabProviderOverrides[tabId];
  await saveSettings(settings);
}

export async function setLanguage(language: SupportedLocale | null): Promise<void> {
  const settings = await getSettings();
  settings.language = language;
  await saveSettings(settings);
}

export async function setSearchHistoryEnabled(enabled: boolean): Promise<void> {
  const settings = await getSettings();
  settings.searchHistoryEnabled = enabled;
  await saveSettings(settings);
}

export async function recordSearch(query: string, providerId: string, searchedAt: number = Date.now()): Promise<void> {
  const settings = await getSettings();
  if (!settings.searchHistoryEnabled) return;
  settings.searchHistory = addSearchHistoryEntry(
    settings.searchHistory,
    query,
    providerId,
    searchedAt,
    DEFAULT_SEARCH_HISTORY_LIMIT
  );
  await saveSettings(settings);
}

export async function clearSearchHistory(): Promise<void> {
  const settings = await getSettings();
  settings.searchHistory = [];
  await saveSettings(settings);
}
