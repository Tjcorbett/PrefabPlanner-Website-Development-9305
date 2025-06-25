import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { sendMessage, uploadFile } from '../../services/inboxService'

const { FiX, FiSend, FiPaperclip, FiImage, FiFileText, FiFile } = FiIcons

const MessageDealerModal = ({ dealer, user, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    attachments: []
  })
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !dealer) return

    setLoading(true)
    try {
      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderType: user.role || 'user',
        recipientId: dealer.id,
        recipientName: dealer.business_name,
        recipientEmail: dealer.email,
        recipientType: 'dealer',
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        messageType: 'inquiry'
      }

      const result = await sendMessage(messageData)
      if (result.data) {
        // Handle file uploads if any
        if (formData.attachments.length > 0) {
          for (const file of formData.attachments) {
            await uploadFile(file, result.data.id, user.id)
          }
        }

        alert('Message sent successfully!')
        onClose()
      } else {
        alert('Error sending message: ' + result.error)
      }
    } catch (error) {
      alert('Error sending message: ' + error.message)
    }
    setLoading(false)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return FiImage
    if (fileType.includes('pdf') || fileType.includes('document')) return FiFileText
    return FiFile
  }

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Message Dealer</h3>
            <p className="text-gray-400">{dealer.business_name} - {dealer.city}, {dealer.state}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                placeholder="Inquiry about mobile homes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              rows="6"
              placeholder="Hello, I'm interested in learning more about your mobile homes. Could you please provide information about..."
            />
          </div>

          {/* File Attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Attachments (Optional)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
              >
                <SafeIcon icon={FiPaperclip} />
                <span>Add Files</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
            />
            
            {formData.attachments.length > 0 && (
              <div className="space-y-2 p-3 bg-gray-700 rounded-lg">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={getFileIcon(file.type)} className="text-orange-400" />
                      <span className="text-sm text-white">{file.name}</span>
                      <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <SafeIcon icon={FiX} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              You can attach floor plans, photos, or documents to help describe your needs
            </p>
          </div>

          {/* Contact Info Display */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Dealer Contact Information</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Business: {dealer.business_name}</p>
              <p>Contact: {dealer.contact_name}</p>
              <p>Phone: {dealer.phone}</p>
              <p>Email: {dealer.email}</p>
              <p>Location: {dealer.city}, {dealer.state}</p>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSend} />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default MessageDealerModal