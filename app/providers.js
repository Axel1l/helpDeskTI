'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  )
}