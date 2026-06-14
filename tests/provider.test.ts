import { describe, expect, it } from 'vitest';
import { validateProvider, validateProviderList } from '../src/domain/provider';

describe('validateProvider', () => {
  it('accepts a valid HTTPS provider template', () => {
    expect(
      validateProvider({
        id: 'docs',
        name: 'Docs',
        searchUrlTemplate: 'https://docs.example.com/search?q={searchTerms}',
      })
    ).toBeNull();
  });

  it('rejects duplicate ids', () => {
    expect(
      validateProvider(
        {
          id: 'google',
          name: 'Google',
          searchUrlTemplate: 'https://www.google.com/search?q={searchTerms}',
        },
        ['google']
      )
    ).toBe('duplicateId');
  });

  it('rejects non-HTTPS templates', () => {
    expect(
      validateProvider({
        id: 'insecure',
        name: 'Insecure',
        searchUrlTemplate: 'http://example.com/search?q={searchTerms}',
      })
    ).toBe('providerHttpsRequired');
  });

  it('rejects templates without searchTerms placeholder', () => {
    expect(
      validateProvider({
        id: 'missing-placeholder',
        name: 'Missing Placeholder',
        searchUrlTemplate: 'https://example.com/search',
      })
    ).toBe('providerSearchTermsRequired');
  });

  it('rejects javascript templates', () => {
    expect(
      validateProvider({
        id: 'bad',
        name: 'Bad',
        searchUrlTemplate: 'javascript:alert({searchTerms})',
      })
    ).toBe('providerInvalidProtocol');
  });

  it('rejects empty URLs', () => {
    expect(
      validateProvider({
        id: 'empty',
        name: 'Empty',
        searchUrlTemplate: '   ',
      })
    ).toBe('providerUrlRequired');
  });

  it('rejects corrupted providers from storage', () => {
    expect(
      validateProviderList([
        {
          id: 'docs',
          name: 'Docs',
          searchUrlTemplate: 'https://docs.example.com?q={searchTerms}',
          enabled: true,
        },
      ])
    ).toBe(false);
  });

  it('rejects duplicated providers in a list', () => {
    expect(
      validateProviderList([
        {
          id: 'docs',
          name: 'Docs',
          searchUrlTemplate: 'https://docs.example.com?q={searchTerms}',
          enabled: true,
          isBuiltIn: false,
        },
        {
          id: 'docs',
          name: 'Docs Copy',
          searchUrlTemplate: 'https://copy.example.com?q={searchTerms}',
          enabled: true,
          isBuiltIn: false,
        },
      ])
    ).toBe(false);
  });
});
