import { Geist, Geist_Mono } from "next/font/google";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";
import "../styles/globals.css";
import Head from "next/head";
import {Analytics} from "@vercel/analytics/next";

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

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <Head>
            <link rel="manifest" href="/manifest.js" />
            <meta name="theme-color" content="#000000" />
        </Head>
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <ServiceWorkerRegistration />
            <Analytics/>
            {children}
          </body>
    </html>
  );
}
