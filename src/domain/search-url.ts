import { InvalidProviderError, SearchProvider, SEARCH_TERMS_TOKEN, validateProvider } from './provider';

export function buildSearchUrl(provider: SearchProvider, searchTerms: string): string {
  const validationError = validateProvider(provider);
  if (validationError) {
    throw new InvalidProviderError(`Invalid provider: ${validationError}`);
  }

  const encodedTerms = encodeURIComponent(searchTerms);
  return provider.searchUrlTemplate.split(SEARCH_TERMS_TOKEN).join(encodedTerms);
}
