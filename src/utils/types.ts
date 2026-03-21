export interface ThemeColors {
  background: string;
  overlay: string;
  textPrimary: string;
  textSecondary: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  background: string;
  overlay: string;
  previewGradient: string;
}

export interface SiteSettings {
  enabled: boolean;
  themeId: string;
  brightness: number;
  contrast: number;
  sepia: number;
}

export interface GlobalSettings {
  enabled: boolean;
  defaultThemeId: string;
  defaultBrightness: number;
  defaultContrast: number;
  defaultSepia: number;
}

export interface MessagePayload {
  type: 'TOGGLE_DARK_MODE' | 'SET_THEME' | 'UPDATE_SETTINGS' | 'GET_STATUS' | 'STATUS_RESPONSE';
  enabled?: boolean;
  themeId?: string;
  settings?: SiteSettings;
  domain?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  enabled: false,
  themeId: 'aurora-edge',
  brightness: 100,
  contrast: 100,
  sepia: 0,
};

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  enabled: true,
  defaultThemeId: 'aurora-edge',
  defaultBrightness: 100,
  defaultContrast: 100,
  defaultSepia: 0,
};
