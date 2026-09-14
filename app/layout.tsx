import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://meshrun.co";
const TITLE = "MeshRun - CAD Anywhere";
const DESCRIPTION =
  "MeshRun streams full-featured Windows CAD — Revit, AutoCAD, Fusion, Inventor — to the laptop you already carry. A native desktop client, workstation GPUs, 20–40ms in North America, and you bring your own Autodesk licence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "MeshRun",
  keywords: [
    "Revit on Mac",
    "AutoCAD on Mac",
    "Fusion 360 on Mac",
    "CAD for students",
    "Apple Silicon CAD",
    "GPU workstation streaming",
    "cloud CAD workstation",
    "BYOL CAD compute",
  ],
  authors: [{ name: "MeshRun Technologies Inc." }],
  creator: "MeshRun Technologies Inc.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MeshRun",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/*
 * Runs before first paint so the stored theme is on <html> by the time any
 * pixel is drawn. Without it a light-mode visitor gets a black flash on every
 * navigation. Kept inline and tiny for that reason.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("mr-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-void text-ink-body flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
