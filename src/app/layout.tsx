import type { Metadata } from "next";
import { Anton, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/lib/theme";
import { ShortlistProvider } from "@/lib/shortlist";
import { ShortlistDrawer } from "@/components/ShortlistDrawer";
import { SITE_URL } from "@/lib/constants";

const displayFont = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const monoFont = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Aditya Shibu — ML & Systems Engineer",
    template: "%s — Aditya Shibu",
  },
  description:
    "ML & Systems Engineer. I write models that run on-device — computer vision in your browser, no server required. Came up through C++ and systems, going all-in on CV.",
  metadataBase: new URL(SITE_URL),
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
  alternates: {
    canonical: "/",
  },
};

/** Person + WebSite structured data. Searching a name is an entity lookup, not
 *  a keyword match — this is what lets Google tie the domain, the GitHub and
 *  LinkedIn profiles, and the job title together as one person rather than
 *  guessing from page text. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Aditya Shibu",
      url: SITE_URL,
      image: `${SITE_URL}/images/me/headshot.webp`,
      jobTitle: "ML & Systems Engineer",
      description:
        "ML and systems engineer building on-device computer vision — models that run in the browser, at the edge, without a server.",
      knowsAbout: [
        "Machine Learning",
        "Computer Vision",
        "On-device Inference",
        "C++",
        "Systems Programming",
        "LLM Security",
      ],
      sameAs: [
        "https://github.com/Vic-41148",
        "https://linkedin.com/in/adityashibu41148",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressCountry: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Aditya Shibu",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
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
        <script
          type="application/ld+json"
          // Built from a literal above, so there's no user input to escape.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
