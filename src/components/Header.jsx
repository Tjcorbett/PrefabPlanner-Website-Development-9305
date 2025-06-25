import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import LoginModal from './auth/LoginModal'
import { useAuth } from '../contexts/AuthContext'

const { FiHome, FiUser, FiLogOut, FiSettings, FiMail, FiBell, FiHelpCircle, FiChevronDown } = FiIcons

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
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

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700"
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
                <h1 className="text-2xl font-bold text-white">PrefabPlanner</h1>
                <p className="text-sm text-gray-300">Mobile Home Design Studio</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-6">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white font-medium">{user.name}</span>
                    <SafeIcon 
                      icon={FiChevronDown} 
                      className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* User Info Header */}
                        <div className="p-4 border-b border-gray-700 bg-gray-750">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
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
                              className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
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
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-700">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-gray-700 transition-colors"
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