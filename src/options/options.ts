import { APP_META, UI_TEXT } from '../config/app';
import { getSettings, saveSettings, resetSettings } from '../shared/storage';
import { $, create } from '../shared/dom';
import { SearchProvider, validateProvider } from '../domain/provider';
import { getProviderInitial } from '../shared/provider-avatar';

async function init() {
  const settings = await getSettings();

  document.title = `${APP_META.productName} - ${UI_TEXT.openSettings}`;
  $('#title').textContent = APP_META.productName;
  $('#description').textContent = APP_META.description;
  $('#providers-title').textContent = UI_TEXT.providersTitle;
  $('#add-provider-btn').textContent = UI_TEXT.addProvider;
  $('#restore-defaults-btn').textContent = UI_TEXT.restoreDefaults;
  $('#cancel-btn').textContent = UI_TEXT.cancel;
  $('#save-btn').textContent = UI_TEXT.save;
  $('#name-label').textContent = UI_TEXT.providerNameLabel;
  $('#url-label').textContent = UI_TEXT.providerUrlLabel;
  $('#url-help').textContent = UI_TEXT.providerUrlHelp;
  $('#url').setAttribute('placeholder', UI_TEXT.providerUrlPlaceholder);

  renderProviders(settings.providers);

  $('#add-provider-btn').onclick = () => showModal();
  $('#restore-defaults-btn').onclick = async () => {
    if (confirm(UI_TEXT.confirmRestoreDefaults)) {
      await resetSettings();
      location.reload();
    }
  };

  $('#cancel-btn').onclick = hideModal;
  $('#provider-form').onsubmit = handleSaveProvider;
}

function renderProviders(providers: SearchProvider[]) {
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
              textContent: UI_TEXT.edit,
              onclick: () => showModal(provider),
            })
          : '',
        !provider.isBuiltIn
          ? create('button', {
              className: 'btn-icon',
              textContent: UI_TEXT.remove,
              onclick: () => removeProvider(provider.id),
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

async function removeProvider(id: string) {
  if (confirm(UI_TEXT.confirmRemoveProvider)) {
    const settings = await getSettings();
    settings.providers = settings.providers.filter((p) => p.id !== id || p.isBuiltIn);
    await saveSettings(settings);
    renderProviders(settings.providers);
  }
}

function showModal(provider?: SearchProvider) {
  const modal = $('#modal');
  const title = $('#modal-title');
  const nameInput = $('#name') as HTMLInputElement;
  const urlInput = $('#url') as HTMLInputElement;
  const idInput = $('#edit-id') as HTMLInputElement;

  title.textContent = provider ? UI_TEXT.edit : UI_TEXT.addProvider;
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

async function handleSaveProvider(e: Event) {
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
    showToast(error, 'error');
    return;
  }

  const existingIndex = settings.providers.findIndex((p) => p.id === id);
  if (existingIndex > -1) {
    if (settings.providers[existingIndex].isBuiltIn) {
      showToast(UI_TEXT.providerUnavailable, 'error');
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
  showToast(UI_TEXT.providerSaved);
  hideModal();
  renderProviders(settings.providers);
}

document.addEventListener('DOMContentLoaded', init);
