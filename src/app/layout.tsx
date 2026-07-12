import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PropertyProvider } from "@/context/PropertyContext";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayNest - Find Your Perfect Home Away From Home",
  description:
    "Discover handpicked rental properties in the finest neighborhoods — from urban penthouses to mountain retreats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PropertyProvider>
          <AppShell>{children}</AppShell>
        </PropertyProvider>
      </body>
    </html>
  );
}
