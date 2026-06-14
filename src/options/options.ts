import {
  clearSearchHistory,
  getSettings,
  resetSettings,
  saveSettings,
  setLanguage,
  setSearchHistoryEnabled,
} from '../shared/storage';
import { $, create } from '../shared/dom';
import { SearchProvider, validateProvider } from '../domain/provider';
import { getProviderInitial } from '../shared/provider-avatar';
import { createTranslator, MessageKey } from '../shared/i18n';

async function init() {
  let settings = await getSettings();
  const { t } = createTranslator(settings.language);

  document.title = `${t('appName')} - ${t('openSettings')}`;
  $('#title').textContent = t('appName');
  $('#description').textContent = t('appDescription');
  $('#providers-title').textContent = t('providersTitle');
  $('#preferences-title').textContent = t('preferencesTitle');
  $('#add-provider-btn').textContent = t('addProvider');
  $('#restore-defaults-btn').textContent = t('restoreDefaults');
  $('#clear-search-history-btn').textContent = t('clearSearchHistory');
  $('#cancel-btn').textContent = t('cancel');
  $('#save-btn').textContent = t('save');
  $('#name-label').textContent = t('providerNameLabel');
  $('#url-label').textContent = t('providerUrlLabel');
  $('#url-help').textContent = t('providerUrlHelp');
  $('#url').setAttribute('placeholder', t('providerUrlPlaceholder'));
  $('#language-label').textContent = t('languageLabel');
  $('#local-history-label').textContent = t('localHistoryLabel');
  $('#local-history-help').textContent = t('localHistoryHelp');

  const languageSelect = $('#language-select') as HTMLSelectElement;
  const searchHistoryEnabled = $('#search-history-enabled') as HTMLInputElement;
  languageSelect.appendChild(create('option', { value: '', textContent: t('languageAuto') }));
  languageSelect.appendChild(create('option', { value: 'en', textContent: t('languageEnglish') }));
  languageSelect.appendChild(create('option', { value: 'pt_BR', textContent: t('languagePortuguese') }));
  languageSelect.value = settings.language ?? '';
  searchHistoryEnabled.checked = settings.searchHistoryEnabled;

  renderProviders(settings.providers, t);

  languageSelect.onchange = async () => {
    await setLanguage(languageSelect.value === '' ? null : languageSelect.value as 'en' | 'pt_BR');
    location.reload();
  };

  searchHistoryEnabled.onchange = async () => {
    await setSearchHistoryEnabled(searchHistoryEnabled.checked);
    settings = await getSettings();
    showToast(t('settingsSaved'));
  };

  $('#clear-search-history-btn').onclick = async () => {
    await clearSearchHistory();
    settings = await getSettings();
    showToast(t('searchHistoryCleared'));
  };

  $('#add-provider-btn').onclick = () => showModal(undefined, t);
  $('#restore-defaults-btn').onclick = async () => {
    if (confirm(t('confirmRestoreDefaults'))) {
      await resetSettings();
      location.reload();
    }
  };

  $('#cancel-btn').onclick = hideModal;
  $('#provider-form').onsubmit = (event) => handleSaveProvider(event, t);
}

function renderProviders(providers: SearchProvider[], t: (key: MessageKey) => string) {
  const list = $('#providers-list');
  list.innerHTML = '';

  providers.forEach((provider) => {
    const row = create('div', { className: 'provider-row' }, [
      create('span', { className: 'provider-avatar', ariaHidden: 'true' }, [
        getProviderInitial(provider.name),
      ]),
      create('div', { className: 'info' }, [
        create('span', { className: 'name' }, [provider.name]),
        create('span', { className: 'url' }, [provider.searchUrlTemplate]),
      ]),
      create('div', { className: 'controls' }, [
        create('input', {
          type: 'checkbox',
          checked: provider.enabled,
          onchange: (e: any) => toggleProvider(provider.id, e.target.checked),
        }),
        !provider.isBuiltIn
          ? create('button', {
              className: 'btn-icon',
              textContent: t('edit'),
              onclick: () => showModal(provider),
            })
          : '',
        !provider.isBuiltIn
          ? create('button', {
              className: 'btn-icon',
              textContent: t('remove'),
              onclick: () => removeProvider(provider.id, t),
            })
          : '',
      ]),
    ]);
    list.appendChild(row);
  });
}

async function toggleProvider(id: string, enabled: boolean) {
  const settings = await getSettings();
  const provider = settings.providers.find((p) => p.id === id);
  if (provider) {
    provider.enabled = enabled;
    await saveSettings(settings);
  }
}

async function removeProvider(id: string, t: (key: MessageKey) => string) {
  if (confirm(t('confirmRemoveProvider'))) {
    const settings = await getSettings();
    settings.providers = settings.providers.filter((p) => p.id !== id || p.isBuiltIn);
    await saveSettings(settings);
    renderProviders(settings.providers, t);
  }
}

function showModal(provider?: SearchProvider, t = createTranslator().t) {
  const modal = $('#modal');
  const title = $('#modal-title');
  const nameInput = $('#name') as HTMLInputElement;
  const urlInput = $('#url') as HTMLInputElement;
  const idInput = $('#edit-id') as HTMLInputElement;

  title.textContent = provider ? t('edit') : t('addProvider');
  nameInput.value = provider ? provider.name : '';
  urlInput.value = provider ? provider.searchUrlTemplate : '';
  idInput.value = provider ? provider.id : '';

  modal.classList.remove('hidden');
}

function hideModal() {
  $('#modal').classList.add('hidden');
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = create('div', { className: `status-toast ${type}`, textContent: message });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function handleSaveProvider(e: Event, t: (key: MessageKey) => string) {
  e.preventDefault();
  const name = ($('#name') as HTMLInputElement).value;
  const url = ($('#url') as HTMLInputElement).value;
  const id = ($('#edit-id') as HTMLInputElement).value || `custom-${Date.now()}`;

  const settings = await getSettings();
  const error = validateProvider(
    { id, name, searchUrlTemplate: url },
    settings.providers.filter((p) => p.id !== id).map((p) => p.id),
  );

  if (error) {
    showToast(t(error), 'error');
    return;
  }

  const existingIndex = settings.providers.findIndex((p) => p.id === id);
  if (existingIndex > -1) {
    if (settings.providers[existingIndex].isBuiltIn) {
      showToast(t('providerUnavailable'), 'error');
      return;
    }
    settings.providers[existingIndex] = {
      ...settings.providers[existingIndex],
      name,
      searchUrlTemplate: url,
    };
  } else {
    settings.providers.push({ id, name, searchUrlTemplate: url, enabled: true, isBuiltIn: false });
  }

  await saveSettings(settings);
  showToast(t('providerSaved'));
  hideModal();
  renderProviders(settings.providers, t);
}

document.addEventListener('DOMContentLoaded', init);
