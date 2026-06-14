export type SearchProvider = {
  id: string;
  name: string;
  searchUrlTemplate: string;
  enabled: boolean;
  isBuiltIn: boolean;
};

export const SEARCH_TERMS_TOKEN = '{searchTerms}';

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
): string | null {
  if (!isPlainObject(provider)) return 'Provider inválido.';

  const id = typeof provider.id === 'string' ? provider.id.trim() : '';
  const name = typeof provider.name === 'string' ? provider.name.trim() : '';
  const template = typeof provider.searchUrlTemplate === 'string' ? provider.searchUrlTemplate.trim() : '';

  if (!id) return 'ID obrigatório.';
  if (existingIds.includes(id)) return 'ID duplicado.';
  if (!name) return 'Nome obrigatório.';
  if (!template) return 'URL obrigatória.';

  const normalizedTemplate = template.toLowerCase();
  if (normalizedTemplate.includes('javascript:')) return 'Protocolo inválido.';
  if (!normalizedTemplate.startsWith('https://')) return 'URL deve usar HTTPS.';
  if (!template.includes(SEARCH_TERMS_TOKEN)) return 'Template deve conter {searchTerms}.';

  try {
    const parseableTemplate = template.replaceAll(SEARCH_TERMS_TOKEN, 'test');
    const parsedUrl = new URL(parseableTemplate);
    if (parsedUrl.protocol !== 'https:') return 'URL deve usar HTTPS.';
  } catch {
    return 'URL inválida.';
  }

  if (options.requireFlags) {
    if (typeof provider.enabled !== 'boolean') return 'Campo enabled inválido.';
    if (typeof provider.isBuiltIn !== 'boolean') return 'Campo isBuiltIn inválido.';
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
