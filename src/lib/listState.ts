"use client";

export interface ListPageState {
  pageCount: number;
  scrollY: number;
  timestamp?: number;
}

const getStorageKey = (path: string) => `pga.list-state:${path}`;

export function saveListState(path: string, state: ListPageState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      getStorageKey(path),
      JSON.stringify({ ...state, timestamp: Date.now() })
    );
  } catch {
    // ignore
  }
}

export function readListState(path: string): ListPageState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(getStorageKey(path));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ListPageState;
    return parsed;
  } catch {
    return null;
  }
}

export function clearListState(path: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(getStorageKey(path));
  } catch {
    // ignore
  }
}
