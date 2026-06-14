import { APP_META, UI_TEXT } from '../config/app';
import {
  getSettings,
  setDefaultProvider,
  setTabProviderOverride,
  clearTabProviderOverride,
} from '../shared/storage';
import { buildSearchUrl } from '../domain/search-url';
import { openUrl, getCurrentTab } from '../shared/chrome-api';
import { $, create } from '../shared/dom';
import { getEffectiveProvider } from '../domain/provider-selection';
import { getProviderInitial } from '../shared/provider-avatar';

async function init() {
  let settings = await getSettings();
  const currentTab = await getCurrentTab();
  const currentTabId = typeof currentTab.id === 'number' ? currentTab.id : null;
  const activeProviders = settings.providers.filter((p) => p.enabled);
  const effectiveProvider = getEffectiveProvider({
    providers: settings.providers,
    defaultProviderId: settings.defaultProviderId,
    tabProviderId: currentTabId === null ? null : settings.tabProviderOverrides[currentTabId],
  });
  let selectedId = effectiveProvider?.id ?? null;

  document.title = APP_META.productName;
  $('#search-input').setAttribute('placeholder', UI_TEXT.searchPlaceholder);
  $('#search-current-tab').textContent = UI_TEXT.searchCurrentTab;
  $('#search-new-tab').textContent = UI_TEXT.searchNewTab;
  $('#temp-override-label').textContent = UI_TEXT.temporaryForTab;
  $('#settings-link').textContent = UI_TEXT.openSettings;

  const providerList = $('#provider-list');
  const status = $('#status');
  const tempOverride = $('#temp-override') as HTMLInputElement;
  tempOverride.checked = currentTabId !== null && !!settings.tabProviderOverrides[currentTabId];
  tempOverride.disabled = currentTabId === null || activeProviders.length === 0;

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
        create('div', { className: 'empty-state' }, [UI_TEXT.noActiveProviders]),
      );
      return;
    }

    activeProviders.forEach((provider) => {
      const defaultButton =
        provider.id === settings.defaultProviderId
          ? create('span', { className: 'badge' }, [UI_TEXT.defaultProvider])
          : create('button', {
              className: 'set-default',
              type: 'button',
              textContent: UI_TEXT.setDefaultProvider,
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

  async function executeSearch(newTab: boolean) {
    const query = ($('#search-input') as HTMLInputElement).value.trim();
    if (!query) {
      showStatus(UI_TEXT.searchTermRequired);
      return;
    }

    const provider = activeProviders.find((p) => p.id === selectedId);
    if (!provider) {
      showStatus(UI_TEXT.providerUnavailable);
      return;
    }

    const url = buildSearchUrl(provider, query);
    await openUrl(url, newTab);
    window.close();
  }

  $('#search-input').onkeydown = (e) => {
    if (e.key === 'Enter') {
      executeSearch(e.shiftKey);
    }
  };

  $('#search-current-tab').onclick = () => executeSearch(false);
  $('#search-new-tab').onclick = () => executeSearch(true);
  renderProviderList();
}

document.addEventListener('DOMContentLoaded', init);
