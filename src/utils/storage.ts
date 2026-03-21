import { SiteSettings, GlobalSettings, DEFAULT_SITE_SETTINGS, DEFAULT_GLOBAL_SETTINGS } from './types';

const GLOBAL_KEY = '__dark_mode_global__';

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export async function getSiteSettings(domain: string): Promise<SiteSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get([domain], (result) => {
      resolve(result[domain] ? { ...DEFAULT_SITE_SETTINGS, ...result[domain] } : { ...DEFAULT_SITE_SETTINGS });
    });
  });
}

export async function setSiteSettings(domain: string, settings: SiteSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [domain]: settings }, resolve);
  });
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get([GLOBAL_KEY], (result) => {
      resolve(result[GLOBAL_KEY] ? { ...DEFAULT_GLOBAL_SETTINGS, ...result[GLOBAL_KEY] } : { ...DEFAULT_GLOBAL_SETTINGS });
    });
  });
}

export async function setGlobalSettings(settings: GlobalSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [GLOBAL_KEY]: settings }, resolve);
  });
}
