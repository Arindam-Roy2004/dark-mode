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

function createDarkStylesheet(theme: Theme): string {
  return `
    /* Dark Mode Switcher — ${theme.name} */
    html {
      background-color: ${theme.background} !important;
      color-scheme: dark !important;
    }

    /* Core inversion — invert all colors then fix media */
    html > body {
      background-color: ${theme.background} !important;
      color: #e2e8f0 !important;
    }

    /* Override light backgrounds */
    body, main, article, section, div, aside, nav, header, footer,
    .container, .wrapper, .content, .page, .card, .modal, .panel,
    [class*="container"], [class*="wrapper"], [class*="content"],
    [class*="main"], [class*="body"], [class*="page"] {
      background-color: transparent !important;
    }

    /* Specific high-priority background overrides */
    body > div, body > main, body > section, body > article {
      background-color: transparent !important;
    }

    /* Elements that commonly have white/light backgrounds */
    table, th, td, tr {
      background-color: rgba(15, 15, 20, 0.9) !important;
      color: #cbd5e1 !important;
      border-color: rgba(148, 163, 184, 0.15) !important;
    }

    th {
      background-color: rgba(30, 30, 40, 0.9) !important;
    }

    /* Text color overrides */
    h1, h2, h3, h4, h5, h6 {
      color: #f1f5f9 !important;
    }

    p, span, li, label, td, th, dd, dt, figcaption, blockquote, cite {
      color: #cbd5e1 !important;
    }

    a {
      color: #93c5fd !important;
    }

    a:visited {
      color: #c4b5fd !important;
    }

    a:hover {
      color: #bfdbfe !important;
    }

    /* Code blocks */
    pre, code, kbd, samp, var {
      background-color: rgba(15, 23, 42, 0.8) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.2) !important;
    }

    /* Inputs and form elements */
    input, textarea, select, button {
      background-color: rgba(15, 23, 42, 0.9) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.25) !important;
    }

    input::placeholder, textarea::placeholder {
      color: rgba(148, 163, 184, 0.5) !important;
    }

    input:focus, textarea:focus, select:focus {
      border-color: rgba(59, 130, 246, 0.5) !important;
      outline-color: rgba(59, 130, 246, 0.3) !important;
    }

    /* Buttons — keep some vibrancy */
    button, [role="button"], input[type="submit"], input[type="button"] {
      background-color: rgba(30, 41, 59, 0.9) !important;
      color: #e2e8f0 !important;
    }

    button:hover, [role="button"]:hover {
      background-color: rgba(51, 65, 85, 0.9) !important;
    }

    /* Cards, panels, popups */
    [class*="card"], [class*="Card"],
    [class*="panel"], [class*="Panel"],
    [class*="modal"], [class*="Modal"],
    [class*="popup"], [class*="Popup"],
    [class*="dropdown"], [class*="Dropdown"],
    [class*="menu"], [class*="Menu"],
    [class*="dialog"], [class*="Dialog"],
    [class*="tooltip"], [class*="Tooltip"] {
      background-color: rgba(15, 23, 42, 0.95) !important;
      color: #e2e8f0 !important;
      border-color: rgba(148, 163, 184, 0.15) !important;
    }

    /* Navigation */
    nav, [role="navigation"], [class*="nav"], [class*="Nav"],
    [class*="header"], [class*="Header"],
    [class*="sidebar"], [class*="Sidebar"],
    [class*="toolbar"], [class*="Toolbar"] {
      background-color: rgba(10, 15, 25, 0.95) !important;
      border-color: rgba(148, 163, 184, 0.1) !important;
    }

    /* Footer */
    footer, [class*="footer"], [class*="Footer"] {
      background-color: rgba(5, 10, 20, 0.95) !important;
      border-color: rgba(148, 163, 184, 0.1) !important;
    }

    /* Borders */
    hr {
      border-color: rgba(148, 163, 184, 0.15) !important;
    }

    /* Scrollbar styling */
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

    /* Preserve images, videos, canvas, SVG, iframes */
    img, video, canvas, svg, iframe, embed, object,
    [style*="background-image"],
    picture, figure img {
      /* Don't override these */
    }

    /* Ensure images remain visible */
    img, video, picture source {
      opacity: 1 !important;
    }

    /* Fix any white SVG backgrounds */
    svg {
      color: inherit !important;
    }

    /* Selection color */
    ::selection {
      background-color: rgba(59, 130, 246, 0.3) !important;
      color: #f1f5f9 !important;
    }

    /* Shadow adjustments */
    * {
      text-shadow: none !important;
    }

    /* Inline styles with white/light backgrounds — use a more targeted approach */
    [style*="background: white"],
    [style*="background: #fff"],
    [style*="background: #FFF"],
    [style*="background: #ffffff"],
    [style*="background: #FFFFFF"],
    [style*="background-color: white"],
    [style*="background-color: #fff"],
    [style*="background-color: #FFF"],
    [style*="background-color: #ffffff"],
    [style*="background-color: #FFFFFF"],
    [style*="background: rgb(255, 255, 255)"],
    [style*="background: rgb(255,255,255)"],
    [style*="background-color: rgb(255, 255, 255)"],
    [style*="background-color: rgb(255,255,255)"],
    [style*="background: #fafafa"],
    [style*="background-color: #fafafa"],
    [style*="background: #f5f5f5"],
    [style*="background-color: #f5f5f5"],
    [style*="background: #f0f0f0"],
    [style*="background-color: #f0f0f0"],
    [style*="background: #eee"],
    [style*="background-color: #eee"],
    [style*="background: #f8f9fa"],
    [style*="background-color: #f8f9fa"],
    [style*="background: #f9fafb"],
    [style*="background-color: #f9fafb"] {
      background-color: rgba(15, 23, 42, 0.95) !important;
    }

    [style*="color: black"],
    [style*="color: #000"],
    [style*="color: #333"],
    [style*="color: #222"],
    [style*="color: #111"],
    [style*="color: rgb(0, 0, 0)"],
    [style*="color: rgb(0,0,0)"],
    [style*="color: rgb(51, 51, 51)"],
    [style*="color: rgb(33, 33, 33)"] {
      color: #e2e8f0 !important;
    }
  `;
}

function createOverlayElement(theme: Theme): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
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

function injectStyles(theme: Theme, brightness: number, contrast: number, sepia: number): void {
  removeStyles();

  // Inject main dark mode CSS
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.setAttribute('data-dark-mode-switcher', 'true');
  styleEl.textContent = createDarkStylesheet(theme);
  document.documentElement.appendChild(styleEl);

  // Inject overlay for gradient effects
  if (theme.overlay !== 'none') {
    const overlay = createOverlayElement(theme);
    document.documentElement.appendChild(overlay);
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
      /* Re-correct media that shouldn't be filtered */
      img, video, canvas, iframe {
        filter: ${filterParts.map(f => {
          if (f.includes('brightness')) return `brightness(${Math.round(10000 / brightness)}%)`;
          if (f.includes('contrast')) return `contrast(${Math.round(10000 / contrast)}%)`;
          return '';
        }).filter(Boolean).join(' ')} !important;
      }
    `;
    document.documentElement.appendChild(filterStyle);
  }
}

function removeStyles(): void {
  // Remove all injected styles
  const existingStyles = document.querySelectorAll('[data-dark-mode-switcher]');
  existingStyles.forEach((el) => el.remove());

  // Remove overlay
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();

  // Remove filter style
  const filterStyle = document.getElementById(`${STYLE_ID}-filters`);
  if (filterStyle) filterStyle.remove();

  // Remove main style
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
