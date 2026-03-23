import React, { useState, useEffect, useCallback, useRef } from 'react';
import { themes } from '../content/themes';
import { SiteSettings, GlobalSettings, DEFAULT_SITE_SETTINGS, DEFAULT_GLOBAL_SETTINGS, MessagePayload, EXCLUDES_KEY } from '../utils/types';
import { SunIcon, MoonIcon, PowerIcon, GlobeIcon, GridIcon, SlidersIcon, CheckIcon, ShieldIcon, XIcon, PlusIcon, ClockIcon } from './icons';

// ---- Debounce hook ----
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback((...args: any[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]) as unknown as T;
}

const App: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...DEFAULT_SITE_SETTINGS });
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [tabId, setTabId] = useState<number | null>(null);

  // Exclude list state
  const [excludeList, setExcludeList] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState('');
  const [isExcluded, setIsExcluded] = useState(false);

  // Emergency disable state
  const [tempDisabled, setTempDisabled] = useState(false);
  const [tempRemainingMs, setTempRemainingMs] = useState(0);

  // Load settings on mount
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.url || !tab.id) return;
      setTabId(tab.id);

      try {
        const host = new URL(tab.url).hostname;
        setDomain(host);

        chrome.storage.local.get([host, '__dark_mode_global__', EXCLUDES_KEY], (result) => {
          const global: GlobalSettings = result['__dark_mode_global__'] || { ...DEFAULT_GLOBAL_SETTINGS };
          const site: SiteSettings = result[host] || { ...DEFAULT_SITE_SETTINGS };
          const excludes: string[] = result[EXCLUDES_KEY] || [];
          setGlobalEnabled(global.enabled);
          setSiteSettings(site);
          setExcludeList(excludes);

          // Check if current domain is excluded
          const d = host.toLowerCase();
          const excluded = excludes.some((pattern) => {
            if (pattern === d) return true;
            const escaped = pattern
              .replace(/[.+^${}()|[\]\\]/g, '\\$&')
              .replace(/\\\*/g, '\\*');
            const regex = new RegExp('^' + escaped.replace(/\*/g, '.*') + '$');
            return regex.test(d);
          });
          setIsExcluded(excluded);
        });

        // Check temp-disable status
        chrome.runtime.sendMessage({ type: 'TEMP_DISABLE_STATUS' } as MessagePayload, (response) => {
          if (response?.tempDisabled) {
            setTempDisabled(true);
            setTempRemainingMs(response.remainingMs || 0);
          }
        });
      } catch {
        setDomain('');  // Empty string = unsupported page
      }
    });
  }, []);

  // Countdown timer for temp-disable
  useEffect(() => {
    if (!tempDisabled || tempRemainingMs <= 0) return;

    const interval = setInterval(() => {
      setTempRemainingMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          setTempDisabled(false);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tempDisabled, tempRemainingMs]);

  // Send message to content script
  const sendMessage = useCallback((msg: MessagePayload) => {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, msg).catch((err) => {
        console.warn('Could not send message to tab. It might not be loaded yet.', err);
      });
    }
  }, [tabId]);

  // Persist + send (used for non-slider changes)
  const persistAndSend = useCallback((newSettings: SiteSettings) => {
    if (domain) {
      chrome.storage.local.set({ [domain]: newSettings });
    }
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

  // Debounced version for slider changes
  const debouncedPersistAndSend = useDebounce(persistAndSend, 150);

  // Full update (non-debounced) — for toggles, theme changes
  const updateAndPersist = useCallback((newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    persistAndSend(newSettings);
  }, [persistAndSend]);

  // Toggle dark mode for this site
  const handleToggle = () => {
    const newSettings = { ...siteSettings, enabled: !siteSettings.enabled };
    updateAndPersist(newSettings);
  };

  // Toggle global
  const handleGlobalToggle = () => {
    const newGlobal = !globalEnabled;
    setGlobalEnabled(newGlobal);
    chrome.storage.local.set({
      '__dark_mode_global__': {
        ...DEFAULT_GLOBAL_SETTINGS,
        enabled: newGlobal,
      },
    });
    // When turning OFF globally: send a disable message to the content script
    // but do NOT overwrite the per-site stored enabled state.
    if (!newGlobal) {
      sendMessage({ type: 'TOGGLE_DARK_MODE', enabled: false, settings: { ...siteSettings, enabled: false } });
      if (tabId) {
        chrome.action.setBadgeText({ text: '', tabId });
      }
    } else if (siteSettings.enabled) {
      // Re-enable: restore previous per-site state
      sendMessage({ type: 'UPDATE_SETTINGS', settings: siteSettings });
      if (tabId) {
        chrome.action.setBadgeText({ text: 'ON', tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#3b82f6', tabId });
      }
    }
  };

  // Theme selection
  const handleThemeSelect = (themeId: string) => {
    const newSettings = { ...siteSettings, themeId, enabled: true };
    updateAndPersist(newSettings);
  };

  // Slider changes — immediate visual update, debounced persist
  const handleSliderChange = (key: 'brightness' | 'contrast' | 'sepia', val: number) => {
    const newSettings = { ...siteSettings, [key]: val };
    setSiteSettings(newSettings);
    debouncedPersistAndSend(newSettings);
  };

  // ---- Exclude List Handlers ----
  const handleAddExclude = () => {
    const pattern = excludeInput.trim().toLowerCase();
    if (!pattern) return;
    const newList = [...excludeList];
    if (!newList.includes(pattern)) {
      newList.push(pattern);
      setExcludeList(newList);
      chrome.storage.local.set({ [EXCLUDES_KEY]: newList });

      // Check if current domain now matches
      if (domain) {
        const d = domain.toLowerCase();
        if (pattern === d || matchesGlob(d, pattern)) {
          setIsExcluded(true);
          // Disable dark mode on this tab immediately
          sendMessage({ type: 'TOGGLE_DARK_MODE', enabled: false, settings: { ...siteSettings, enabled: false } });
        }
      }
    }
    setExcludeInput('');
  };

  const handleRemoveExclude = (pattern: string) => {
    const newList = excludeList.filter((p) => p !== pattern);
    setExcludeList(newList);
    chrome.storage.local.set({ [EXCLUDES_KEY]: newList });

    // Re-check if domain is still excluded
    if (domain) {
      const d = domain.toLowerCase();
      const stillExcluded = newList.some((p) => p === d || matchesGlob(d, p));
      setIsExcluded(stillExcluded);
    }
  };

  const handleQuickExclude = () => {
    if (!domain) return;
    const d = domain.toLowerCase();
    if (!excludeList.includes(d)) {
      const newList = [...excludeList, d];
      setExcludeList(newList);
      chrome.storage.local.set({ [EXCLUDES_KEY]: newList });
      setIsExcluded(true);
      sendMessage({ type: 'TOGGLE_DARK_MODE', enabled: false, settings: { ...siteSettings, enabled: false } });
    }
  };

  // ---- Emergency Disable Handler ----
  const handleTempDisable = () => {
    chrome.runtime.sendMessage({ type: 'TEMP_DISABLE', domain } as MessagePayload, (response) => {
      if (response?.success) {
        setTempDisabled(true);
        setTempRemainingMs(5 * 60 * 1000);
      }
    });
  };

  const truncateDomain = (d: string) => {
    if (d.length > 28) return d.substring(0, 25) + '...';
    return d;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="popup-container">
      {/* Ambient Background */}
      <div className="ambient-bg" />

      {/* Unsupported page notice */}
      {!domain && (
        <div className="unsupported-notice">
          <span>⚠️ Dark mode is not available on this page.</span>
        </div>
      )}

      {/* Excluded domain notice */}
      {domain && isExcluded && (
        <div className="excluded-notice">
          <ShieldIcon size={14} />
          <span>This site is in your exclude list.</span>
          <button
            className="excluded-remove-btn"
            onClick={() => handleRemoveExclude(domain.toLowerCase())}
            title="Remove from exclude list"
          >
            Remove
          </button>
        </div>
      )}

      {/* Temp-disable notice */}
      {tempDisabled && (
        <div className="temp-disable-notice">
          <ClockIcon size={14} />
          <span>Temporarily disabled — re-enables in {formatTime(tempRemainingMs)}</span>
        </div>
      )}

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
        <div className="header-actions">
          {/* Emergency disable button */}
          {domain && siteSettings.enabled && globalEnabled && !tempDisabled && !isExcluded && (
            <button
              className="temp-disable-btn"
              onClick={handleTempDisable}
              title="Disable on this page for 5 minutes"
            >
              <ClockIcon size={14} />
              <span>5m</span>
            </button>
          )}
          {/* Quick exclude button */}
          {domain && !isExcluded && (
            <button
              className="quick-exclude-btn"
              onClick={handleQuickExclude}
              title="Exclude this site from dark mode"
            >
              <ShieldIcon size={14} />
            </button>
          )}
          <button
            className={`power-btn ${siteSettings.enabled ? 'active' : ''}`}
            onClick={handleToggle}
            title={siteSettings.enabled ? 'Disable dark mode' : 'Enable dark mode'}
            disabled={!globalEnabled || isExcluded || tempDisabled}
          >
            <PowerIcon size={18} />
          </button>
        </div>
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
              disabled={!globalEnabled || isExcluded || tempDisabled}
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
            onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
            className="custom-slider"
            disabled={!globalEnabled || !siteSettings.enabled || isExcluded || tempDisabled}
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
            onChange={(e) => handleSliderChange('contrast', Number(e.target.value))}
            className="custom-slider"
            disabled={!globalEnabled || !siteSettings.enabled || isExcluded || tempDisabled}
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
            onChange={(e) => handleSliderChange('sepia', Number(e.target.value))}
            className="custom-slider"
            disabled={!globalEnabled || !siteSettings.enabled || isExcluded || tempDisabled}
          />
        </div>
      </div>

      {/* Exclude List */}
      <div className="section">
        <div className="section-title">
          <ShieldIcon size={14} />
          Excluded Sites
        </div>
        <div className="exclude-input-row">
          <input
            type="text"
            className="exclude-input"
            placeholder="e.g. *.docs.google.com"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddExclude()}
          />
          <button className="exclude-add-btn" onClick={handleAddExclude} title="Add pattern">
            <PlusIcon size={14} />
          </button>
        </div>
        {excludeList.length > 0 && (
          <div className="exclude-chips">
            {excludeList.map((pattern) => (
              <div key={pattern} className="exclude-chip">
                <span>{pattern}</span>
                <button
                  className="exclude-chip-remove"
                  onClick={() => handleRemoveExclude(pattern)}
                  title="Remove"
                >
                  <XIcon size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        {excludeList.length === 0 && (
          <div className="exclude-empty">No excluded sites yet</div>
        )}
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

// Helper: check if domain matches a glob pattern
function matchesGlob(domain: string, pattern: string): boolean {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\\\*/g, '\\*');
  const regex = new RegExp('^' + escaped.replace(/\*/g, '.*') + '$');
  return regex.test(domain);
}

export default App;
