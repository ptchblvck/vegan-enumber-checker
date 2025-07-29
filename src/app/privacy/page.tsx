import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | How We Handle Your Data",
  description:
    "Learn how we protect your privacy and handle your data when using our vegan E-number checker.",
};

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          How we protect your privacy when using our Vegan E-Number Checker
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date("2025-07-29").toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Privacy-First Approach</h2>
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              🔒 Your Data Stays on Your Device
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Our Vegan E-Number Checker is designed with privacy as a core
              principle. All processing happens directly in your browser - we
              never see, store, or transmit your images or text data to our
              servers.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What We Do NOT Collect</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">📷 Images</h3>
              <p className="text-sm text-muted-foreground">
                Images you upload are processed entirely in your browser using
                client-side OCR technology. They never leave your device.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">📝 Text Data</h3>
              <p className="text-sm text-muted-foreground">
                Ingredient text you enter is analyzed locally in your browser.
                We do not store or transmit this information.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">🔍 Search Results</h3>
              <p className="text-sm text-muted-foreground">
                E-number analysis results are generated in your browser and are
                not saved or tracked by us.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-2">👤 Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                We do not require accounts, emails, or any personal information
                to use our service.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How Our Technology Works</h2>
          <div className="space-y-3">
            <p>
              Our Vegan E-Number Checker uses modern web technologies to provide
              a completely private experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Client-Side OCR:</strong> Image text extraction happens
                in your browser using Tesseract.js, without server
                communication.
              </li>
              <li>
                <strong>Local Processing:</strong> E-number identification and
                vegan status checking occurs entirely on your device.
              </li>
              <li>
                <strong>Static Hosting:</strong> Our website is hosted as static
                files with no backend database or user tracking systems.
              </li>
              <li>
                <strong>No Cookies:</strong> We do not use tracking cookies or
                analytics that could identify you.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Technical Data We May Collect
          </h2>
          <p>
            Like most websites, our hosting provider may automatically collect
            minimal technical information for security and performance purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Your IP address (for security and abuse prevention)</li>
            <li>Browser type and version (for compatibility)</li>
            <li>Date and time of access (for performance monitoring)</li>
            <li>Pages visited on our site (for analytics)</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            This technical data is anonymized, cannot be used to identify you
            personally, and is automatically deleted after a short period.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Third-Party Services</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Hosting Provider</h3>
            <p className="text-muted-foreground">
              Our website is hosted by a reputable hosting provider. They may
              collect basic server logs as described above, but have no access
              to any data you process using our application.
            </p>

            <h3 className="text-lg font-medium">No Analytics or Tracking</h3>
            <p className="text-muted-foreground">
              We deliberately choose not to use Google Analytics, Facebook
              Pixel, or other tracking services that could compromise your
              privacy.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>
            Since we do not collect personal data, most data protection rights
            do not apply. However:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>Right to Information:</strong> This privacy policy
              explains exactly how our service works.
            </li>
            <li>
              <strong>Right to Control:</strong> You have complete control over
              what data you input and when.
            </li>
            <li>
              <strong>Right to Delete:</strong> Simply close your browser tab -
              all processing data is automatically cleared.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <p>
            Since all processing happens on your device, your data security is
            primarily in your hands:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Keep your browser and device updated</li>
            <li>Use our website over HTTPS (which we enforce)</li>
            <li>Be cautious when using public or shared devices</li>
          </ul>
          <p className="text-muted-foreground">
            Our website uses modern security headers and HTTPS encryption to
            protect your connection to our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Children&apos;s Privacy</h2>
          <p className="text-muted-foreground">
            Our service does not collect personal information from anyone,
            including children under 13. The privacy-first design makes it safe
            for users of all ages.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">International Users</h2>
          <p className="text-muted-foreground">
            Since all processing happens in your browser, there are no
            international data transfers of your personal content. Our
            privacy-first approach complies with GDPR, CCPA, and other privacy
            regulations worldwide.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this privacy policy occasionally to reflect changes in
            our service or legal requirements. Any updates will be posted on
            this page with a new &ldquo;Last updated&rdquo; date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Open Source</h2>
          <p className="text-muted-foreground">
            Our commitment to transparency extends to our code. You can review
            our source code to verify our privacy claims and see exactly how
            your data is processed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this privacy policy or our privacy
            practices, you can contact us through our website or GitHub
            repository.
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm">
              <strong>Remember:</strong> Since we do not collect your personal
              data, we cannot delete, modify, or export data we do not have.
              Your privacy is protected by design, not just by policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
