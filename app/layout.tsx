import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>The Bestcare Family Clinic | Dr. Syed Baidar Hussain Zaidi</title>
        <meta name="description" content="Quality healthcare for your whole family. Dr. Syed Baidar Hussain Zaidi - Experienced Family Physician & Child Specialist with 25+ years of compassionate, personalized care." />
        <meta name="keywords" content="family clinic, pediatrics, child specialist, family physician, healthcare, vaccinations, health checkups" />
        <meta name="theme-color" content="#3d6b5e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
