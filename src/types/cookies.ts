export type CookieCategory = "essential" | "analytics" | "marketing";

export interface CookieConsentProps {
  essential: boolean; // Essential cookies are always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number; // Unix timestamp when consent was given
}
