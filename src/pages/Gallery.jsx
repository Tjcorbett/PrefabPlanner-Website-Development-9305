import React from 'react'
import { motion } from 'framer-motion'

const Gallery = () => {
  const projects = [
    {
      id: 1,
      title: '28x68 Modern Single Wide',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      description: 'Contemporary single-wide with open concept living',
      specs: '2 BR, 2 BA, 1,904 sq ft'
    },
    {
      id: 2,
      title: '32x80 Family Double Wide',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      description: 'Spacious family home with split bedroom layout',
      specs: '3 BR, 2 BA, 2,560 sq ft'
    },
    {
      id: 3,
      title: '16x80 Luxury Park Model',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      description: 'High-end park model with premium finishes',
      specs: '1 BR, 1 BA, 1,280 sq ft'
    },
    {
      id: 4,
      title: '28x68 Rustic Retreat',
      image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=300&fit=crop',
      description: 'Cozy cabin-style mobile home design',
      specs: '2 BR, 1 BA, 1,904 sq ft'
    },
    {
      id: 5,
      title: '32x80 Executive Home',
      image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop',
      description: 'Executive-style double wide with office space',
      specs: '4 BR, 3 BA, 2,560 sq ft'
    },
    {
      id: 6,
      title: '16x80 Minimalist Design',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      description: 'Clean, minimalist park model layout',
      specs: '1 BR, 1 BA, 1,280 sq ft'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Design Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our collection of beautiful mobile home designs created with PrefabPlanner
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-3">{project.description}</p>
                <div className="text-sm text-orange-400 font-medium">{project.specs}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gallery