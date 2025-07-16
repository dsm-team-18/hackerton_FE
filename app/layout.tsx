import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agora',
  description: 'historical discussions platform',
  generator: 'Agora.dev.chan',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
