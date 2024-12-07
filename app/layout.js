import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'HelpDesk TI',
  description: 'Sistema de gestión de tickets de soporte técnico',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
      <AuthProvider>
        <Providers>
          {children}
        </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}