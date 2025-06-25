import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import LoginModal from './auth/LoginModal'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const { FiHome, FiUser, FiLogOut, FiSettings, FiMail, FiBell, FiHelpCircle, FiChevronDown, FiShield } = FiIcons

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const menuItems = [
    {
      icon: FiMail,
      label: 'Inbox',
      href: '#/inbox',
      badge: '3' // You can make this dynamic
    },
    {
      icon: FiSettings,
      label: 'Profile Settings',
      href: '#/profile'
    },
    {
      icon: FiBell,
      label: 'Notifications',
      href: '#/notifications'
    },
    {
      icon: FiHelpCircle,
      label: 'Help & Support',
      href: '#/help'
    }
  ]

  // Add admin section for admin users
  const adminMenuItems = user?.role === 'admin' || user?.email === 'admin@prefabplanner.com' ? [
    {
      icon: FiShield,
      label: 'Admin Panel',
      href: '#/admin',
      special: true
    }
  ] : []

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b transition-all duration-300 ${
          isDark 
            ? 'bg-gray-900/95 border-gray-700' 
            : 'bg-white/95 border-gray-200'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiHome} className="text-white text-xl" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  PrefabPlanner
                </h1>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Mobile Home Design Studio
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Section */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </span>
                    <SafeIcon 
                      icon={FiChevronDown} 
                      className={`transition-all duration-300 ${
                        showUserMenu ? 'rotate-180' : ''
                      } ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className={`absolute right-0 mt-2 w-64 rounded-lg border shadow-lg overflow-hidden transition-colors duration-300 ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* User Info Header */}
                        <div className={`p-4 border-b transition-colors duration-300 ${isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <p className={`font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {user.name}
                              </p>
                              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {user.email}
                              </p>
                              <p className="text-orange-400 text-xs capitalize">
                                {user.role || 'user'} account
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {menuItems.map((item, index) => (
                            <a
                              key={index}
                              href={item.href}
                              className={`flex items-center justify-between px-4 py-3 transition-colors duration-300 ${
                                isDark 
                                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <SafeIcon icon={item.icon} className="text-lg" />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </a>
                          ))}
                          
                          {/* Admin Section */}
                          {adminMenuItems.length > 0 && (
                            <>
                              <div className={`border-t my-2 transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
                              {adminMenuItems.map((item, index) => (
                                <a
                                  key={`admin-${index}`}
                                  href={item.href}
                                  className={`flex items-center justify-between px-4 py-3 transition-colors duration-300 ${
                                    isDark 
                                      ? 'text-orange-400 hover:text-orange-300 hover:bg-gray-700' 
                                      : 'text-orange-600 hover:text-orange-700 hover:bg-gray-100'
                                  }`}
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <div className="flex items-center space-x-3">
                                    <SafeIcon icon={item.icon} className="text-lg" />
                                    <span className="font-medium">{item.label}</span>
                                  </div>
                                  <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                                    Admin
                                  </span>
                                </a>
                              ))}
                            </>
                          )}
                        </div>

                        {/* Logout */}
                        <div className={`border-t transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors duration-300 ${
                              isDark 
                                ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700' 
                                : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
                            }`}
                          >
                            <SafeIcon icon={FiLogOut} className="text-lg" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <SafeIcon icon={FiUser} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}

export default Header