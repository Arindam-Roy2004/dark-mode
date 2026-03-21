import React, { useState, useEffect, useCallback } from 'react';
import { themes } from '../content/themes';
import { SiteSettings, GlobalSettings, DEFAULT_SITE_SETTINGS, DEFAULT_GLOBAL_SETTINGS, MessagePayload } from '../utils/types';
import { SunIcon, MoonIcon, PowerIcon, GlobeIcon, GridIcon, SlidersIcon, CheckIcon } from './icons';

const App: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...DEFAULT_SITE_SETTINGS });
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [tabId, setTabId] = useState<number | null>(null);

  // Load settings on mount
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.url || !tab.id) return;
      setTabId(tab.id);

      try {
        const host = new URL(tab.url).hostname;
        setDomain(host);

        chrome.storage.sync.get([host, '__dark_mode_global__'], (result) => {
          const global: GlobalSettings = result['__dark_mode_global__'] || { ...DEFAULT_GLOBAL_SETTINGS };
          const site: SiteSettings = result[host] || { ...DEFAULT_SITE_SETTINGS };
          setGlobalEnabled(global.enabled);
          setSiteSettings(site);
        });
      } catch {
        setDomain('unknown');
      }
    });
  }, []);

  // Send message to content script
  const sendMessage = useCallback((msg: MessagePayload) => {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, msg);
    }
  }, [tabId]);

  // Persist + send
  const updateAndPersist = useCallback((newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    chrome.storage.sync.set({ [domain]: newSettings });
    sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: newSettings,
    });

    // Update badge
    if (tabId) {
      chrome.action.setBadgeText({ text: newSettings.enabled ? 'ON' : '', tabId });
      chrome.action.setBadgeBackgroundColor({ color: newSettings.enabled ? '#3b82f6' : '#64748b', tabId });
    }
  }, [domain, tabId, sendMessage]);

  // Toggle dark mode for this site
  const handleToggle = () => {
    const newSettings = { ...siteSettings, enabled: !siteSettings.enabled };
    updateAndPersist(newSettings);
  };

  // Toggle global
  const handleGlobalToggle = () => {
    const newGlobal = !globalEnabled;
    setGlobalEnabled(newGlobal);
    chrome.storage.sync.set({
      '__dark_mode_global__': {
        ...DEFAULT_GLOBAL_SETTINGS,
        enabled: newGlobal,
      },
    });
    if (!newGlobal && siteSettings.enabled) {
      const newSettings = { ...siteSettings, enabled: false };
      updateAndPersist(newSettings);
    }
  };

  // Theme selection
  const handleThemeSelect = (themeId: string) => {
    const newSettings = { ...siteSettings, themeId, enabled: true };
    updateAndPersist(newSettings);
  };

  // Slider changes
  const handleBrightness = (val: number) => {
    const newSettings = { ...siteSettings, brightness: val };
    updateAndPersist(newSettings);
  };

  const handleContrast = (val: number) => {
    const newSettings = { ...siteSettings, contrast: val };
    updateAndPersist(newSettings);
  };

  const handleSepia = (val: number) => {
    const newSettings = { ...siteSettings, sepia: val };
    updateAndPersist(newSettings);
  };

  const truncateDomain = (d: string) => {
    if (d.length > 28) return d.substring(0, 25) + '...';
    return d;
  };

  return (
    <div className="popup-container">
      {/* Ambient Background */}
      <div className="ambient-bg" />

      {/* Header */}
      <header className="popup-header">
        <div className="header-left">
          <div className="logo-icon">
            {/* cult-ui style: show Moon when dark mode is active, Sun when inactive */}
            {siteSettings.enabled ? (
              <MoonIcon size={20} color="#a5b4fc" />
            ) : (
              <SunIcon size={20} color="#fbbf24" />
            )}
          </div>
          <div className="header-text">
            <h1>Dark Mode</h1>
            <span className="header-domain">{truncateDomain(domain)}</span>
          </div>
        </div>
        <button
          className={`power-btn ${siteSettings.enabled ? 'active' : ''}`}
          onClick={handleToggle}
          title={siteSettings.enabled ? 'Disable dark mode' : 'Enable dark mode'}
          disabled={!globalEnabled}
        >
          <PowerIcon size={18} />
        </button>
      </header>

      {/* Global Toggle */}
      <div className="global-toggle-bar">
        <span className="global-label">
          <GlobeIcon size={14} />
          Extension Active
        </span>
        <label className="toggle-switch">
          <input type="checkbox" checked={globalEnabled} onChange={handleGlobalToggle} />
          <span className="toggle-slider" />
        </label>
      </div>

      {/* Themes Grid */}
      <div className="section">
        <div className="section-title">
          <GridIcon size={14} />
          Themes
        </div>
        <div className="themes-grid">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-card ${siteSettings.themeId === theme.id ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(theme.id)}
              title={theme.description}
              disabled={!globalEnabled}
            >
              <div
                className="theme-preview"
                style={{ background: theme.previewGradient }}
              >
                {siteSettings.themeId === theme.id && (
                  <div className="theme-check">
                    <CheckIcon size={14} color="white" />
                  </div>
                )}
              </div>
              <span className="theme-name">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div className="section">
        <div className="section-title">
          <SlidersIcon size={14} />
          Adjustments
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <label>
              <SunIcon size={12} className="slider-icon" /> Brightness
            </label>
            <span className="slider-value">{siteSettings.brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={siteSettings.brightness}
            onChange={(e) => handleBrightness(Number(e.target.value))}
            className="custom-slider"
            disabled={!globalEnabled || !siteSettings.enabled}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <label>Contrast</label>
            <span className="slider-value">{siteSettings.contrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={siteSettings.contrast}
            onChange={(e) => handleContrast(Number(e.target.value))}
            className="custom-slider"
            disabled={!globalEnabled || !siteSettings.enabled}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <label>Sepia</label>
            <span className="slider-value">{siteSettings.sepia}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={siteSettings.sepia}
            onChange={(e) => handleSepia(Number(e.target.value))}
            className="custom-slider"
            disabled={!globalEnabled || !siteSettings.enabled}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="popup-footer">
        <span className="shortcut-hint">
          <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> to toggle
        </span>
        <span className="version">v1.0.0</span>
      </footer>
    </div>
  );
};

export default App;
