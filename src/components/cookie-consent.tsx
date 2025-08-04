"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CookieConsentProps } from "@/types/cookies";
import { useCookieConsent } from "@/lib/hooks/use-cookie-consent";

function CookiePreferencesPanel({
  consent,
  setConsent,
  idPrefix = "",
}: {
  consent: CookieConsentProps;
  setConsent: (consent: CookieConsentProps) => void;
  idPrefix?: string;
}) {
  return (
    <div className="space-y-5 py-4">
      {/* Essential Cookies - Always enabled */}
      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
        <div className="space-y-0.5">
          <h4 className="font-medium">Essential Cookies</h4>
          <p className="text-sm text-muted-foreground">
            Required for the website to function properly. Cannot be disabled.
          </p>
        </div>
        <Switch checked={true} disabled />
      </div>

      {/* Analytics Cookies */}
      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
        <div className="space-y-0.5">
          <h4 className="font-medium">Analytics Cookies</h4>
          <p className="text-sm text-muted-foreground">
            Help us understand how visitors interact with our website.
          </p>
        </div>
        <Switch
          checked={consent.analytics}
          onCheckedChange={(checked) =>
            setConsent({ ...consent, analytics: checked })
          }
          id={`${idPrefix}analytics-cookies`}
          aria-label="Toggle analytics cookies"
        />
      </div>

      {/* Marketing Cookies */}
      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
        <div className="space-y-0.5">
          <h4 className="font-medium">Marketing Cookies</h4>
          <p className="text-sm text-muted-foreground">
            Used to track visitors across websites to display relevant
            advertisements.
          </p>
        </div>
        <Switch
          checked={consent.marketing}
          onCheckedChange={(checked) =>
            setConsent({ ...consent, marketing: checked })
          }
          id={`${idPrefix}marketing-cookies`}
          aria-label="Toggle marketing cookies"
        />
      </div>
    </div>
  );
}

function CookieDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-xl shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showCustomizeDialog, setShowCustomizeDialog] =
    useState<boolean>(false);
  const { consent, setConsent, hasConsent, isLoaded } = useCookieConsent();

  // Check if we're on the client side before showing banner
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Placeholder functions for enabling various scripts
  const enableAnalytics = () => {
    // Implementation would depend on your analytics provider
    // Example for Google Analytics:
    /*
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    */
    console.log("Analytics enabled");
  };

  const enableMarketingScripts = () => {
    // Implementation would depend on your marketing tools
    // Example for Facebook Pixel:
    /*
    window.fbq('consent', 'grant');
    */
    console.log("Marketing enabled");
  };

  // Apply consent settings to the page
  const applyConsentSettings = (consentData: CookieConsentProps) => {
    // This function would handle enabling/disabling various scripts
    // based on user consent. Actual implementation will depend on what
    // tracking tools you use.

    // For Google Analytics example:
    if (consentData.analytics) {
      // Enable analytics scripts
      enableAnalytics();
    }

    // For marketing cookies example:
    if (consentData.marketing) {
      // Enable marketing scripts
      enableMarketingScripts();
    }
  };

  useEffect(() => {
    setIsMounted(true);

    // Check if consent exists and hasn't expired
    const checkConsentStatus = () => {
      // Only run on client
      if (typeof window === "undefined") return;

      // If we have consent loaded from our hook, and the timestamp is valid,
      // don't show banner and apply settings
      if (isLoaded && hasConsent) {
        setShowBanner(false);
        // Apply consent settings immediately
        applyConsentSettings(consent);
      } else {
        // No valid consent found, show banner
        setShowBanner(true);
      }
    };

    const timer = setTimeout(() => {
      checkConsentStatus();
    }, 100);

    return () => clearTimeout(timer);
    // We're intentionally excluding applyConsentSettings as a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasConsent, consent, isLoaded]);

  /**
   * Saves the user's cookie consent preferences and applies the settings.
   *
   * @param newConsent - The cookie consent configuration to save
   * @returns Promise that resolves when consent is saved and applied
   *
   * @remarks
   * This function performs the following actions:
   * - Saves the consent preferences using the setConsent function
   * - Applies the consent settings immediately
   * - Hides the banner and customize dialog after a short delay
   * - Logs any errors that occur during the process
   *
   * @example
   * ```typescript
   * await saveConsent({
   *   necessary: true,
   *   analytics: false,
   *   marketing: true
   * });
   * ```
   */
  const saveConsent = async (newConsent: CookieConsentProps) => {
    try {
      await setConsent(newConsent);

      applyConsentSettings(newConsent);

      setTimeout(() => {
        setShowBanner(false);
        setShowCustomizeDialog(false);
      }, 50);
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookieConsentProps = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };

    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected: CookieConsentProps = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };

    saveConsent(allRejected);
  };

  const handleCustomize = () => {
    setShowCustomizeDialog(true);
  };

  const handleSavePreferences = () => {
    const updatedConsent: CookieConsentProps = {
      ...consent,
      timestamp: Date.now(),
    };

    saveConsent(updatedConsent);
  };

  // Don't render anything during SSR
  if (!isMounted) return null;

  return (
    <>
      {/* Main Cookie Consent Dialog */}
      <CookieDialog
        isOpen={showBanner}
        onOpenChange={(open) => {
          // Only allow closing through our handlers, not by clicking outside
          if (open === false) return;
          setShowBanner(open);
        }}
        title="🍪 Cookie Consent"
        description='We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can also customize your preferences or reject non-essential cookies.'
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleCustomize}
            className="whitespace-nowrap font-medium"
          >
            Customize
          </Button>
          <div className="flex gap-3">
            <Button
              variant="ghostmuted"
              onClick={handleRejectAll}
              className="whitespace-nowrap font-medium"
            >
              Reject All
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="whitespace-nowrap font-medium"
            >
              Accept All
            </Button>
          </div>
        </div>
      </CookieDialog>

      {/* Customize Dialog */}
      <CookieDialog
        isOpen={showCustomizeDialog}
        onOpenChange={setShowCustomizeDialog}
        title="Cookie Preferences"
        description="Customize which cookies you want to accept. Essential cookies cannot be disabled as they are necessary for the website to function."
      >
        <CookiePreferencesPanel
          consent={consent}
          setConsent={setConsent}
          idPrefix="customize-"
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowCustomizeDialog(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </div>
      </CookieDialog>
    </>
  );
}

