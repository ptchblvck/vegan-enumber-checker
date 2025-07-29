import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/style/globals.css";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vegan E-Number Checker | Check Food Additives for Vegan Status",
    template: "%s | Vegan E-Number Checker",
  },
  description:
    "Instantly check if E-numbers in food products are vegan-friendly. Upload ingredient photos or type text to verify food additives. Free OCR scanner for vegan verification.",
  keywords: [
    "vegan",
    "e-numbers",
    "food additives",
    "vegan checker",
    "ingredient scanner",
    "OCR",
    "food safety",
    "plant-based",
    "vegan food",
    "ingredient list",
  ],
  authors: [{ name: "ptchblvck", url: "https://ptchblvck.com" }],
  creator: "ptchblvck",
  publisher: "ptchblvck",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add when you have it
  },
  appleWebApp: {
    title: "Vegan E-Numbers",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased md:subpixel-antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <noscript>
            <div
              style={{
                backgroundColor: "#ffdddd",
                color: "#990000",
                padding: "1rem",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              JavaScript is disabled in your browser. This site requires
              JavaScript to function properly. Please enable it in your
              settings.
            </div>
          </noscript>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="container mx-auto p-4 max-w-2xl flex flex-col items-center flex-1 justify-center space-y-4">
              {children}
            </main>
            <footer className="text-center text-sm text-muted-foreground mt-8 bg-muted py-6 ">
              <p>
                Made with ❤️ by{" "}
                <Link
                  href="https://ptchblvck.com"
                  prefetch={false}
                  referrerPolicy="no-referrer"
                  className="text-primary/80 underline hover:text-primary"
                >
                  ptchblvck
                </Link>
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
