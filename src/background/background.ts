import { MessagePayload, TEMP_DISABLE_PREFIX } from '../utils/types';
import { getSiteSettings, getGlobalSettings, getExcludeList, isDomainExcluded } from '../utils/storage';

// ---- Temp-disable tracking (in-memory, per tab) ----
const tempDisabledTabs = new Map<number, number>(); // tabId -> re-enable timestamp

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

    // Check exclude list
    const excludes = await getExcludeList();
    if (isDomainExcluded(domain, excludes)) return;

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
    const excludes = await getExcludeList();

    if (isDomainExcluded(domain, excludes)) {
      chrome.action.setBadgeText({ text: 'OFF', tabId: activeInfo.tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId: activeInfo.tabId });
      return;
    }

    const siteSettings = await getSiteSettings(domain);
    const globalSettings = await getGlobalSettings();

    const isOn = globalSettings.enabled && siteSettings.enabled && !tempDisabledTabs.has(activeInfo.tabId);
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
      const excludes = await getExcludeList();

      if (isDomainExcluded(domain, excludes)) {
        chrome.action.setBadgeText({ text: 'OFF', tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId });
        return;
      }

      const siteSettings = await getSiteSettings(domain);
      const globalSettings = await getGlobalSettings();

      const isOn = globalSettings.enabled && siteSettings.enabled && !tempDisabledTabs.has(tabId);
      chrome.action.setBadgeText({ text: isOn ? 'ON' : '', tabId });
      chrome.action.setBadgeBackgroundColor({ color: isOn ? '#3b82f6' : '#64748b', tabId });
    } catch {
      // Ignore invalid URLs
    }
  }
});

// ---- Temp-disable alarm handler ----
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith(TEMP_DISABLE_PREFIX)) return;

  const tabId = parseInt(alarm.name.replace(TEMP_DISABLE_PREFIX, ''), 10);
  tempDisabledTabs.delete(tabId);

  // Re-enable dark mode on that tab
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;
    const siteSettings = await getSiteSettings(domain);
    const globalSettings = await getGlobalSettings();

    if (globalSettings.enabled && siteSettings.enabled) {
      chrome.tabs.sendMessage(tabId, {
        type: 'UPDATE_SETTINGS',
        settings: siteSettings,
      } as MessagePayload).catch(() => {});

      chrome.action.setBadgeText({ text: 'ON', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#3b82f6', tabId });
    }
  } catch {
    // Tab might have been closed
  }
});

// ---- Message handler for temp-disable requests from popup ----
chrome.runtime.onMessage.addListener((message: MessagePayload, sender, sendResponse) => {
  if (message.type === 'TEMP_DISABLE' && message.domain) {
    // Get the active tab and set temp-disable
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ success: false });
        return;
      }

      const tabId = tab.id;
      const alarmName = `${TEMP_DISABLE_PREFIX}${tabId}`;

      // Set 5-minute alarm
      chrome.alarms.create(alarmName, { delayInMinutes: 5 });
      tempDisabledTabs.set(tabId, Date.now() + 5 * 60 * 1000);

      // Disable dark mode on the tab immediately
      chrome.tabs.sendMessage(tabId, {
        type: 'TOGGLE_DARK_MODE',
        enabled: false,
        settings: { enabled: false, themeId: '', brightness: 100, contrast: 100, sepia: 0 },
      } as MessagePayload).catch(() => {});

      chrome.action.setBadgeText({ text: '⏱', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#f59e0b', tabId });

      sendResponse({ success: true, reenableAt: tempDisabledTabs.get(tabId) });
    });

    return true; // Keep channel open for async
  }

  if (message.type === 'TEMP_DISABLE_STATUS') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ tempDisabled: false });
        return;
      }

      const reenableAt = tempDisabledTabs.get(tab.id);
      if (reenableAt) {
        sendResponse({ tempDisabled: true, remainingMs: Math.max(0, reenableAt - Date.now()) });
      } else {
        sendResponse({ tempDisabled: false });
      }
    });

    return true; // Keep channel open for async
  }
});

// Clean up temp-disable entries when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tempDisabledTabs.has(tabId)) {
    tempDisabledTabs.delete(tabId);
    chrome.alarms.clear(`${TEMP_DISABLE_PREFIX}${tabId}`);
  }
});
