import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTheme } from '../contexts/ThemeContext'

const { FiSun, FiMoon, FiMonitor, FiChevronDown } = FiIcons

const ThemeToggle = () => {
  const { theme, toggleTheme, setTheme, isDark } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  const themes = [
    { id: 'light', name: 'Light', icon: FiSun },
    { id: 'dark', name: 'Dark', icon: FiMoon },
    { id: 'system', name: 'System', icon: FiMonitor }
  ]

  const currentTheme = themes.find(t => t.id === theme)

  const handleThemeSelect = (themeId) => {
    setTheme(themeId)
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      {/* Quick Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
        }`}
        title={`Current: ${currentTheme?.name} theme`}
      >
        <SafeIcon icon={currentTheme?.icon} className="text-lg" />
      </button>

      {/* Dropdown Toggle */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`ml-1 p-2 rounded-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
        }`}
        title="Theme options"
      >
        <SafeIcon 
          icon={FiChevronDown} 
          className={`text-sm transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg overflow-hidden z-50 transition-colors duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeSelect(themeOption.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-300 ${
                    theme === themeOption.id
                      ? 'bg-orange-600 text-white'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={themeOption.icon} className="text-lg" />
                  <span className="font-medium">{themeOption.name}</span>
                  {theme === themeOption.id && (
                    <SafeIcon icon={FiSun} className="ml-auto text-sm" />
                  )}
                </button>
              ))}
            </div>
            
            <div className={`border-t p-3 transition-colors duration-300 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <p className={`text-xs transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                System theme follows your OS preference
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeToggle