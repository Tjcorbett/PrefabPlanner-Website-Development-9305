import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTheme } from '../contexts/ThemeContext'

const { FiSend, FiUser, FiMail, FiPhone, FiMessageSquare } = FiIcons

const Contact = () => {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className={`min-h-screen py-12 px-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Get In Touch</h1>
          <p className={`text-xl transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Ready to start your mobile home design project? We're here to help!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <SafeIcon icon={FiUser} />
                    <span>Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 focus:border-orange-500 text-white' 
                        : 'bg-white border-gray-300 focus:border-orange-500 text-gray-900'
                    }`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <SafeIcon icon={FiMail} />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 focus:border-orange-500 text-white' 
                        : 'bg-white border-gray-300 focus:border-orange-500 text-gray-900'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <SafeIcon icon={FiPhone} />
                    <span>Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 focus:border-orange-500 text-white' 
                        : 'bg-white border-gray-300 focus:border-orange-500 text-gray-900'
                    }`}
                    placeholder="(386) 555-0123"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 focus:border-orange-500 text-white' 
                        : 'bg-white border-gray-300 focus:border-orange-500 text-gray-900'
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="design">Design Consultation</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <SafeIcon icon={FiMessageSquare} />
                  <span>Message</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none resize-none transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 focus:border-orange-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-orange-500 text-gray-900'
                  }`}
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiSend} />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Why Work With Us?</h2>
            <div className="space-y-6">
              <div className={`p-6 rounded-lg border transition-colors duration-300 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Expert Consultation</h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Our team provides personalized guidance to help you create the perfect mobile home 
                  design that meets your needs and budget.
                </p>
              </div>

              <div className={`p-6 rounded-lg border transition-colors duration-300 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Local Knowledge</h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Based in Live Oak, FL, we understand local building codes, climate considerations, 
                  and market preferences for mobile homes.
                </p>
              </div>

              <div className={`p-6 rounded-lg border transition-colors duration-300 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Fast Response</h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  We typically respond to inquiries within 24 hours and offer flexible scheduling 
                  for consultations and project discussions.
                </p>
              </div>

              <div className={`p-6 rounded-lg border transition-colors duration-300 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Ongoing Support</h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  From initial design through construction completion, we provide continuous support 
                  to ensure your project's success.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact