import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'UP Enrol POC — UP Education',
  description:
    'Agent POC for NZ international enrolment: AI document reading, rules-based conditional Letter of Offer, Dynamics 365 push.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <StoreProvider>
          <TooltipProvider delay={200}>{children}</TooltipProvider>
          <Toaster position="bottom-right" />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
