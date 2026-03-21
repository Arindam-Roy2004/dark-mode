import { MessagePayload, SiteSettings, DEFAULT_SITE_SETTINGS } from '../utils/types';
import { enable, disable, setTheme, updateSettings, isActive, getCurrentThemeId } from './darkModeEngine';

// Domain for this page
const domain = window.location.hostname;

// Initialize: check stored settings on load
function initialize(): void {
  chrome.storage.local.get([domain, '__dark_mode_global__'], (result) => {
    const globalSettings = result['__dark_mode_global__'];
    const siteSettings: SiteSettings = result[domain] || { ...DEFAULT_SITE_SETTINGS };

    // If global is disabled, don't apply
    if (globalSettings && globalSettings.enabled === false) return;

    // If site is enabled, apply dark mode
    if (siteSettings.enabled) {
      enable(
        siteSettings.themeId || 'aurora-edge',
        siteSettings.brightness || 100,
        siteSettings.contrast || 100,
        siteSettings.sepia || 0
      );
    }
  });
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message: MessagePayload, _sender, sendResponse) => {
  switch (message.type) {
    case 'TOGGLE_DARK_MODE':
      if (message.enabled) {
        const themeId = message.themeId || 'aurora-edge';
        enable(themeId, message.settings?.brightness, message.settings?.contrast, message.settings?.sepia);
      } else {
        disable();
      }
      sendResponse({ success: true });
      break;

    case 'SET_THEME':
      if (message.themeId) {
        setTheme(message.themeId);
      }
      sendResponse({ success: true });
      break;

    case 'UPDATE_SETTINGS':
      if (message.settings) {
        if (message.settings.enabled && !isActive()) {
          enable(
            message.settings.themeId,
            message.settings.brightness,
            message.settings.contrast,
            message.settings.sepia
          );
        } else if (!message.settings.enabled && isActive()) {
          disable();
        } else if (isActive()) {
          setTheme(message.settings.themeId);
          updateSettings(
            message.settings.brightness,
            message.settings.contrast,
            message.settings.sepia
          );
        }
      }
      sendResponse({ success: true });
      break;

    case 'GET_STATUS':
      sendResponse({
        active: isActive(),
        themeId: getCurrentThemeId(),
        domain,
      });
      break;
  }

  return true; // Keep channel open for async responses
});

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
