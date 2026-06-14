import { describe, expect, it } from 'vitest';
import { buildSearchUrl } from '../src/domain/search-url';
import { InvalidProviderError, SearchProvider } from '../src/domain/provider';

const provider: SearchProvider = {
  id: 'example',
  name: 'Example',
  searchUrlTemplate: 'https://example.com/search?q={searchTerms}',
  enabled: true,
  isBuiltIn: false,
};

describe('buildSearchUrl', () => {
  it('replaces search terms with an encoded query', () => {
    expect(buildSearchUrl(provider, 'quick search extensão')).toBe(
      'https://example.com/search?q=quick%20search%20extens%C3%A3o'
    );
  });

  it('encodes spaces, accents and symbols', () => {
    expect(buildSearchUrl(provider, 'café & leite + pão?')).toBe(
      'https://example.com/search?q=caf%C3%A9%20%26%20leite%20%2B%20p%C3%A3o%3F'
    );
  });

  it('preserves the rest of the template', () => {
    expect(
      buildSearchUrl(
        {
          ...provider,
          searchUrlTemplate: 'https://example.com/search?source=quick&q={searchTerms}&type=web',
        },
        'docs'
      )
    ).toBe('https://example.com/search?source=quick&q=docs&type=web');
  });

  it('supports an empty query', () => {
    expect(buildSearchUrl(provider, '')).toBe('https://example.com/search?q=');
  });

  it('throws when the provider template does not contain the placeholder', () => {
    expect(() =>
      buildSearchUrl({ ...provider, searchUrlTemplate: 'https://example.com/search' }, 'query')
    ).toThrow(InvalidProviderError);
  });
});
