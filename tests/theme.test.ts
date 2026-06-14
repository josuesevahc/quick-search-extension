import { describe, expect, it } from 'vitest';
import {
  normalizeThemePreference,
  resolveThemeMode,
  THEME_PREFERENCES,
} from '../src/shared/theme';

describe('theme preference', () => {
  it('supports system, light, and dark preferences', () => {
    expect(THEME_PREFERENCES).toEqual(['system', 'light', 'dark']);
  });

  it('normalizes invalid theme values to system', () => {
    expect(normalizeThemePreference('light')).toBe('light');
    expect(normalizeThemePreference('dark')).toBe('dark');
    expect(normalizeThemePreference('system')).toBe('system');
    expect(normalizeThemePreference('sepia')).toBe('system');
    expect(normalizeThemePreference(null)).toBe('system');
  });

  it('resolves system mode from the current system preference', () => {
    expect(resolveThemeMode('system', false)).toBe('light');
    expect(resolveThemeMode('system', true)).toBe('dark');
  });

  it('manual overrides do not depend on system preference', () => {
    expect(resolveThemeMode('light', true)).toBe('light');
    expect(resolveThemeMode('dark', false)).toBe('dark');
  });
});
