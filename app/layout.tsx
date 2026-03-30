import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${nunito.variable} h-full antialiased scroll-smooth scroll-pt-32`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
