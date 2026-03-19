import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/widgets/navigation/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "中国色宇宙 | Chinese Color Universe",
  description:
    "通过 Web3.0 / WebGL 技术，把中国传统颜色文化转化为可以探索的宇宙系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" style={{ background: "#050510" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased cosmic-bg`}
        style={{ background: "#050510", minHeight: "100vh" }}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
