export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

export function normalizeThemePreference(value: unknown): ThemePreference {
  return typeof value === 'string' && THEME_PREFERENCES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : 'system';
}

export function resolveThemeMode(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  return systemPrefersDark ? 'dark' : 'light';
}

function getSystemThemeQuery(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;
}

function applyResolvedTheme(preference: ThemePreference, query: MediaQueryList | null) {
  const resolvedTheme = resolveThemeMode(preference, !!query?.matches);
  document.documentElement.dataset.theme = preference;
  document.documentElement.dataset.resolvedTheme = resolvedTheme;
}

export function bindThemePreference(preferenceValue: unknown): () => void {
  const preference = normalizeThemePreference(preferenceValue);
  const query = getSystemThemeQuery();
  applyResolvedTheme(preference, query);

  if (preference !== 'system' || !query) {
    return () => undefined;
  }

  const handleChange = () => applyResolvedTheme(preference, query);
  query.addEventListener?.('change', handleChange);
  return () => query.removeEventListener?.('change', handleChange);
}
