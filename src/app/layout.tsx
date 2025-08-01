import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/queryProvider";
import { Balsamiq_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
const balsamiq = Balsamiq_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // Optional
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${balsamiq.className} antialiased dark:bg-primary-dark`}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
