// Mock auth/onboarding state stored in localStorage. Replace with Lovable Cloud in Phase 2.

export const KEYS = {
  onboarded: "nu_onboarded",
  authed: "nu_authed",
} as const;

export function isBrowser() {
  return typeof window !== "undefined";
}

export function getFlag(key: string): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(key) === "true";
}

export function setFlag(key: string, value: boolean) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value ? "true" : "false");
}
