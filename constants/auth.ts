export const AUTH_COOKIE_NAME = "kodelaci_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const PROTECTED_PREFIXES = ["/dashboard", "/snippets"] as const;
export const AUTH_PAGES = ["/login", "/register"] as const;
