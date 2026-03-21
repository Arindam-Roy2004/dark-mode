import { enable as enableDarkReader, disable as disableDarkReader, setFetchMethod } from 'darkreader';
import { Theme } from '../utils/types';
import { getThemeById } from './themes';

// Ensure darkreader can fetch cross-origin stylesheets if necessary
setFetchMethod(window.fetch);

const OVERLAY_ID = 'dark-mode-switcher-overlay';

interface EngineState {
  active: boolean;
  currentThemeId: string;
  brightness: number;
  contrast: number;
  sepia: number;
}

const state: EngineState = {
  active: false,
  currentThemeId: 'aurora-edge',
  brightness: 100,
  contrast: 100,
  sepia: 0,
};

let observer: MutationObserver | null = null;

function createOverlayElement(theme: Theme): HTMLDivElement {
  const container = document.createElement('div');
  container.id = OVERLAY_ID;
  container.setAttribute('data-dark-mode-switcher', 'true');
  container.className = 'darkreader-ignore';
  
  container.style.cssText = `
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147483647 !important;
    pointer-events: none !important;
    background: transparent !important;
  `;

  // Hide the exact gradient from DarkReader's CSS analyzer
  const shadow = container.attachShadow({ mode: 'closed' });
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: ${theme.overlay} !important;
    transition: background 0.4s ease !important;
    mix-blend-mode: screen !important;
    pointer-events: none !important;
  `;
  
  shadow.appendChild(overlay);
  return container;
}

function startObserver(): void {
  if (observer) return;

  observer = new MutationObserver(() => {
    if (!state.active) return;

    // Persist our custom gradient overlay
    if (getThemeById(state.currentThemeId).overlay !== 'none') {
      const overlayExists = document.getElementById(OVERLAY_ID);
      if (!overlayExists && document.body) {
        const theme = getThemeById(state.currentThemeId);
        const overlay = createOverlayElement(theme);
        document.body.appendChild(overlay);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function stopObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function removeOverlay(): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();
}

function applyTheme(themeId: string, brightness: number, contrast: number, sepia: number): void {
  const theme = getThemeById(themeId);

  // 1. Enable DarkReader Engine with our theme configuration
  enableDarkReader({
    brightness: brightness,
    contrast: contrast,
    sepia: sepia,
    darkSchemeBackgroundColor: theme.background,
    darkSchemeTextColor: theme.textColor || '#e2e8f0',
    selectionColor: 'rgba(59, 130, 246, 0.4)',
    scrollbarColor: 'auto',
  }, {
    disableStyleSheetsProxy: true,
    disableCustomElementRegistryProxy: true
  } as any);

  // 2. Inject our custom premium background overlay
  removeOverlay();
  
  if (theme.overlay !== 'none') {
    if (document.body) {
      const overlay = createOverlayElement(theme);
      document.body.appendChild(overlay);
    } else {
      // Wait for body if not ready (e.g. at document_start)
      const waitInterval = setInterval(() => {
        if (document.body) {
          clearInterval(waitInterval);
          if (!document.getElementById(OVERLAY_ID)) {
            const overlay = createOverlayElement(theme);
            document.body.appendChild(overlay);
          }
        }
      }, 10);
      setTimeout(() => clearInterval(waitInterval), 2000);
    }
  }

  startObserver();
}

export function enable(themeId: string, brightness = 100, contrast = 100, sepia = 0): void {
  state.active = true;
  state.currentThemeId = themeId;
  state.brightness = brightness;
  state.contrast = contrast;
  state.sepia = sepia;

  applyTheme(themeId, brightness, contrast, sepia);
}

export function disable(): void {
  state.active = false;
  
  // Disable DarkReader
  disableDarkReader();
  
  // Remove our custom features
  stopObserver();
  removeOverlay();
}

export function setTheme(themeId: string): void {
  if (state.active) {
    state.currentThemeId = themeId;
    applyTheme(themeId, state.brightness, state.contrast, state.sepia);
  }
}

export function updateSettings(brightness: number, contrast: number, sepia: number): void {
  state.brightness = brightness;
  state.contrast = contrast;
  state.sepia = sepia;
  
  if (state.active) {
    applyTheme(state.currentThemeId, brightness, contrast, sepia);
  }
}

export function isActive(): boolean {
  return state.active;
}

export function getCurrentThemeId(): string {
  return state.currentThemeId;
}
