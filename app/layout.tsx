import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watch Fun",
  description: "Track your watched movies with ratings and links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0f13] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
