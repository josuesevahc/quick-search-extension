import { describe, expect, it } from 'vitest';
import {
  addSearchHistoryEntry,
  findSearchSuggestions,
  normalizeSearchHistory,
} from '../src/domain/search-history';

describe('search history', () => {
  it('ranks prefix matches before includes matches and recency within each group', () => {
    const history = [
      { query: 'open chrome docs', providerId: 'google', searchedAt: 30 },
      { query: 'chrome extension', providerId: 'google', searchedAt: 20 },
      { query: 'quick chrome', providerId: 'bing', searchedAt: 10 },
    ];

    expect(findSearchSuggestions(history, 'chrome').map(entry => entry.query)).toEqual([
      'chrome extension',
      'open chrome docs',
      'quick chrome',
    ]);
  });

  it('caps stored history to the configured limit', () => {
    const history = Array.from({ length: 4 }).reduce(
      (entries, _, index) => addSearchHistoryEntry(entries, `query ${index}`, 'google', index, 3),
      [] as ReturnType<typeof normalizeSearchHistory>
    );

    expect(history).toHaveLength(3);
    expect(history.map(entry => entry.query)).toEqual(['query 3', 'query 2', 'query 1']);
  });

  it('does not store empty, whitespace-only, or duplicate consecutive queries', () => {
    let history = addSearchHistoryEntry([], '   ', 'google', 1);
    history = addSearchHistoryEntry(history, 'docs', 'google', 2);
    history = addSearchHistoryEntry(history, 'docs', 'bing', 3);

    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ query: 'docs', providerId: 'google' });
  });

  it('normalizes corrupted history entries', () => {
    expect(
      normalizeSearchHistory([
        { query: ' valid ', providerId: 'google', searchedAt: 1 },
        { query: '', providerId: 'google', searchedAt: 2 },
        { query: 'bad', providerId: '', searchedAt: 3 },
      ])
    ).toEqual([{ query: 'valid', providerId: 'google', searchedAt: 1 }]);
  });
});
