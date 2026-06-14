export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export async function openUrl(url: string, newTab: boolean = false): Promise<void> {
  if (newTab) {
    await chrome.tabs.create({ url });
  } else {
    const tab = await getCurrentTab();
    if (tab.id) {
      await chrome.tabs.update(tab.id, { url });
    } else {
      await chrome.tabs.create({ url });
    }
  }
}
