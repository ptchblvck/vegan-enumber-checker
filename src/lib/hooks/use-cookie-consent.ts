import { CookieConsentProps } from "@/types/cookies";
import { CONSENT_STORAGE_KEY, defaultConsent } from "@/lib/constants";
import { useEffect, useState } from "react";
import { syncConsentToServer } from "@/lib/sync-consent-to-server";

/**
 * Custom React hook for managing cookie consent state and preferences.
 *
 * Handles loading consent from localStorage on mount, persisting consent changes,
 * syncing with server, and dispatching browser events for script integration.
 *
 * @returns {Object} Cookie consent utilities and state
 * @returns {CookieConsentProps} returns.consent - Current consent preferences
 * @returns {Function} returns.setConsent - Function to update consent preferences
 * @returns {boolean} returns.isLoaded - Whether consent data has been loaded from storage
 * @returns {boolean} returns.hasConsent - Whether user has actively provided consent (timestamp > 0)
 *
 * @example
 * ```tsx
 * const { consent, setConsent, isLoaded, hasConsent } = useCookieConsent();
 *
 * if (!isLoaded) return <div>Loading...</div>;
 *
 * if (!hasConsent) {
 *   return <CookieConsentBanner onAccept={setConsent} />;
 * }
 * ```
 *
 * @remarks
 * - Essential cookies are always enabled regardless of user preference
 * - Dispatches custom events ('cookieConsent:changed', 'cookieConsent:analytics', 'cookieConsent:marketing') for external script integration
 * - Automatically syncs consent preferences to server via `syncConsentToServer`
 * - Only operates on client-side (skips execution during SSR)
 */
export function useCookieConsent() {
  const [consent, setConsentState] =
    useState<CookieConsentProps>(defaultConsent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    try {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

      if (storedConsent) {
        const parsedConsent: CookieConsentProps = JSON.parse(storedConsent);
        setConsentState(parsedConsent);
      }

      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading consent state:", error);
      setIsLoaded(true);
    }
  }, []);

  const setConsent = async (newConsent: CookieConsentProps) => {
    try {
      // Update timestamp if not provided
      if (!newConsent.timestamp) {
        newConsent.timestamp = Date.now();
      }

      // Always ensure essential cookies are enabled
      newConsent.essential = true;

      // Save to localStorage
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));

      // Update state
      setConsentState(newConsent);

      // Sync with server
      await syncConsentToServer(newConsent);

      // Dispatch events for scripts to listen to
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cookieConsent:changed", { detail: newConsent })
        );

        // Specific events for each category
        window.dispatchEvent(
          new CustomEvent("cookieConsent:analytics", {
            detail: newConsent.analytics,
          })
        );

        window.dispatchEvent(
          new CustomEvent("cookieConsent:marketing", {
            detail: newConsent.marketing,
          })
        );
      }

      return true;
    } catch (error) {
      console.error("Error saving consent:", error);
      return false;
    }
  };

  return {
    consent,
    setConsent,
    isLoaded,
    // Only consider consent given if timestamp is > 0 (i.e., not default)
    hasConsent: isLoaded && consent.timestamp > 0,
  };
}
