import { CookieConsentProps } from "@/types/cookies";

/**
 * Synchronizes user cookie consent data to the server via API.
 *
 * @param consentData - The cookie consent configuration object containing user preferences
 * @returns Promise that resolves to the server response JSON, or undefined if the request fails
 *
 * @remarks
 * This function sends a POST request to `/api/consent` with the provided consent data.
 * The request includes credentials for authenticated users. If the server request fails,
 * the error is logged but does not throw to avoid breaking the user experience.
 *
 * @example
 * ```typescript
 * const consentData = { analytics: true, marketing: false };
 * const result = await syncConsentToServer(consentData);
 * ```
 */
export async function syncConsentToServer(consentData: CookieConsentProps) {
  try {
    const response = await fetch("/api/consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consentData),
      // Include credentials for authenticated users
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Log but don't break user experience if server sync fails
    console.error("Failed to sync consent to server:", error);
  }
}
