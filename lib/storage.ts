import { StateStorage } from "zustand/middleware";

const dummyStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const safeLocalStorage: StateStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {}
  },
};

export const getSafeStorage = (): StateStorage => {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    return safeLocalStorage;
  }
  return dummyStorage;
};
