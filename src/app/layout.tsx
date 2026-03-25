import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خل نلعب",
  description: "منصة ألعاب عائلية عربية"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}