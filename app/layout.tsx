import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { locales } from "@/i18n"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Decision OS - Product Decision Management",
  description: "Manage product decisions with GitHub workflow integration",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
