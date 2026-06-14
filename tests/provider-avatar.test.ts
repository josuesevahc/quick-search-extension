import { describe, expect, it } from 'vitest';
import { getProviderInitial } from '../src/shared/provider-avatar';

describe('getProviderInitial', () => {
  it('builds a compact fallback from the provider name', () => {
    expect(getProviderInitial('Google')).toBe('G');
    expect(getProviderInitial('DuckDuckGo')).toBe('D');
    expect(getProviderInitial(' Perplexity ')).toBe('P');
  });

  it('uses a safe fallback for blank names', () => {
    expect(getProviderInitial('   ')).toBe('?');
  });
});