/**
 * A component that provides cookie consent management functionality.
 *
 * Renders a "Cookie Settings" button that opens a dialog allowing users to
 * review and modify their cookie preferences. The component handles the state
 * management for the dialog visibility and temporary consent modifications.
 *
 * @remarks
 * - Only renders on the client side to avoid SSR hydration issues
 * - Automatically syncs managed consent state when the dialog opens
 * - Includes a small delay when closing the dialog after saving preferences
 * - Essential cookies cannot be disabled through this interface
 *
 * @returns A fragment containing the cookie settings button and management dialog,
 *          or null during server-side rendering
 */
export function CookieConsentManager() {
  const [showManageDialog, setShowManageDialog] = useState<boolean>(false);
  const [managedConsent, setManagedConsent] =
    useState<CookieConsentProps | null>(null);
  const { consent, setConsent, isLoaded } = useCookieConsent();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    if (showManageDialog && isLoaded) {
      setManagedConsent({ ...consent });
    }
  }, [showManageDialog, consent, isLoaded]);

  const handleSavePreferences = async () => {
    try {
      if (!managedConsent) return;

      const updatedConsent = {
        ...managedConsent,
        timestamp: Date.now(),
      };

      await setConsent(updatedConsent);

      setTimeout(() => {
        setShowManageDialog(false);
      }, 50);
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  // Don't render anything during SSR
  if (!isMounted) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowManageDialog(true)}
      >
        Cookie Settings
      </Button>

      <CookieDialog
        isOpen={showManageDialog}
        onOpenChange={setShowManageDialog}
        title="Manage Cookie Preferences"
        description="Review and update your cookie preferences. Essential cookies cannot be disabled as they are necessary for the website to function."
      >
        <CookiePreferencesPanel
          consent={managedConsent || consent}
          setConsent={setManagedConsent}
          idPrefix="manage-"
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setShowManageDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePreferences} className="font-medium">
            Save Changes
          </Button>
        </div>
      </CookieDialog>
    </>
  );
}
