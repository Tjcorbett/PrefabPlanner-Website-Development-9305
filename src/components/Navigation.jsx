import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTheme } from '../contexts/ThemeContext'

const { FiHome, FiEdit3, FiImage, FiInfo, FiPhone, FiTool, FiTruck } = FiIcons

const Navigation = () => {
  const location = useLocation()
  const { isDark } = useTheme()

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/editor', label: 'Floorplan Editor', icon: FiEdit3 },
    { path: '/gallery', label: 'Gallery', icon: FiImage },
    { path: '/manufacturers', label: 'Manufacturers', icon: FiTool },
    { path: '/dealers', label: 'Dealers', icon: FiTruck },
    { path: '/about', label: 'About', icon: FiInfo },
    { path: '/contact', label: 'Contact', icon: FiPhone }
  ]

  return (
    <motion.nav 
      className={`fixed top-20 left-0 right-0 z-40 backdrop-blur-sm border-b transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'border-orange-500 text-orange-400'
                    : `border-transparent transition-colors duration-300 ${
                        isDark 
                          ? 'text-gray-300 hover:text-white hover:border-gray-500' 
                          : 'text-gray-700 hover:text-gray-900 hover:border-gray-400'
                      }`
                }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation