import { SiteSettings, GlobalSettings, DEFAULT_SITE_SETTINGS, DEFAULT_GLOBAL_SETTINGS } from './types';

const GLOBAL_KEY = '__dark_mode_global__';

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

export async function getSiteSettings(domain: string): Promise<SiteSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([domain], (result) => {
      if (result[domain]) {
        resolve({ ...DEFAULT_SITE_SETTINGS, ...result[domain] });
      } else {
        resolve({ ...DEFAULT_SITE_SETTINGS });
      }
    });
  });
}

export async function setSiteSettings(domain: string, settings: SiteSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [domain]: settings }, resolve);
  });
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([GLOBAL_KEY], (result) => {
      if (result[GLOBAL_KEY]) {
        resolve({ ...DEFAULT_GLOBAL_SETTINGS, ...result[GLOBAL_KEY] });
      } else {
        resolve({ ...DEFAULT_GLOBAL_SETTINGS });
      }
    });
  });
}

export async function setGlobalSettings(settings: GlobalSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [GLOBAL_KEY]: settings }, resolve);
  });
}

export async function getAllSiteSettings(): Promise<Record<string, SiteSettings>> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (result) => {
      const sites: Record<string, SiteSettings> = {};
      for (const [key, value] of Object.entries(result)) {
        if (key !== GLOBAL_KEY) {
          sites[key] = value as SiteSettings;
        }
      }
      resolve(sites);
    });
  });
}
