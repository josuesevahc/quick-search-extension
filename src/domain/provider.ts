export type SearchProvider = {
  id: string;
  name: string;
  searchUrlTemplate: string;
  enabled: boolean;
  isBuiltIn: boolean;
};

export const SEARCH_TERMS_TOKEN = '{searchTerms}';

export type ProviderValidationError =
  | 'invalidProvider'
  | 'providerIdRequired'
  | 'duplicateId'
  | 'providerNameRequired'
  | 'providerUrlRequired'
  | 'providerInvalidProtocol'
  | 'providerHttpsRequired'
  | 'providerSearchTermsRequired'
  | 'providerInvalidUrl'
  | 'providerEnabledInvalid'
  | 'providerBuiltInInvalid';

export class InvalidProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProviderError';
  }
}

type ProviderValidationOptions = {
  requireFlags?: boolean;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateProvider(
  provider: Partial<SearchProvider> | unknown,
  existingIds: string[] = [],
  options: ProviderValidationOptions = {}
): ProviderValidationError | null {
  if (!isPlainObject(provider)) return 'invalidProvider';

  const id = typeof provider.id === 'string' ? provider.id.trim() : '';
  const name = typeof provider.name === 'string' ? provider.name.trim() : '';
  const template = typeof provider.searchUrlTemplate === 'string' ? provider.searchUrlTemplate.trim() : '';

  if (!id) return 'providerIdRequired';
  if (existingIds.includes(id)) return 'duplicateId';
  if (!name) return 'providerNameRequired';
  if (!template) return 'providerUrlRequired';

  const normalizedTemplate = template.toLowerCase();
  if (normalizedTemplate.includes('javascript:')) return 'providerInvalidProtocol';
  if (!normalizedTemplate.startsWith('https://')) return 'providerHttpsRequired';
  if (!template.includes(SEARCH_TERMS_TOKEN)) return 'providerSearchTermsRequired';

  try {
    const parseableTemplate = template.replaceAll(SEARCH_TERMS_TOKEN, 'test');
    const parsedUrl = new URL(parseableTemplate);
    if (parsedUrl.protocol !== 'https:') return 'providerHttpsRequired';
  } catch {
    return 'providerInvalidUrl';
  }

  if (options.requireFlags) {
    if (typeof provider.enabled !== 'boolean') return 'providerEnabledInvalid';
    if (typeof provider.isBuiltIn !== 'boolean') return 'providerBuiltInInvalid';
  }

  return null;
}

export function validateProviderList(providers: unknown): providers is SearchProvider[] {
  if (!Array.isArray(providers)) return false;

  const seenIds: string[] = [];
  for (const provider of providers) {
    const error = validateProvider(provider, seenIds, { requireFlags: true });
    if (error) return false;
    seenIds.push(provider.id.trim());
  }

  return true;
}
