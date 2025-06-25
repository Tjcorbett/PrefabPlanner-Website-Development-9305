import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiHome, FiSquare, FiCircle, FiCoffee, FiMonitor } = FiIcons

const FurnitureLibrary = ({ onAddItem }) => {
  const [activeCategory, setActiveCategory] = useState('living')

  const categories = [
    { id: 'living', name: 'Living Room', icon: FiHome },
    { id: 'kitchen', name: 'Kitchen', icon: FiCoffee },
    { id: 'bedroom', name: 'Bedroom', icon: FiSquare },
    { id: 'bathroom', name: 'Bathroom', icon: FiCircle },
    { id: 'structural', name: 'Structural', icon: FiSquare }
  ]

  const furnitureItems = {
    living: [
      { name: 'Sofa', icon: '🛋️', dimensions: '8x3ft', width: 96, height: 36, color: '#8B4513' },
      { name: 'Chair', icon: '🪑', dimensions: '3x3ft', width: 36, height: 36, color: '#654321' },
      { name: 'Coffee Table', icon: '🪵', dimensions: '4x2ft', width: 48, height: 24, color: '#D2691E' },
      { name: 'TV Stand', icon: '📺', dimensions: '5x1.5ft', width: 60, height: 18, color: '#2F4F4F' }
    ],
    kitchen: [
      { name: 'Stove', icon: '🔥', dimensions: '3x2ft', width: 36, height: 24, color: '#C0C0C0' },
      { name: 'Refrigerator', icon: '❄️', dimensions: '3x2ft', width: 36, height: 24, color: '#F5F5F5' },
      { name: 'Sink', icon: '🚰', dimensions: '2x2ft', width: 24, height: 24, color: '#C0C0C0' },
      { name: 'Counter', icon: '🍽️', dimensions: '8x2ft', width: 96, height: 24, color: '#8B7355' }
    ],
    bedroom: [
      { name: 'Bed', icon: '🛏️', dimensions: '6x4ft', width: 72, height: 48, color: '#F4A460' },
      { name: 'Dresser', icon: '🗄️', dimensions: '4x2ft', width: 48, height: 24, color: '#8B4513' },
      { name: 'Nightstand', icon: '🕯️', dimensions: '2x2ft', width: 24, height: 24, color: '#D2691E' },
      { name: 'Closet', icon: '👔', dimensions: '6x2ft', width: 72, height: 24, color: '#654321' }
    ],
    bathroom: [
      { name: 'Toilet', icon: '🚽', dimensions: '2x3ft', width: 24, height: 36, color: '#F5F5F5' },
      { name: 'Sink', icon: '🚿', dimensions: '2x2ft', width: 24, height: 24, color: '#C0C0C0' },
      { name: 'Bathtub', icon: '🛁', dimensions: '5x3ft', width: 60, height: 36, color: '#F5F5F5' },
      { name: 'Shower', icon: '🚿', dimensions: '3x3ft', width: 36, height: 36, color: '#C0C0C0' }
    ],
    structural: [
      { name: 'Door', icon: '🚪', dimensions: '3x7ft', width: 36, height: 84, color: '#8B4513' },
      { name: 'Window', icon: '🪟', dimensions: '4x4ft', width: 48, height: 48, color: '#87CEEB' },
      { name: 'Wall', icon: '🧱', dimensions: 'Custom', width: 120, height: 12, color: '#D2691E' },
      { name: 'Washer', icon: '🌀', dimensions: '2.5x2.5ft', width: 30, height: 30, color: '#F5F5F5' },
      { name: 'Dryer', icon: '🌪️', dimensions: '2.5x2.5ft', width: 30, height: 30, color: '#F5F5F5' }
    ]
  }

  const handleItemClick = (item) => {
    if (onAddItem) {
      onAddItem(item)
    }
  }

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Furniture Library</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <SafeIcon icon={category.icon} />
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {furnitureItems[activeCategory]?.map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors cursor-pointer"
              onClick={() => handleItemClick(item)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2 text-center">{item.icon}</div>
              <div className="text-center">
                <div className="text-sm font-medium text-white">{item.name}</div>
                <div className="text-xs text-gray-400">{item.dimensions}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default FurnitureLibrary