import type { Metadata } from "next";
import { Anton, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/lib/theme";
import { ShortlistProvider } from "@/lib/shortlist";
import { ShortlistDrawer } from "@/components/ShortlistDrawer";

const displayFont = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const monoFont = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Aditya Shibu — ML & Systems Engineer",
    template: "%s — Aditya Shibu",
  },
  description:
    "ML & Systems Engineer. I write models that run on-device — computer vision in your browser, no server required. Came up through C++ and systems, going all-in on CV.",
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
      className={`${sansFont.variable} ${monoFont.variable} ${displayFont.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg text-text-primary font-sans noise-overlay">
        <ThemeProvider>
          <ShortlistProvider>
            <SmoothScroll>
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </SmoothScroll>
            <ShortlistDrawer />
          </ShortlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
