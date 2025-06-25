import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const { FiMapPin, FiPhone, FiMail, FiExternalLink, FiStar, FiFilter } = FiIcons

const Manufacturers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedState, setSelectedState] = useState('all')

  const manufacturers = [
    {
      id: 1,
      name: 'Clayton Homes',
      category: 'manufactured',
      location: 'Maryville, TN',
      state: 'TN',
      phone: '(865) 380-3000',
      email: 'info@claytonhomes.com',
      website: 'https://claytonhomes.com',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      description: 'One of the largest manufactured home builders in America, offering quality homes at affordable prices.',
      specialties: ['Single Wide', 'Double Wide', 'Triple Wide', 'Modular Homes'],
      established: 1956,
      locations: 45
    },
    {
      id: 2,
      name: 'Champion Homes',
      category: 'modular',
      location: 'Auburn Hills, MI',
      state: 'MI',
      phone: '(248) 340-9090',
      email: 'contact@championhomes.com',
      website: 'https://championhomes.com',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      description: 'Leading manufacturer of modular and manufactured homes with innovative designs and energy efficiency.',
      specialties: ['Modular Homes', 'Park Models', 'Tiny Homes'],
      established: 1953,
      locations: 32
    },
    {
      id: 3,
      name: 'Fleetwood Homes',
      category: 'manufactured',
      location: 'Riverside, CA',
      state: 'CA',
      phone: '(951) 351-3500',
      email: 'sales@fleetwoodhomes.com',
      website: 'https://fleetwoodhomes.com',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      description: 'Premium manufactured homes with luxury features and customizable floor plans.',
      specialties: ['Luxury Manufactured', 'Custom Designs', 'Smart Homes'],
      established: 1950,
      locations: 28
    },
    {
      id: 4,
      name: 'Skyline Corporation',
      category: 'modular',
      location: 'Elkhart, IN',
      state: 'IN',
      phone: '(574) 294-6521',
      email: 'info@skylinecorp.com',
      website: 'https://skylinecorp.com',
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=300&fit=crop',
      description: 'Innovative modular home manufacturer focusing on sustainable building practices.',
      specialties: ['Green Building', 'Modular Construction', 'Commercial Buildings'],
      established: 1951,
      locations: 38
    },
    {
      id: 5,
      name: 'Palm Harbor Homes',
      category: 'manufactured',
      location: 'Addison, TX',
      state: 'TX',
      phone: '(972) 991-2422',
      email: 'contact@palmharbor.com',
      website: 'https://palmharbor.com',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop',
      description: 'High-quality manufactured homes with innovative floor plans and premium finishes.',
      specialties: ['Custom Floor Plans', 'Energy Efficient', 'Smart Technology'],
      established: 1977,
      locations: 25
    },
    {
      id: 6,
      name: 'Cavco Industries',
      category: 'park_model',
      location: 'Phoenix, AZ',
      state: 'AZ',
      phone: '(602) 256-6263',
      email: 'info@cavco.com',
      website: 'https://cavco.com',
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      description: 'Specialized in park model homes and recreational vehicles for resort living.',
      specialties: ['Park Models', 'Resort Homes', 'Vacation Rentals'],
      established: 1965,
      locations: 18
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'manufactured', name: 'Manufactured Homes' },
    { id: 'modular', name: 'Modular Homes' },
    { id: 'park_model', name: 'Park Models' }
  ]

  const states = [
    { id: 'all', name: 'All States' },
    { id: 'FL', name: 'Florida' },
    { id: 'TX', name: 'Texas' },
    { id: 'CA', name: 'California' },
    { id: 'TN', name: 'Tennessee' },
    { id: 'MI', name: 'Michigan' },
    { id: 'IN', name: 'Indiana' },
    { id: 'AZ', name: 'Arizona' }
  ]

  const filteredManufacturers = manufacturers.filter(manufacturer => {
    const categoryMatch = selectedCategory === 'all' || manufacturer.category === selectedCategory
    const stateMatch = selectedState === 'all' || manufacturer.state === selectedState
    return categoryMatch && stateMatch
  })

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<SafeIcon key={i} icon={FiStar} className="text-yellow-400 fill-current" />)
    }

    if (hasHalfStar) {
      stars.push(<SafeIcon key="half" icon={FiStar} className="text-yellow-400 fill-current opacity-50" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<SafeIcon key={`empty-${i}`} icon={FiStar} className="text-gray-600" />)
    }

    return stars
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Manufacturers Directory</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with leading mobile home manufacturers across the United States
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <SafeIcon icon={FiFilter} className="text-orange-400 text-xl" />
            <h2 className="text-lg font-semibold">Filter Manufacturers</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Manufacturers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredManufacturers.map((manufacturer, index) => (
            <motion.div
              key={manufacturer.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={manufacturer.image}
                  alt={manufacturer.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold">{manufacturer.name}</h3>
                  <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    {manufacturer.category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(manufacturer.rating)}
                  <span className="text-gray-400 text-sm ml-2">
                    ({manufacturer.rating})
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">
                  {manufacturer.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <SafeIcon icon={FiMapPin} />
                    <span>{manufacturer.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <SafeIcon icon={FiPhone} />
                    <span>{manufacturer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <SafeIcon icon={FiMail} />
                    <span>{manufacturer.email}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {manufacturer.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>Est. {manufacturer.established}</span>
                  <span>{manufacturer.locations} Locations</span>
                </div>
                
                <a
                  href={manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors w-full"
                >
                  <span>Visit Website</span>
                  <SafeIcon icon={FiExternalLink} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredManufacturers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No manufacturers found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Manufacturers