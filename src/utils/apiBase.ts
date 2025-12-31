const DEFAULT_PORT = '8000';

function getWindow(): Window | undefined {
  if (typeof window !== 'undefined') {
    return window;
  }
  return undefined;
}

function buildFallback(): string {
  const win = getWindow();
  if (win) {
    return `${win.location.protocol}//${win.location.hostname}:${DEFAULT_PORT}`;
  }
  return `http://127.0.0.1:${DEFAULT_PORT}`;
}

function normalize(raw?: string): string {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return buildFallback();
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const win = getWindow();
  const protocol = win?.location.protocol ?? 'http:';
  const host = win?.location.hostname ?? '127.0.0.1';

  if (trimmed.startsWith('//')) {
    return `${protocol}${trimmed}`;
  }
  if (trimmed.startsWith(':')) {
    return `${protocol}//${host}${trimmed}`;
  }
  if (trimmed.startsWith('/')) {
    return `${protocol}//${host}${trimmed}`;
  }
  return `${protocol}//${trimmed}`;
}

export const API_BASE = normalize(import.meta.env.VITE_API_BASE);
