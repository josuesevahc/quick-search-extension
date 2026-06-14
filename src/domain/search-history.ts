export type SearchHistoryEntry = {
  query: string;
  providerId: string;
  searchedAt: number;
};

export const DEFAULT_SEARCH_HISTORY_LIMIT = 50;
export const MAX_SEARCH_SUGGESTIONS = 5;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeSearchHistory(
  value: unknown,
  limit: number = DEFAULT_SEARCH_HISTORY_LIMIT
): SearchHistoryEntry[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is SearchHistoryEntry => {
      if (!isRecord(entry)) return false;
      return (
        typeof entry.query === 'string' &&
        entry.query.trim().length > 0 &&
        typeof entry.providerId === 'string' &&
        entry.providerId.trim().length > 0 &&
        typeof entry.searchedAt === 'number' &&
        Number.isFinite(entry.searchedAt)
      );
    })
    .map(entry => ({
      query: entry.query.trim(),
      providerId: entry.providerId,
      searchedAt: entry.searchedAt,
    }))
    .sort((a, b) => b.searchedAt - a.searchedAt)
    .slice(0, limit);
}

export function addSearchHistoryEntry(
  history: SearchHistoryEntry[],
  query: string,
  providerId: string,
  searchedAt: number = Date.now(),
  limit: number = DEFAULT_SEARCH_HISTORY_LIMIT
): SearchHistoryEntry[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || !providerId.trim()) return normalizeSearchHistory(history, limit);

  const normalized = normalizeSearchHistory(history, limit);
  const latest = normalized[0];
  if (latest?.query === trimmedQuery) {
    return normalized;
  }

  return [{ query: trimmedQuery, providerId, searchedAt }, ...normalized].slice(0, limit);
}

export function findSearchSuggestions(
  history: SearchHistoryEntry[],
  input: string,
  limit: number = MAX_SEARCH_SUGGESTIONS
): SearchHistoryEntry[] {
  const trimmedInput = input.trim().toLowerCase();
  if (!trimmedInput) return [];

  const uniqueByQuery = new Map<string, SearchHistoryEntry>();
  normalizeSearchHistory(history).forEach(entry => {
    const key = entry.query.toLowerCase();
    if (!uniqueByQuery.has(key)) {
      uniqueByQuery.set(key, entry);
    }
  });

  return [...uniqueByQuery.values()]
    .map(entry => {
      const query = entry.query.toLowerCase();
      const rank = query.startsWith(trimmedInput) ? 0 : query.includes(trimmedInput) ? 1 : 2;
      return { entry, rank };
    })
    .filter(item => item.rank < 2)
    .sort((a, b) => a.rank - b.rank || b.entry.searchedAt - a.entry.searchedAt)
    .slice(0, limit)
    .map(item => item.entry);
}
