import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cabinetGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/CabinetGrotesk-Variable.woff2",
      weight: "100 900",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aditya Shibu — ML & Systems Engineer",
    template: "%s — Aditya Shibu",
  },
  description:
    "ML & Systems Engineer. I build machine learning that runs on-device — computer vision in your browser, models packaged to ship. C++, systems, and going deep on CV.",
  metadataBase: new URL("https://adityashibu.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aditya Shibu",
    images: [{ url: "/images/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: "/images/og/default.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cabinetGrotesk.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-text-primary font-sans noise-overlay">
        <ThemeProvider>
          <SmoothScroll>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
