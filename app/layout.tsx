import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google"; // Using Nunito for a more rounded, playful look instead of Geist
import "./globals.css";
import Navbar from "@/components/Navbar";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Find Dae — ตามหารูปมุมเผลอของคุณในงานอีเวนต์!",
  description:
    "เว็บค้นหารูปสุดคิวต์ด้วย AI จดจำใบหน้า ช่างภาพอัปโหลดรูปง่าย ผู้เข้าร่วมหาหน้าตัวเองเจอไวในคลิกเดียว",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ff8c42',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${nunito.variable} h-full antialiased scroll-smooth scroll-pt-32`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
