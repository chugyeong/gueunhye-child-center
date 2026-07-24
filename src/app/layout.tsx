import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AosProvider } from "@/components/ui/aos-provider";
import "aos/dist/aos.css";
import "swiper/css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase: new URL("https://gueunhye-child-center.example.com"),
  icons: {
    icon: "/images/logo.png",
  },
  title: {
    default: "아동발달센터",
    template: "%s | 아동발달센터",
  },
  description:
    "언어치료, 무발화 핸들링 언어치료, 구강운동치료, 작업인지 및 시지각, 연하재활치료, 사회성 그룹, 플로어타임, 학교대비반을 안내합니다.",
  keywords: [
    "천안 아동발달센터",
    "언어치료",
    "구강운동치료",
    "연하재활치료",
    "플로어타임",
  ],
  openGraph: {
    title: "아동발달센터",
    description: "치료 프로그램 및 문의 안내",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        <AosProvider />
        {children}
      </body>
    </html>
  );
}
