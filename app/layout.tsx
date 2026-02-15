import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'FotoProfi - Professionelle Passfotos mit KI',
  description:
    'Erstellen Sie professionelle Passfotos, Bewerbungsfotos und Dokumentenfotos kostenlos mit KI. Einfach Selfie hochladen und sofort ein biometrisches Foto erhalten.',
}

export const viewport: Viewport = {
  themeColor: '#0A0E17',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
