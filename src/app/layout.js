import { Geist, Geist_Mono } from "next/font/google";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FreeNEU",
  description: "Find Freebies at Northeastern",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ServiceWorkerRegistration />
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
