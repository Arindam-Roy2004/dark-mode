import { Theme } from '../utils/types';
import { getThemeById } from './themes';

const STYLE_ID = 'dark-mode-switcher-style';
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

function createDarkStylesheet(theme: Theme): string {
  // Use high-specificity selectors to ensure our rules win
  return `
    /* Dark Mode Switcher — ${theme.name} */

    /* === ROOT LEVEL === */
    html, html[class], html[data-theme] {
      background-color: ${theme.background} !important;
      color-scheme: dark !important;
    }

    html body, body {
      background-color: ${theme.background} !important;
      background-image: none !important;
      color: #e2e8f0 !important;
    }

    /* === STRUCTURAL ELEMENTS — dark background instead of transparent === */
    html body main,
    html body article,
    html body section,
    html body aside,
    html body div,
    html body header,
    html body footer,
    html body nav {
      background-color: inherit !important;
      background-image: none !important;
    }

    /* === COMMON CLASS PATTERNS (high specificity) === */
    html body [class*="container"],
    html body [class*="Container"],
    html body [class*="wrapper"],
    html body [class*="Wrapper"],
    html body [class*="content"],
    html body [class*="Content"],
    html body [class*="main"],
    html body [class*="Main"],
    html body [class*="page"],
    html body [class*="Page"],
    html body [class*="layout"],
    html body [class*="Layout"],
    html body [class*="app"],
    html body [class*="App"],
    html body [class*="root"],
    html body [class*="Root"],
    html body [class*="view"],
    html body [class*="View"],
    html body [class*="body"],
    html body [class*="Body"],
    html body [class*="section"],
    html body [class*="Section"],
    html body [class*="block"],
    html body [class*="Block"],
    html body [class*="inner"],
    html body [class*="Inner"],
    html body [class*="outer"],
    html body [class*="Outer"],
    html body [id*="app"],
    html body [id*="root"],
    html body [id*="main"],
    html body [id*="content"],
    html body [id*="__next"],
    html body [id*="__nuxt"],
    html body #app,
    html body #root,
    html body #__next,
    html body #__nuxt,
    html body #__layout {
      background-color: inherit !important;
      background-image: none !important;
    }

    /* === TABLE ELEMENTS === */
    html body table,
    html body th,
    html body td,
    html body tr,
    html body thead,
    html body tbody,
    html body tfoot {
      background-color: rgba(15, 15, 20, 0.9) !important;
      color: #cbd5e1 !important;
      border-color: rgba(148, 163, 184, 0.15) !important;
    }

    html body th {
      background-color: rgba(30, 30, 40, 0.9) !important;
    }

    /* === TEXT COLORS === */
    html body h1,
    html body h2,
    html body h3,
    html body h4,
    html body h5,
    html body h6,
    html body [class*="title"],
    html body [class*="Title"],
    html body [class*="heading"],
    html body [class*="Heading"] {
      color: #f1f5f9 !important;
    }

    html body p,
    html body span,
    html body li,
    html body label,
    html body dd,
    html body dt,
    html body figcaption,
    html body blockquote,
    html body cite,
    html body small,
    html body strong,
    html body em,
    html body b,
    html body i,
    html body u,
    html body time,
    html body abbr,
    html body address,
    html body details,
    html body summary,
    html body legend {
      color: #cbd5e1 !important;
    }

    html body a,
    html body a span {
      color: #93c5fd !important;
    }

    html body a:visited {
      color: #c4b5fd !important;
    }

    html body a:hover {
      color: #bfdbfe !important;
    }

    /* === CODE BLOCKS === */
    html body pre,
    html body code,
    html body kbd,
    html body samp,
    html body var {
      background-color: rgba(15, 23, 42, 0.8) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.2) !important;
    }

    /* === FORM ELEMENTS === */
    html body input,
    html body textarea,
    html body select,
    html body option,
    html body optgroup {
      background-color: rgba(15, 23, 42, 0.9) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.25) !important;
    }

    html body input::placeholder,
    html body textarea::placeholder {
      color: rgba(148, 163, 184, 0.5) !important;
    }

    html body input:focus,
    html body textarea:focus,
    html body select:focus {
      border-color: rgba(59, 130, 246, 0.5) !important;
      outline-color: rgba(59, 130, 246, 0.3) !important;
    }

    /* === BUTTONS === */
    html body button,
    html body [role="button"],
    html body input[type="submit"],
    html body input[type="button"],
    html body input[type="reset"],
    html body [class*="btn"],
    html body [class*="Btn"],
    html body [class*="button"],
    html body [class*="Button"] {
      background-color: rgba(30, 41, 59, 0.9) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.2) !important;
    }

    html body button:hover,
    html body [role="button"]:hover {
      background-color: rgba(51, 65, 85, 0.9) !important;
    }

    /* === CARDS, PANELS, MODALS === */
    html body [class*="card"],
    html body [class*="Card"],
    html body [class*="panel"],
    html body [class*="Panel"],
    html body [class*="modal"],
    html body [class*="Modal"],
    html body [class*="popup"],
    html body [class*="Popup"],
    html body [class*="dropdown"],
    html body [class*="Dropdown"],
    html body [class*="menu"],
    html body [class*="Menu"],
    html body [class*="dialog"],
    html body [class*="Dialog"],
    html body [class*="tooltip"],
    html body [class*="Tooltip"],
    html body [class*="popover"],
    html body [class*="Popover"],
    html body [class*="overlay"],
    html body [class*="Overlay"],
    html body [class*="widget"],
    html body [class*="Widget"],
    html body [class*="box"],
    html body [class*="Box"],
    html body [class*="item"],
    html body [class*="Item"],
    html body [class*="list"],
    html body [class*="List"],
    html body [class*="row"],
    html body [class*="Row"],
    html body [class*="col"],
    html body [class*="Col"],
    html body [class*="grid"],
    html body [class*="Grid"],
    html body [class*="tile"],
    html body [class*="Tile"] {
      background-color: rgba(15, 23, 42, 0.95) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.12) !important;
    }

    /* === NAVIGATION === */
    html body nav,
    html body [role="navigation"],
    html body [class*="nav"],
    html body [class*="Nav"],
    html body [class*="header"],
    html body [class*="Header"],
    html body [class*="sidebar"],
    html body [class*="Sidebar"],
    html body [class*="toolbar"],
    html body [class*="Toolbar"],
    html body [class*="topbar"],
    html body [class*="Topbar"],
    html body [class*="appbar"],
    html body [class*="AppBar"],
    html body [class*="navbar"],
    html body [class*="Navbar"],
    html body [class*="menubar"],
    html body [class*="Menubar"] {
      background-color: rgba(10, 15, 25, 0.95) !important;
      border-color: rgba(148, 163, 184, 0.1) !important;
    }

    /* === FOOTER === */
    html body footer,
    html body [class*="footer"],
    html body [class*="Footer"] {
      background-color: rgba(5, 10, 20, 0.95) !important;
      border-color: rgba(148, 163, 184, 0.1) !important;
    }

    /* === BORDERS === */
    html body hr {
      border-color: rgba(148, 163, 184, 0.15) !important;
    }

    /* === SCROLLBAR === */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.5);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(100, 116, 139, 0.5);
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(100, 116, 139, 0.7);
    }

    /* === PRESERVE MEDIA === */
    html body img,
    html body video,
    html body picture,
    html body picture source {
      opacity: 1 !important;
    }

    html body svg {
      color: inherit !important;
    }

    /* === SELECTION === */
    ::selection {
      background-color: rgba(59, 130, 246, 0.3) !important;
      color: #f1f5f9 !important;
    }

    /* === SHADOW CLEANUP === */
    html body * {
      text-shadow: none !important;
    }

    /* === INLINE STYLE OVERRIDES (white/light backgrounds) === */
    html body [style*="background: white"],
    html body [style*="background: #fff"],
    html body [style*="background: #FFF"],
    html body [style*="background: #ffffff"],
    html body [style*="background: #FFFFFF"],
    html body [style*="background-color: white"],
    html body [style*="background-color: #fff"],
    html body [style*="background-color: #FFF"],
    html body [style*="background-color: #ffffff"],
    html body [style*="background-color: #FFFFFF"],
    html body [style*="background: rgb(255, 255, 255)"],
    html body [style*="background: rgb(255,255,255)"],
    html body [style*="background-color: rgb(255, 255, 255)"],
    html body [style*="background-color: rgb(255,255,255)"],
    html body [style*="background:#fff"],
    html body [style*="background:#FFF"],
    html body [style*="background:#ffffff"],
    html body [style*="background:#FFFFFF"],
    html body [style*="background-color:#fff"],
    html body [style*="background-color:#FFF"],
    html body [style*="background-color:#ffffff"],
    html body [style*="background-color:#FFFFFF"],
    html body [style*="background: #fafafa"],
    html body [style*="background-color: #fafafa"],
    html body [style*="background: #f5f5f5"],
    html body [style*="background-color: #f5f5f5"],
    html body [style*="background: #f0f0f0"],
    html body [style*="background-color: #f0f0f0"],
    html body [style*="background: #eee"],
    html body [style*="background-color: #eee"],
    html body [style*="background: #f8f9fa"],
    html body [style*="background-color: #f8f9fa"],
    html body [style*="background: #f9fafb"],
    html body [style*="background-color: #f9fafb"],
    html body [style*="background: #e5e7eb"],
    html body [style*="background-color: #e5e7eb"] {
      background-color: rgba(15, 23, 42, 0.95) !important;
    }

    html body [style*="color: black"],
    html body [style*="color: #000"],
    html body [style*="color: #333"],
    html body [style*="color: #222"],
    html body [style*="color: #111"],
    html body [style*="color:black"],
    html body [style*="color:#000"],
    html body [style*="color:#333"],
    html body [style*="color:#222"],
    html body [style*="color:#111"],
    html body [style*="color: rgb(0, 0, 0)"],
    html body [style*="color: rgb(0,0,0)"],
    html body [style*="color: rgb(51, 51, 51)"],
    html body [style*="color: rgb(33, 33, 33)"] {
      color: #e2e8f0 !important;
    }

    /* === WILDCARD CATCH-ALL for remaining light backgrounds === */
    html body *:not(img):not(video):not(canvas):not(svg):not(iframe):not(embed):not(object):not(picture):not([data-dark-mode-switcher]) {
      border-color: rgba(148, 163, 184, 0.12) !important;
    }
  `;
}

