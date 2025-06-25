import React from 'react'
import { motion } from 'framer-motion'

const TemplateSelector = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: '28x68',
      name: '28x68 ft Single Wide',
      dimensions: { width: 28, length: 68 },
      description: 'Compact single-wide layout perfect for starter homes',
      preview: '/api/placeholder/200/120'
    },
    {
      id: '32x80',
      name: '32x80 ft Double Wide',
      dimensions: { width: 32, length: 80 },
      description: 'Spacious double-wide with open floor plan',
      preview: '/api/placeholder/200/120'
    },
    {
      id: '16x80',
      name: '16x80 ft Park Model',
      dimensions: { width: 16, length: 80 },
      description: 'Narrow park model ideal for tight spaces',
      preview: '/api/placeholder/200/120'
    }
  ]

  const handleSelectTemplate = (template) => {
    // Create basic template structure
    const templateData = {
      version: '4.6.0',
      objects: [
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: template.dimensions.width * 10,
          height: template.dimensions.length * 10,
          fill: 'transparent',
          stroke: '#f97316',
          strokeWidth: 3
        }
      ]
    }
    
    onSelectTemplate(templateData)
  }

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Floor Plan Templates</h3>
        <p className="text-sm text-gray-400 mt-1">Choose a template to get started</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className="bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors cursor-pointer overflow-hidden"
              onClick={() => handleSelectTemplate(template)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-32 bg-gray-700 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="text-xs">
                    {template.dimensions.width}' × {template.dimensions.length}'
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                <p className="text-sm text-gray-400">{template.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default TemplateSelector