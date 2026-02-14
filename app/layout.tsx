import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'FotoProfi - Professionelle Passfotos mit KI',
  description:
    'Erstellen Sie professionelle Passfotos, Bewerbungsfotos und Dokumentenfotos kostenlos mit KI. Einfach Selfie hochladen und sofort ein biometrisches Foto erhalten.',
}

export const viewport: Viewport = {
  themeColor: '#2B5EA7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
