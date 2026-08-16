import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pjs",
});

export const metadata: Metadata = {
  title: "PetaBola | Peta Klub Sepak Bola Indonesia",
  description: "Persebaran Klub Sepak Bola Nusantara – Liga 1, Liga 2, Liga 3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} snap-y snap-proximity`} suppressHydrationWarning>
      <body className="font-dm antialiased bg-[#F0F2F5] text-[#374151] dark:bg-[#0d1b2a] dark:text-white/80" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
