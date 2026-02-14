import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'

import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'FotoProfi - Kostenlose Passfotos mit KI',
  description:
    'Erstellen Sie professionelle Passfotos, Bewerbungsfotos und Dokumentenfotos kostenlos mit KI. Einfach Selfie hochladen und sofort ein biometrisches Foto erhalten.',
}

export const viewport: Viewport = {
  themeColor: '#E84393',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${nunito.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