function getHead(): HTMLHeadElement {
  if (document.head) return document.head;
  // Fallback: create head if it doesn't exist yet (document_start)
  const head = document.createElement('head');
  document.documentElement.prepend(head);
  return head;
}

function waitForHead(): Promise<HTMLHeadElement> {
  return new Promise((resolve) => {
    if (document.head) {
      resolve(document.head);
      return;
    }
    // Poll for head element
    const interval = setInterval(() => {
      if (document.head) {
        clearInterval(interval);
        resolve(document.head);
      }
    }, 10);
    // Timeout fallback
    setTimeout(() => {
      clearInterval(interval);
      resolve(getHead());
    }, 2000);
  });
}

function createOverlayElement(theme: Theme): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('data-dark-mode-switcher', 'true');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    pointer-events: none;
    background: ${theme.overlay};
    transition: opacity 0.4s ease;
  `;
  return overlay;
}

function startObserver(): void {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    if (!state.active) return;

    // Check if our style element was removed
    const styleExists = document.getElementById(STYLE_ID);
    if (!styleExists) {
      // Re-inject styles
      const theme = getThemeById(state.currentThemeId);
      injectStylesSync(theme, state.brightness, state.contrast, state.sepia);
    }

    // Check if overlay was removed
    if (getThemeById(state.currentThemeId).overlay !== 'none') {
      const overlayExists = document.getElementById(OVERLAY_ID);
      if (!overlayExists) {
        const theme = getThemeById(state.currentThemeId);
        const overlay = createOverlayElement(theme);
        document.body?.appendChild(overlay);
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

function injectStylesSync(theme: Theme, brightness: number, contrast: number, sepia: number): void {
  removeStyles();

  // Inject main dark mode CSS into <head>
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.setAttribute('data-dark-mode-switcher', 'true');
  styleEl.textContent = createDarkStylesheet(theme);

  // Use head if available, otherwise documentElement
  const target = document.head || document.documentElement;
  target.appendChild(styleEl);

  // Inject overlay for gradient effects into body
  if (theme.overlay !== 'none' && document.body) {
    const overlay = createOverlayElement(theme);
    document.body.appendChild(overlay);
  }

  // Apply filter adjustments
  const filterParts: string[] = [];
  if (brightness !== 100) filterParts.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filterParts.push(`contrast(${contrast}%)`);
  if (sepia > 0) filterParts.push(`sepia(${sepia}%)`);

  if (filterParts.length > 0) {
    const filterStyle = document.createElement('style');
    filterStyle.id = `${STYLE_ID}-filters`;
    filterStyle.setAttribute('data-dark-mode-switcher', 'true');
    filterStyle.textContent = `
      html {
        filter: ${filterParts.join(' ')} !important;
      }
      img, video, canvas, iframe {
        filter: ${filterParts.map(f => {
          if (f.includes('brightness')) return `brightness(${Math.round(10000 / brightness)}%)`;
          if (f.includes('contrast')) return `contrast(${Math.round(10000 / contrast)}%)`;
          return '';
        }).filter(Boolean).join(' ')} !important;
      }
    `;
    target.appendChild(filterStyle);
  }
}

async function injectStyles(theme: Theme, brightness: number, contrast: number, sepia: number): Promise<void> {
  await waitForHead();
  injectStylesSync(theme, brightness, contrast, sepia);

  // Also re-inject once body is ready (for overlay and to ensure CSS wins)
  if (!document.body) {
    const bodyWait = setInterval(() => {
      if (document.body) {
        clearInterval(bodyWait);
        // Re-inject overlay now that body exists
        if (theme.overlay !== 'none' && !document.getElementById(OVERLAY_ID)) {
          const overlay = createOverlayElement(theme);
          document.body.appendChild(overlay);
        }
        startObserver();
      }
    }, 50);
    setTimeout(() => clearInterval(bodyWait), 10000);
  } else {
    startObserver();
  }
}

function removeStyles(): void {
  // Remove all injected elements
  const existingElements = document.querySelectorAll('[data-dark-mode-switcher]');
  existingElements.forEach((el) => el.remove());

  // Also remove by ID as fallback
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();

  const filterStyle = document.getElementById(`${STYLE_ID}-filters`);
  if (filterStyle) filterStyle.remove();

  const mainStyle = document.getElementById(STYLE_ID);
  if (mainStyle) mainStyle.remove();
}

export function enable(themeId: string, brightness = 100, contrast = 100, sepia = 0): void {
  const theme = getThemeById(themeId);
  state.active = true;
  state.currentThemeId = themeId;
  state.brightness = brightness;
  state.contrast = contrast;
  state.sepia = sepia;

  injectStyles(theme, brightness, contrast, sepia);
}

export function disable(): void {
  state.active = false;
  stopObserver();
  removeStyles();
}

export function setTheme(themeId: string): void {
  if (state.active) {
    state.currentThemeId = themeId;
    const theme = getThemeById(themeId);
    injectStyles(theme, state.brightness, state.contrast, state.sepia);
  }
}

export function updateSettings(brightness: number, contrast: number, sepia: number): void {
  state.brightness = brightness;
  state.contrast = contrast;
  state.sepia = sepia;
  if (state.active) {
    const theme = getThemeById(state.currentThemeId);
    injectStyles(theme, brightness, contrast, sepia);
  }
}

export function isActive(): boolean {
  return state.active;
}

export function getCurrentThemeId(): string {
  return state.currentThemeId;
}
