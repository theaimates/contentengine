/**
 * config.js — localStorage-based configuration manager
 */
const STORAGE_KEY = 'ce_config';

const defaults = {
  webhookUrl: '',
  lastUsed: null,
};

function load() {
  if (typeof window === 'undefined') return { ...defaults };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return { ...defaults, ...JSON.parse(stored || '{}') };
  } catch {
    return { ...defaults };
  }
}

function save(patch) {
  if (typeof window === 'undefined') return;
  const current = load();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
}

export function isConfigured() {
  const url = getWebhookUrl();
  return !!(url && url.startsWith('http'));
}

export function getWebhookUrl() {
  return load().webhookUrl || '';
}

export function setWebhookUrl(url) {
  save({ webhookUrl: url.trim(), lastUsed: new Date().toISOString() });
}

export function clearConfig() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
