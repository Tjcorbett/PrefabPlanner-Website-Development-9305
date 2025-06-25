import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../contexts/AuthContext'
import { getDealers } from '../services/adminService'
import MessageDealerModal from '../components/messaging/MessageDealerModal'

const { FiMapPin, FiPhone, FiMail, FiExternalLink, FiStar, FiFilter, FiTruck, FiMessageSquare } = FiIcons

const DealerDirectory = () => {
  const { user } = useAuth()
  const [dealers, setDealers] = useState([])
  const [filteredDealers, setFilteredDealers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState(null)

  useEffect(() => {
    loadDealers()
  }, [])

  useEffect(() => {
    filterDealers()
  }, [dealers, selectedState, searchTerm])

  const loadDealers = async () => {
    setLoading(true)
    try {
      const result = await getDealers()
      if (result.data) {
        // Only show active dealers to public
        const activeDealers = result.data.filter(dealer => dealer.status === 'active')
        setDealers(activeDealers)
      }
    } catch (error) {
      console.error('Error loading dealers:', error)
    }
    setLoading(false)
  }

  const filterDealers = () => {
    let filtered = dealers

    if (selectedState !== 'all') {
      filtered = filtered.filter(dealer => dealer.state === selectedState)
    }

    if (searchTerm) {
      filtered = filtered.filter(dealer =>
        dealer.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDealers(filtered)
  }

  const handleMessageDealer = (dealer) => {
    if (!user) {
      alert('Please sign in to message dealers')
      return
    }
    setSelectedDealer(dealer)
    setShowMessageModal(true)
  }

  const states = [...new Set(dealers.map(dealer => dealer.state))].sort()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dealers...</p>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold mb-4">Authorized Dealers</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find certified mobile home dealers in your area
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
            <h2 className="text-lg font-semibold">Find Dealers</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by business name or city..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Dealers Grid */}
        {filteredDealers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDealers.map((dealer, index) => (
              <motion.div
                key={dealer.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <SafeIcon icon={FiTruck} className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{dealer.business_name}</h3>
                        <p className="text-gray-400 text-sm">{dealer.contact_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <SafeIcon icon={FiMapPin} />
                      <span>{dealer.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <SafeIcon icon={FiMapPin} />
                      <span>{dealer.city}, {dealer.state} {dealer.zip}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <SafeIcon icon={FiPhone} />
                      <a
                        href={`tel:${dealer.phone}`}
                        className="hover:text-orange-400 transition-colors"
                      >
                        {dealer.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <SafeIcon icon={FiMail} />
                      <a
                        href={`mailto:${dealer.email}`}
                        className="hover:text-orange-400 transition-colors"
                      >
                        {dealer.email}
                      </a>
                    </div>
                    {dealer.website && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <SafeIcon icon={FiExternalLink} />
                        <a
                          href={dealer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange-400 transition-colors"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {dealer.description && (
                    <p className="text-sm text-gray-300 mb-4">
                      {dealer.description}
                    </p>
                  )}

                  {dealer.license_number && (
                    <div className="text-xs text-gray-500 mb-4">
                      License: {dealer.license_number}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${dealer.phone}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors"
                    >
                      Call Now
                    </a>
                    <button
                      onClick={() => handleMessageDealer(dealer)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm text-center transition-colors flex items-center justify-center space-x-1"
                    >
                      <SafeIcon icon={FiMessageSquare} className="text-sm" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiTruck} className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              No dealers found matching your criteria.
            </p>
            <p className="text-gray-500">
              Try adjusting your search filters or contact us to find dealers in your area.
            </p>
          </div>
        )}
      </div>

      {/* Message Dealer Modal */}
      {showMessageModal && selectedDealer && (
        <MessageDealerModal
          dealer={selectedDealer}
          user={user}
          onClose={() => {
            setShowMessageModal(false)
            setSelectedDealer(null)
          }}
        />
      )}
    </div>
  )
}

export default DealerDirectory