export type SuggestionKeyboardAction =
  | 'accept'
  | 'close'
  | 'move-next'
  | 'move-previous'
  | 'submit'
  | 'none';

export function getSuggestionKeyboardAction(
  key: string,
  hasHighlightedSuggestion: boolean,
  suggestionsOpen: boolean,
): SuggestionKeyboardAction {
  if (key === 'ArrowDown') return 'move-next';
  if (key === 'ArrowUp') return 'move-previous';
  if (key === 'Escape') return 'close';

  if ((key === 'Tab' || key === 'ArrowRight' || key === 'Enter') && hasHighlightedSuggestion) {
    return 'accept';
  }

  if (key === 'Enter' && !suggestionsOpen) {
    return 'submit';
  }

  return 'none';
}

export function getSuggestionClickAction(hasSuggestion: boolean): SuggestionKeyboardAction {
  return hasSuggestion ? 'accept' : 'none';
}
