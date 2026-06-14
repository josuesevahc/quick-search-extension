import { describe, expect, it } from 'vitest';
import {
  getSuggestionClickAction,
  getSuggestionKeyboardAction,
} from '../src/domain/suggestion-acceptance';

describe('suggestion acceptance behavior', () => {
  it('clicking a suggestion accepts it without submitting', () => {
    expect(getSuggestionClickAction(true)).toBe('accept');
    expect(getSuggestionClickAction(false)).toBe('none');
  });

  it('accepts highlighted suggestions without submitting', () => {
    expect(getSuggestionKeyboardAction('Tab', true, true)).toBe('accept');
    expect(getSuggestionKeyboardAction('ArrowRight', true, true)).toBe('accept');
    expect(getSuggestionKeyboardAction('Enter', true, true)).toBe('accept');
  });

  it('does not submit Enter while suggestions are open without a highlight', () => {
    expect(getSuggestionKeyboardAction('Enter', false, true)).toBe('none');
  });

  it('submits only on Enter after the suggestion list is closed', () => {
    expect(getSuggestionKeyboardAction('Enter', false, false)).toBe('submit');
  });

  it('keeps compact navigation and close behavior', () => {
    expect(getSuggestionKeyboardAction('ArrowDown', false, true)).toBe('move-next');
    expect(getSuggestionKeyboardAction('ArrowUp', false, true)).toBe('move-previous');
    expect(getSuggestionKeyboardAction('Escape', true, true)).toBe('close');
  });

  it('leaves non-acceptance keys alone', () => {
    expect(getSuggestionKeyboardAction('ArrowRight', false, true)).toBe('none');
    expect(getSuggestionKeyboardAction('Tab', false, true)).toBe('none');
  });
});
