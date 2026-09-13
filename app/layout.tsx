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
  "MeshRun pairs a native Metal display client with cloud GPU orchestration to stream full-featured Windows engineering environments to macOS. Sub-20ms regional display responsiveness, full shortcut parity, and Bring-Your-Own-License compliance.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "MeshRun",
  keywords: [
    "Revit on Mac",
    "AutoCAD on Mac",
    "Apple Silicon CAD workstation",
    "GPU workstation streaming",
    "NVIDIA RTX Virtual Workstation",
    "BYOL engineering compute",
    "AEC cloud workstation",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-950 text-neutral-100 selection:bg-cyan-400/30">
        {children}
      </body>
    </html>
  );
}
