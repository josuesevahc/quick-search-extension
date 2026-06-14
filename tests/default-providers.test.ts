import { describe, expect, it } from 'vitest';
import { DEFAULT_PROVIDERS } from '../src/config/default-providers';
import { SEARCH_TERMS_TOKEN, validateProviderList } from '../src/domain/provider';

describe('DEFAULT_PROVIDERS', () => {
  it('contains valid built-in providers with unique IDs', () => {
    const ids = DEFAULT_PROVIDERS.map((provider) => provider.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(validateProviderList(DEFAULT_PROVIDERS)).toBe(true);
    expect(DEFAULT_PROVIDERS.every((provider) => provider.name.trim().length > 0)).toBe(true);
    expect(
      DEFAULT_PROVIDERS.every((provider) =>
        provider.searchUrlTemplate.includes(SEARCH_TERMS_TOKEN),
      ),
    ).toBe(true);
  });

  it('includes the essential provider catalog', () => {
    expect(DEFAULT_PROVIDERS.map((provider) => provider.id)).toEqual(
      expect.arrayContaining([
        'google',
        'bing',
        'duckduckgo',
        'brave',
        'perplexity',
        'you',
        'ecosia',
        'startpage',
        'qwant',
        'kagi',
      ]),
    );
  });
});
