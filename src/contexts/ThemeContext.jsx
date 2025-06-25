import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [systemTheme, setSystemTheme] = useState('dark')

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('prefab_theme')
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    setSystemTheme(systemPreference)
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(systemPreference)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      if (theme === 'system') {
        applyTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    applyTheme(theme === 'system' ? systemTheme : theme)
  }, [theme, systemTheme])

  const applyTheme = (themeToApply) => {
    const root = document.documentElement
    const body = document.body
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light')
    body.classList.remove('dark', 'light')
    
    if (themeToApply === 'dark') {
      root.classList.add('dark')
      body.classList.add('dark')
      
      // Set CSS custom properties for dark mode
      root.style.setProperty('--bg-primary', '#0f172a')
      root.style.setProperty('--bg-secondary', '#1e293b')
      root.style.setProperty('--bg-tertiary', '#334155')
      root.style.setProperty('--bg-quaternary', '#475569')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#cbd5e1')
      root.style.setProperty('--text-tertiary', '#94a3b8')
      root.style.setProperty('--border-color', '#475569')
      root.style.setProperty('--border-light', '#64748b')
      root.style.setProperty('--hover-bg', '#374151')
      
      // Set body background
      body.style.backgroundColor = '#0f172a'
      body.style.color = '#ffffff'
    } else {
      root.classList.add('light')
      body.classList.add('light')
      
      // Set CSS custom properties for light mode
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--bg-secondary', '#f8fafc')
      root.style.setProperty('--bg-tertiary', '#e2e8f0')
      root.style.setProperty('--bg-quaternary', '#cbd5e1')
      root.style.setProperty('--text-primary', '#1e293b')
      root.style.setProperty('--text-secondary', '#475569')
      root.style.setProperty('--text-tertiary', '#64748b')
      root.style.setProperty('--border-color', '#cbd5e1')
      root.style.setProperty('--border-light', '#e2e8f0')
      root.style.setProperty('--hover-bg', '#f1f5f9')
      
      // Set body background
      body.style.backgroundColor = '#f8fafc'
      body.style.color = '#1e293b'
    }
  }

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    
    setTheme(nextTheme)
    localStorage.setItem('prefab_theme', nextTheme)
  }

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('prefab_theme', newTheme)
  }

  const value = {
    theme,
    systemTheme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'system' ? systemTheme === 'dark' : theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}