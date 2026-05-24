const ACCESS_TOKEN_STORAGE_KEY = "access_token";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function clearAccessToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
