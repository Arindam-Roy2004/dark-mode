import { SiteSettings, GlobalSettings, DEFAULT_SITE_SETTINGS, DEFAULT_GLOBAL_SETTINGS, EXCLUDES_KEY } from './types';

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

// ---- Exclude List Helpers ----

export async function getExcludeList(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([EXCLUDES_KEY], (result) => {
      resolve(result[EXCLUDES_KEY] || []);
    });
  });
}

export async function addExcludePattern(pattern: string): Promise<string[]> {
  const list = await getExcludeList();
  const normalized = pattern.trim().toLowerCase();
  if (!normalized || list.includes(normalized)) return list;
  const updated = [...list, normalized];
  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ [EXCLUDES_KEY]: updated }, resolve);
  });
  return updated;
}

export async function removeExcludePattern(pattern: string): Promise<string[]> {
  const list = await getExcludeList();
  const updated = list.filter((p) => p !== pattern);
  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ [EXCLUDES_KEY]: updated }, resolve);
  });
  return updated;
}

/**
 * Check if a domain matches any exclude pattern.
 * Supports glob wildcards: *.example.com matches sub.example.com
 */
export function isDomainExcluded(domain: string, patterns: string[]): boolean {
  const d = domain.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern === d) return true;
    // Convert glob pattern to regex: *.example.com -> .*\.example\.com
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // escape regex chars except *
      .replace(/\\\*/g, '\\*');  // undo double-escape of *
    const regex = new RegExp(
      '^' + escaped.replace(/\*/g, '.*') + '$'
    );
    return regex.test(d);
  });
}
