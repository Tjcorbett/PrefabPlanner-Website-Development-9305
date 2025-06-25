import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'
import { 
  getMessages, 
  sendMessage, 
  markMessageAsRead, 
  deleteMessage,
  uploadFile,
  getDealersForMessaging,
  searchMessages 
} from '../../services/inboxService'

const { 
  FiMail, FiSend, FiPaperclip, FiTrash2, FiReply, FiSearch, 
  FiFilter, FiUser, FiClock, FiAlertCircle, FiDownload, FiX,
  FiPlus, FiEdit3, FiEye, FiArchive, FiFolderOpen, FiImage,
  FiFileText, FiFile
} = FiIcons

const InboxSystem = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [dealers, setDealers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const fileInputRef = useRef(null)

  const [composeForm, setComposeForm] = useState({
    recipientId: '',
    recipientName: '',
    recipientEmail: '',
    recipientType: 'dealer',
    subject: '',
    message: '',
    priority: 'normal',
    attachments: []
  })

  useEffect(() => {
    if (user) {
      loadMessages()
      loadDealers()
    }
  }, [user])

  useEffect(() => {
    if (searchTerm || filterStatus !== 'all' || filterPriority !== 'all') {
      handleSearch()
    } else if (user) {
      loadMessages()
    }
  }, [searchTerm, filterStatus, filterPriority, user])

  const loadMessages = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const result = await getMessages(user.id, user.role || 'user')
      if (result.data) {
        setMessages(result.data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
    setLoading(false)
  }

  const loadDealers = async () => {
    try {
      const result = await getDealersForMessaging()
      if (result.data) {
        setDealers(result.data)
      }
    } catch (error) {
      console.error('Error loading dealers:', error)
    }
  }

  const handleSearch = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const filters = {}
      if (filterStatus !== 'all') filters.status = filterStatus
      if (filterPriority !== 'all') filters.priority = filterPriority
      
      const result = await searchMessages(user.id, searchTerm, filters)
      if (result.data) {
        setMessages(result.data)
      }
    } catch (error) {
      console.error('Error searching messages:', error)
    }
    setLoading(false)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderType: user.role || 'user',
        recipientId: composeForm.recipientId,
        recipientName: composeForm.recipientName,
        recipientEmail: composeForm.recipientEmail,
        recipientType: composeForm.recipientType,
        subject: composeForm.subject,
        message: composeForm.message,
        priority: composeForm.priority,
        messageType: 'direct'
      }

      const result = await sendMessage(messageData)
      if (result.data) {
        // Handle file uploads if any
        if (composeForm.attachments.length > 0) {
          for (const file of composeForm.attachments) {
            await uploadFile(file, result.data.id, user.id)
          }
        }

        setShowCompose(false)
        resetComposeForm()
        loadMessages()
        alert('Message sent successfully!')
      } else {
        alert('Error sending message: ' + result.error)
      }
    } catch (error) {
      alert('Error sending message: ' + error.message)
    }
    setLoading(false)
  }

  const handleReply = (message) => {
    setComposeForm({
      recipientId: message.sender_id,
      recipientName: message.sender_name,
      recipientEmail: message.sender_email,
      recipientType: message.sender_type,
      subject: message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`,
      message: `\n\n--- Original Message ---\nFrom: ${message.sender_name}\nDate: ${new Date(message.created_at).toLocaleString()}\nSubject: ${message.subject}\n\n${message.message}`,
      priority: 'normal',
      attachments: []
    })
    setShowCompose(true)
  }

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId)
      loadMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const result = await deleteMessage(messageId)
      if (!result.error) {
        setSelectedMessage(null)
        loadMessages()
        alert('Message deleted successfully!')
      } else {
        alert('Error deleting message: ' + result.error)
      }
    } catch (error) {
      alert('Error deleting message: ' + error.message)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setComposeForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index) => {
    setComposeForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const resetComposeForm = () => {
    setComposeForm({
      recipientId: '',
      recipientName: '',
      recipientEmail: '',
      recipientType: 'dealer',
      subject: '',
      message: '',
      priority: 'normal',
      attachments: []
    })
  }

  const handleRecipientSelect = (e) => {
    const selectedId = e.target.value
    if (selectedId) {
      const dealer = dealers.find(d => d.id === selectedId)
      if (dealer) {
        setComposeForm(prev => ({
          ...prev,
          recipientId: dealer.id,
          recipientName: dealer.business_name,
          recipientEmail: dealer.email,
          recipientType: 'dealer'
        }))
      }
    } else {
      setComposeForm(prev => ({
        ...prev,
        recipientId: '',
        recipientName: '',
        recipientEmail: '',
        recipientType: 'dealer'
      }))
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'normal': return 'text-gray-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiMail} className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Please sign in to access your inbox</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Inbox</h1>
          <p className="text-xl text-gray-300">
            Communicate with dealers and support team
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 h-[800px]">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
            {/* Search and Controls */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                  />
                </div>
                <button
                  onClick={() => setShowCompose(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Compose"
                >
                  <SafeIcon icon={FiPlus} />
                </button>
              </div>

              <div className="flex space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-2 p-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'border-orange-500 bg-orange-500/10'
                          : message.status === 'unread'
                          ? 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (message.status === 'unread') {
                          handleMarkAsRead(message.id)
                        }
                      }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            message.status === 'unread' ? 'text-white' : 'text-gray-300'
                          }`}>
                            {message.sender_id === user.id ? `To: ${message.recipient_name}` : message.sender_name}
                          </p>
                          <p className="text-sm text-gray-400 truncate">{message.subject}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <SafeIcon 
                            icon={FiAlertCircle} 
                            className={`text-sm ${getPriorityColor(message.priority)}`}
                          />
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{message.message}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center mt-2">
                          <SafeIcon icon={FiPaperclip} className="text-gray-400 text-xs mr-1" />
                          <span className="text-xs text-gray-400">{message.attachments.length} attachment(s)</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <SafeIcon icon={FiFolderOpen} className="text-6xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No messages found</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>From: {selectedMessage.sender_name} ({selectedMessage.sender_email})</span>
                        <span>•</span>
                        <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                        <span>•</span>
                        <span className={getPriorityColor(selectedMessage.priority)}>
                          {selectedMessage.priority.toUpperCase()} Priority
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReply(selectedMessage)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                        title="Reply"
                      >
                        <SafeIcon icon={FiReply} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300">{selectedMessage.message}</div>
                  </div>

                  {/* Attachments */}
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-3">Attachments ({selectedMessage.attachments.length})</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <SafeIcon 
                                icon={getFileIcon(attachment.file_type)} 
                                className="text-orange-400 text-xl"
                              />
                              <div>
                                <p className="text-white font-medium">{attachment.file_name}</p>
                                <p className="text-gray-400 text-sm">
                                  {formatFileSize(attachment.file_size)} • {attachment.file_type}
                                </p>
                              </div>
                            </div>
                            <a
                              href={attachment.file_url}
                              download={attachment.file_name}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition-colors"
                              title="Download"
                            >
                              <SafeIcon icon={FiDownload} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiMail} className="text-6xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Select a message to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Compose Message</h3>
                <button
                  onClick={() => {
                    setShowCompose(false)
                    resetComposeForm()
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">To (Dealer)</label>
                    <select
                      required
                      value={composeForm.recipientId}
                      onChange={handleRecipientSelect}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    >
                      <option value="">Select a dealer...</option>
                      {dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>
                          {dealer.business_name} - {dealer.city}, {dealer.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={composeForm.priority}
                      onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value })}
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
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    placeholder="Message subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    value={composeForm.message}
                    onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    rows="6"
                    placeholder="Type your message here..."
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Attachments</label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <SafeIcon icon={FiPaperclip} className="mr-1" />
                      Add Files
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
                  
                  {composeForm.attachments.length > 0 && (
                    <div className="space-y-2 p-3 bg-gray-700 rounded-lg">
                      {composeForm.attachments.map((file, index) => (
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
                    onClick={() => {
                      setShowCompose(false)
                      resetComposeForm()
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InboxSystem