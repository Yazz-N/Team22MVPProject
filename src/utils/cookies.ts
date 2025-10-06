export interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_PREFS_KEY = 'cookiePrefs';

export const getCookiePrefs = (): CookiePreferences => {
  try {
    const stored = localStorage.getItem(COOKIE_PREFS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse cookie preferences:', error);
  }
  
  // Default preferences
  return {
    analytics: false,
    marketing: false
  };
};

export const setCookiePrefs = (prefs: CookiePreferences): void => {
  try {
    localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save cookie preferences:', error);
  }
};

export const cookiesAreAllowed = (type: 'analytics' | 'marketing'): boolean => {
  const prefs = getCookiePrefs();
  return prefs[type];
};

// Usage examples for future script loading:
// Load only if cookiesAreAllowed('analytics')
// Load only if cookiesAreAllowed('marketing')