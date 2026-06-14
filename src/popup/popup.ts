import {
  getSettings,
  recordSearch,
  setDefaultProvider,
  setTabProviderOverride,
  clearTabProviderOverride,
} from '../shared/storage';
import { buildSearchUrl } from '../domain/search-url';
import { openUrl, getCurrentTab, isIncognitoContext } from '../shared/chrome-api';
import { $, create } from '../shared/dom';
import { getEffectiveProvider } from '../domain/provider-selection';
import { getProviderInitial } from '../shared/provider-avatar';
import { findSearchSuggestions, SearchHistoryEntry } from '../domain/search-history';
import { createTranslator } from '../shared/i18n';

async function init() {
  let settings = await getSettings();
  const { t } = createTranslator(settings.language);
  const currentTab = await getCurrentTab();
  const currentTabId = typeof currentTab.id === 'number' ? currentTab.id : null;
  const activeProviders = settings.providers.filter((p) => p.enabled);
  const effectiveProvider = getEffectiveProvider({
    providers: settings.providers,
    defaultProviderId: settings.defaultProviderId,
    tabProviderId: currentTabId === null ? null : settings.tabProviderOverrides[currentTabId],
  });
  let selectedId = effectiveProvider?.id ?? null;
  let highlightedSuggestionIndex = -1;
  let currentSuggestions: SearchHistoryEntry[] = [];

  document.title = t('appName');
  $('#search-input').setAttribute('placeholder', t('searchPlaceholder'));
  $('#search-current-tab').textContent = t('searchCurrentTab');
  $('#search-new-tab').textContent = t('searchNewTab');
  $('#temp-override-label').textContent = t('temporaryForTab');
  $('#settings-link').textContent = t('openSettings');

  const searchInput = $('#search-input') as HTMLInputElement;
  const suggestionsList = $('#suggestions-list');
  const providerList = $('#provider-list');
  const status = $('#status');
  const tempOverride = $('#temp-override') as HTMLInputElement;
  tempOverride.checked = currentTabId !== null && !!settings.tabProviderOverrides[currentTabId];
  tempOverride.disabled = currentTabId === null || activeProviders.length === 0;
  searchInput.setAttribute('aria-label', t('searchPlaceholder'));
  searchInput.setAttribute('aria-controls', 'suggestions-list');
  suggestionsList.setAttribute('aria-label', t('suggestionsLabel'));

  function showStatus(message: string) {
    status.textContent = message;
  }

  function clearStatus() {
    status.textContent = '';
  }

  function renderProviderList() {
    providerList.innerHTML = '';

    if (activeProviders.length === 0) {
      providerList.appendChild(
        create('div', { className: 'empty-state' }, [t('noActiveProviders')]),
      );
      return;
    }

    activeProviders.forEach((provider) => {
      const defaultButton =
        provider.id === settings.defaultProviderId
          ? create('span', { className: 'badge' }, [t('defaultProvider')])
          : create('button', {
              className: 'set-default',
              type: 'button',
              textContent: t('setDefaultProvider'),
              onclick: async (event: MouseEvent) => {
                event.stopPropagation();
                await setDefaultProvider(provider.id);
                settings = await getSettings();
                renderProviderList();
              },
            });

      const item = create(
        'div',
        {
          className: `provider-item ${provider.id === selectedId ? 'selected' : ''}`,
          onclick: () => selectProvider(provider.id),
        },
        [
          create('span', { className: 'provider-avatar', ariaHidden: 'true' }, [
            getProviderInitial(provider.name),
          ]),
          create('span', { className: 'name' }, [provider.name]),
          defaultButton,
        ],
      );

      item.dataset.providerId = provider.id;
      item.ondblclick = () => executeSearch(false);
      providerList.appendChild(item);
    });
  }

  tempOverride.onchange = async () => {
    if (currentTabId === null || selectedId === null) return;
    if (tempOverride.checked) {
      await setTabProviderOverride(currentTabId, selectedId);
    } else {
      await clearTabProviderOverride(currentTabId);
    }
  };

  function selectProvider(id: string) {
    selectedId = id;
    document.querySelectorAll('.provider-item').forEach((el) => {
      el.classList.toggle('selected', (el as HTMLElement).dataset.providerId === id);
    });
    clearStatus();
    if (tempOverride.checked && currentTabId !== null) {
      void setTabProviderOverride(currentTabId, id);
    }
  }

  function renderSuggestions() {
    suggestionsList.innerHTML = '';
    highlightedSuggestionIndex = Math.min(highlightedSuggestionIndex, currentSuggestions.length - 1);
    suggestionsList.classList.toggle('hidden', currentSuggestions.length === 0);
    searchInput.setAttribute('aria-expanded', String(currentSuggestions.length > 0));

    currentSuggestions.forEach((suggestion, index) => {
      const item = create('button', {
        className: `suggestion-item ${index === highlightedSuggestionIndex ? 'highlighted' : ''}`,
        type: 'button',
        textContent: suggestion.query,
        onclick: () => {
          searchInput.value = suggestion.query;
          currentSuggestions = [];
          renderSuggestions();
          void executeSearch(false);
        },
      });
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(index === highlightedSuggestionIndex));
      suggestionsList.appendChild(item);
    });
  }

  function updateSuggestions() {
    if (!settings.searchHistoryEnabled) {
      currentSuggestions = [];
      renderSuggestions();
      return;
    }

    currentSuggestions = findSearchSuggestions(settings.searchHistory, searchInput.value);
    highlightedSuggestionIndex = -1;
    renderSuggestions();
  }

  function closeSuggestions() {
    currentSuggestions = [];
    highlightedSuggestionIndex = -1;
    renderSuggestions();
  }

  function moveSuggestionHighlight(delta: number) {
    if (currentSuggestions.length === 0) return;
    highlightedSuggestionIndex =
      (highlightedSuggestionIndex + delta + currentSuggestions.length) % currentSuggestions.length;
    renderSuggestions();
  }

  async function executeSearch(newTab: boolean) {
    const query = searchInput.value.trim();
    if (!query) {
      showStatus(t('searchTermRequired'));
      return;
    }

    const provider = activeProviders.find((p) => p.id === selectedId);
    if (!provider) {
      showStatus(t('providerUnavailable'));
      return;
    }

    const url = buildSearchUrl(provider, query);
    if (!isIncognitoContext()) {
      await recordSearch(query, provider.id);
    }
    await openUrl(url, newTab);
    window.close();
  }

  searchInput.oninput = () => {
    clearStatus();
    updateSuggestions();
  };

  searchInput.onkeydown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSuggestionHighlight(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSuggestionHighlight(-1);
      return;
    }
    if (e.key === 'Escape') {
      closeSuggestions();
      return;
    }
    if (e.key === 'Enter') {
      if (highlightedSuggestionIndex >= 0 && currentSuggestions[highlightedSuggestionIndex]) {
        searchInput.value = currentSuggestions[highlightedSuggestionIndex].query;
      }
      closeSuggestions();
      void executeSearch(e.shiftKey);
    }
  };

  $('#search-current-tab').onclick = () => executeSearch(false);
  $('#search-new-tab').onclick = () => executeSearch(true);
  renderProviderList();
  renderSuggestions();
}

document.addEventListener('DOMContentLoaded', init);
