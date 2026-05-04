'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem('biohna-theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.dataset.theme = mode
    localStorage.setItem('biohna-theme', mode)
  }, [mode])

  const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
