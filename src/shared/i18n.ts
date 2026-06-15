export type SupportedLocale = 'en' | 'pt_BR';

type Messages = Record<string, string>;

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'pt_BR'];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const MESSAGES: Record<SupportedLocale, Messages> = {
  en: {
    appName: 'Quick Search',
    localBadge: 'Local',
    appDescription: 'Quickly switch search providers from a compact popup.',
    searchPlaceholder: 'Type your search...',
    openSettings: 'Settings',
    defaultProvider: 'Default',
    setDefaultProvider: 'Set default',
    temporaryForTab: 'Temporary for this tab',
    searchCurrentTab: 'Search current tab',
    searchNewTab: 'Search new tab',
    noActiveProviders: 'No active providers.',
    searchTermRequired: 'Type a search term.',
    providerUnavailable: 'Provider unavailable.',
    providersTitle: 'Available providers',
    preferencesTitle: 'Preferences',
    addProvider: 'Add provider',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    remove: 'Remove',
    restoreDefaults: 'Restore defaults',
    confirmRestoreDefaults: 'Restore default settings?',
    confirmRemoveProvider: 'Remove this provider?',
    providerSaved: 'Provider saved.',
    settingsSaved: 'Settings saved.',
    searchHistoryCleared: 'Search history cleared.',
    providerNameLabel: 'Name',
    providerUrlLabel: 'URL template (HTTPS)',
    providerUrlHelp: 'Use {searchTerms} where the search term should go.',
    providerUrlPlaceholder: 'https://example.com/search?q={searchTerms}',
    languageLabel: 'Language',
    languageAuto: 'Browser default',
    languageEnglish: 'English',
    languagePortuguese: 'Portuguese (Brazil)',
    themeLabel: 'Theme',
    themeSystem: 'Browser default',
    themeLight: 'Light',
    themeDark: 'Dark',
    localHistoryLabel: 'Local search history suggestions',
    localHistoryHelp: 'Stores submitted searches on this device only. Typed text is not sent to autocomplete services.',
    clearSearchHistory: 'Clear search history',
    suggestionsLabel: 'Local search suggestions',
    invalidProvider: 'Invalid provider.',
    duplicateId: 'Duplicate ID.',
    providerIdRequired: 'ID is required.',
    providerNameRequired: 'Name is required.',
    providerUrlRequired: 'URL is required.',
    providerInvalidProtocol: 'Invalid protocol.',
    providerHttpsRequired: 'URL must use HTTPS.',
    providerSearchTermsRequired: 'Template must contain {searchTerms}.',
    providerInvalidUrl: 'Invalid URL.',
    providerEnabledInvalid: 'Invalid enabled field.',
    providerBuiltInInvalid: 'Invalid isBuiltIn field.',
  },
  pt_BR: {
    appName: 'Quick Search',
    localBadge: 'Local',
    appDescription: 'Alterne rapidamente entre buscadores em um popup compacto.',
    searchPlaceholder: 'Digite sua pesquisa...',
    openSettings: 'Configuracoes',
    defaultProvider: 'Padrao',
    setDefaultProvider: 'Definir padrao',
    temporaryForTab: 'Temporario para esta aba',
    searchCurrentTab: 'Buscar na aba atual',
    searchNewTab: 'Buscar em nova aba',
    noActiveProviders: 'Nenhum buscador ativo.',
    searchTermRequired: 'Digite um termo para buscar.',
    providerUnavailable: 'Buscador indisponivel.',
    providersTitle: 'Buscadores disponiveis',
    preferencesTitle: 'Preferencias',
    addProvider: 'Adicionar buscador',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    remove: 'Remover',
    restoreDefaults: 'Restaurar padroes',
    confirmRestoreDefaults: 'Deseja restaurar as configuracoes padrao?',
    confirmRemoveProvider: 'Excluir este buscador?',
    providerSaved: 'Buscador salvo com sucesso.',
    settingsSaved: 'Configuracoes salvas.',
    searchHistoryCleared: 'Historico de buscas apagado.',
    providerNameLabel: 'Nome',
    providerUrlLabel: 'Template de URL (HTTPS)',
    providerUrlHelp: 'Use {searchTerms} onde o termo de busca deve entrar.',
    providerUrlPlaceholder: 'https://example.com/search?q={searchTerms}',
    languageLabel: 'Idioma',
    languageAuto: 'Padrao do navegador',
    languageEnglish: 'Ingles',
    languagePortuguese: 'Portugues (Brasil)',
    themeLabel: 'Tema',
    themeSystem: 'Padrao do navegador',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    localHistoryLabel: 'Sugestoes locais do historico de busca',
    localHistoryHelp: 'Armazena buscas enviadas apenas neste dispositivo. O texto digitado nao e enviado a servicos de autocomplete.',
    clearSearchHistory: 'Limpar historico de buscas',
    suggestionsLabel: 'Sugestoes locais de busca',
    invalidProvider: 'Buscador invalido.',
    duplicateId: 'ID duplicado.',
    providerIdRequired: 'ID obrigatorio.',
    providerNameRequired: 'Nome obrigatorio.',
    providerUrlRequired: 'URL obrigatoria.',
    providerInvalidProtocol: 'Protocolo invalido.',
    providerHttpsRequired: 'URL deve usar HTTPS.',
    providerSearchTermsRequired: 'Template deve conter {searchTerms}.',
    providerInvalidUrl: 'URL invalida.',
    providerEnabledInvalid: 'Campo enabled invalido.',
    providerBuiltInInvalid: 'Campo isBuiltIn invalido.',
  },
};

export type MessageKey = keyof typeof MESSAGES.en;

function normalizeLocale(locale: string | null | undefined): SupportedLocale | null {
  if (!locale) return null;
  const normalized = locale.replace('-', '_').toLowerCase();
  if (normalized === 'pt' || normalized === 'pt_br') return 'pt_BR';
  if (normalized === 'en' || normalized.startsWith('en_')) return 'en';
  return null;
}

export function detectBrowserLocale(): SupportedLocale {
  const chromeLanguage = typeof chrome !== 'undefined' ? chrome.i18n?.getUILanguage?.() : null;
  const navigatorLanguage = typeof navigator !== 'undefined' ? navigator.language : null;
  return normalizeLocale(chromeLanguage) ?? normalizeLocale(navigatorLanguage) ?? DEFAULT_LOCALE;
}

export function resolveLocale(languageOverride: string | null | undefined): SupportedLocale {
  return normalizeLocale(languageOverride) ?? detectBrowserLocale();
}

export function createTranslator(languageOverride?: string | null) {
  const locale = resolveLocale(languageOverride);
  const messages = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
  return {
    locale,
    t(key: MessageKey): string {
      return messages[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key;
    },
  };
}
