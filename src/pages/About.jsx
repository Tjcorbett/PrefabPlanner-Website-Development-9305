import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const { FiMapPin, FiPhone, FiMail, FiClock } = FiIcons

const About = () => {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">About PrefabPlanner</h1>
          <p className="text-xl text-gray-300">
            Professional mobile home design solutions for Live Oak, Florida
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-300 mb-4">
              Founded in Live Oak, Florida, PrefabPlanner emerged from a need for professional, 
              easy-to-use design tools specifically tailored for the mobile home industry. Our team 
              combines decades of experience in construction, design, and technology to deliver 
              cutting-edge solutions.
            </p>
            <p className="text-gray-300">
              We understand the unique challenges and opportunities in mobile home design, from space 
              optimization to regulatory compliance. Our platform empowers builders, designers, and 
              homeowners to create beautiful, functional living spaces.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Industry-specific tools designed for mobile home construction</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Local expertise in Florida building codes and regulations</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Professional-grade 2D visualization tools</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Pre-built templates for common mobile home sizes</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Extensive furniture and fixture library</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="bg-gray-800 p-8 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMapPin} className="text-orange-400 text-xl" />
                <div>
                  <div className="font-semibold">Location</div>
                  <div className="text-gray-300">Live Oak, FL 32064</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="text-orange-400 text-xl" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-gray-300">(386) 555-0123</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="text-orange-400 text-xl" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-300">info@prefabplanner.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiClock} className="text-orange-400 text-xl" />
                <div>
                  <div className="font-semibold">Business Hours</div>
                  <div className="text-gray-300">Mon-Fri: 8AM-6PM EST</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About