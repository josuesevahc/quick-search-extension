import { describe, expect, it } from 'vitest';
import { getEffectiveProvider } from '../src/domain/provider-selection';
import { SearchProvider } from '../src/domain/provider';

const providers: SearchProvider[] = [
  {
    id: 'google',
    name: 'Google',
    searchUrlTemplate: 'https://www.google.com/search?q={searchTerms}',
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: 'bing',
    name: 'Bing',
    searchUrlTemplate: 'https://www.bing.com/search?q={searchTerms}',
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    searchUrlTemplate: 'https://disabled.example.com?q={searchTerms}',
    enabled: false,
    isBuiltIn: false,
  },
];

describe('getEffectiveProvider', () => {
  it('uses the internal default provider', () => {
    expect(
      getEffectiveProvider({
        providers,
        defaultProviderId: 'bing',
      })?.id
    ).toBe('bing');
  });

  it('prioritizes the temporary tab provider over the default', () => {
    expect(
      getEffectiveProvider({
        providers,
        defaultProviderId: 'google',
        tabProviderId: 'bing',
      })?.id
    ).toBe('bing');
  });

  it('falls back when the default provider is disabled', () => {
    expect(
      getEffectiveProvider({
        providers,
        defaultProviderId: 'disabled',
      })?.id
    ).toBe('google');
  });

  it('returns null when there are no active providers', () => {
    expect(
      getEffectiveProvider({
        providers: providers.map(provider => ({ ...provider, enabled: false })),
        defaultProviderId: 'google',
      })
    ).toBeNull();
  });
});
