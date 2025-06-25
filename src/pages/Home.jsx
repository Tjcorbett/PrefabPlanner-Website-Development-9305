import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTheme } from '../contexts/ThemeContext'

const { FiEdit3, FiZap, FiUsers, FiAward, FiGrid, FiShield } = FiIcons

const Home = () => {
  const { isDark } = useTheme()

  const features = [
    {
      icon: FiEdit3,
      title: 'Advanced 2D Design Tools',
      description: 'Professional floorplan editor with drag-and-drop furniture, walls, doors, and windows'
    },
    {
      icon: FiGrid,
      title: 'Precision Grid System',
      description: 'Snap-to-grid functionality for accurate measurements and professional layouts'
    },
    {
      icon: FiZap,
      title: 'Instant Templates',
      description: 'Pre-built layouts for 28x68ft, 32x80ft, and 16x80ft mobile homes'
    },
    {
      icon: FiUsers,
      title: 'User Accounts',
      description: 'Sign in with email, Google, or Facebook to save and sync your designs'
    },
    {
      icon: FiAward,
      title: 'Professional Quality',
      description: 'Export high-resolution plans ready for construction and permits'
    },
    {
      icon: FiShield,
      title: 'Secure & Reliable',
      description: 'Your designs are safely stored and accessible from anywhere'
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Hero Section */}
      <motion.section 
        className={`relative py-20 px-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-950' : 'bg-gray-50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Design Your Dream<br />Mobile Home
          </motion.h1>
          <motion.p 
            className={`text-xl mb-8 max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Professional 2D floorplan design tools for mobile home builders and designers in Live Oak, Florida. 
            Create stunning layouts with our intuitive drag-and-drop editor featuring comprehensive furniture 
            libraries and precision design tools.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/editor"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <SafeIcon icon={FiEdit3} />
              <span>Start Designing</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className={`py-20 px-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-900/50' : 'bg-white'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose PrefabPlanner?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:border-orange-500' 
                    : 'bg-gray-50 border-gray-200 hover:border-orange-500'
                }`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <SafeIcon icon={feature.icon} className="text-white text-xl" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className={`py-20 px-6 transition-colors duration-300 ${
          isDark ? 'bg-gray-950' : 'bg-gray-50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="container mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Get Started?
          </h2>
          <p className={`text-xl mb-8 transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Join mobile home professionals across Live Oak who trust PrefabPlanner for their design needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/editor"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Launch Editor
            </Link>
            <Link
              to="/gallery"
              className={`border px-8 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                isDark 
                  ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                  : 'border-gray-400 hover:border-gray-500 text-gray-700 hover:text-gray-900'
              }`}
            >
              View Gallery
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home