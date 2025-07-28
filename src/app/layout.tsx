import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/style/globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vegan E-number Checker",
  description: "Check if E-numbers are vegan on your products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="container mx-auto p-4 max-w-2xl flex flex-col items-center min-h-base justify-center space-y-4">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-500 mt-8 bg-accent py-6 ">
          <p>
            Made with ❤️ by{" "}
            <Link
              href="https://ptchblvck.com"
              prefetch={false}
              referrerPolicy="no-referrer"
              className="text-blue-500 hover:underline"
            >
              ptchblvck
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
