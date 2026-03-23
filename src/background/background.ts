import { MessagePayload } from '../utils/types';
import { getSiteSettings, getGlobalSettings } from '../utils/storage';

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-dark-mode') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url) return;

    let domain: string;
    try {
      domain = new URL(tab.url).hostname;
    } catch {
      return; // Non-parseable URL (chrome://, about:blank, etc.)
    }
    if (!domain) return;
    const siteSettings = await getSiteSettings(domain);
    const globalSettings = await getGlobalSettings();

    if (!globalSettings.enabled) return;

    // Toggle the site's dark mode
    const newEnabled = !siteSettings.enabled;
    const message: MessagePayload = {
      type: 'TOGGLE_DARK_MODE',
      enabled: newEnabled,
      themeId: siteSettings.themeId || globalSettings.defaultThemeId,
      settings: { ...siteSettings, enabled: newEnabled },
    };

    chrome.tabs.sendMessage(tab.id, message).catch(() => {
      // Content script not available on this tab — ignore silently
    });

    // Persist the change
    chrome.storage.local.set({
      [domain]: { ...siteSettings, enabled: newEnabled },
    });
  }
});

// Handle extension install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      '__dark_mode_global__': {
        enabled: true,
        defaultThemeId: 'aurora-edge',
        defaultBrightness: 100,
        defaultContrast: 100,
        defaultSepia: 0,
      },
    });
  }
});

// Badge management — show ON/OFF state on the icon
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (!tab.url) return;

  try {
    const domain = new URL(tab.url).hostname;
    const siteSettings = await getSiteSettings(domain);
    const globalSettings = await getGlobalSettings();

    const isOn = globalSettings.enabled && siteSettings.enabled;
    chrome.action.setBadgeText({ text: isOn ? 'ON' : '', tabId: activeInfo.tabId });
    chrome.action.setBadgeBackgroundColor({ color: isOn ? '#3b82f6' : '#64748b', tabId: activeInfo.tabId });
  } catch {
    // Ignore invalid URLs
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const domain = new URL(tab.url).hostname;
      const siteSettings = await getSiteSettings(domain);
      const globalSettings = await getGlobalSettings();

      const isOn = globalSettings.enabled && siteSettings.enabled;
      chrome.action.setBadgeText({ text: isOn ? 'ON' : '', tabId });
      chrome.action.setBadgeBackgroundColor({ color: isOn ? '#3b82f6' : '#64748b', tabId });
    } catch {
      // Ignore invalid URLs
    }
  }
});
