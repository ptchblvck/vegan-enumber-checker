import { CookieConsentProps } from "@/types/cookies";

export const CONSENT_EXPIRY_DAYS = 365;
export const CONSENT_STORAGE_KEY = "cookie-consent";

export const defaultConsent: CookieConsentProps = {
  essential: true, // Always required
  analytics: false,
  marketing: false,
  timestamp: 0, // Set to 0 to indicate no consent has been given yet
};
