import { clearTabProviderOverride, getSettings, saveSettings } from '../shared/storage';

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  await saveSettings(settings);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await clearTabProviderOverride(tabId);
});
