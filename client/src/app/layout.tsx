import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar/Navbar"
import RootLayoutClient from "./RootLayout"
import ReduxProvider from "@/redux/Provider";
import Footer from "@/components/Footer/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "HealthCare+ | Your Trusted Healthcare Platform",
  description: "Manage your health journey with HealthCare+",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ReduxProvider>
        <RootLayoutClient>
        <Navbar />
          {children}
          <Footer/>
          </RootLayoutClient>
          </ReduxProvider>
      </body>
    </html>
  )
}
