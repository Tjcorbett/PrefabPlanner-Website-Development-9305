import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import LogoUpload from '../components/admin/LogoUpload'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import {
  getUsers, createUser, updateUser, deleteUser,
  getPages, createPage, updatePage, deletePage,
  getDealers, createDealer, updateDealer, deleteDealer,
  getSettings, updateSettings,
  getAnalytics,
  getFeedbackReviews, updateFeedbackStatus,
  getSupportTickets, updateSupportTicket, createSupportTicket,
  getFeatureFlags, updateFeatureFlag,
  getSystemLogs,
  getNewsletterSubscriptions, subscribeToNewsletter,
  getEmailCampaigns, createEmailCampaign
} from '../services/adminService'

const {
  FiUsers, FiFileText, FiSettings, FiBarChart3, FiPlus, FiEdit3, FiTrash2,
  FiSave, FiUpload, FiDownload, FiEye, FiX, FiCheck, FiLoader, FiTruck,
  FiMail, FiPhone, FiMapPin, FiGlobe, FiMessageSquare, FiInbox, FiStar,
  FiFlag, FiActivity, FiHeart, FiLifeBuoy, FiTool, FiDatabase, FiShield,
  FiZap, FiBell, FiCalendar, FiTrendingUp, FiPieChart, FiSearch, FiFilter
} = FiIcons

const AdminPanel = () => {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Data states
  const [users, setUsers] = useState([])
  const [pages, setPages] = useState([])
  const [dealers, setDealers] = useState([])
  const [settings, setSettings] = useState({})
  const [analytics, setAnalytics] = useState({})
  const [feedback, setFeedback] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [featureFlags, setFeatureFlags] = useState([])
  const [systemLogs, setSystemLogs] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [emailCampaigns, setEmailCampaigns] = useState([])

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    supportEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    logoUrl: ''
  })

  // User form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  })

  // Dealer form
  const [dealerForm, setDealerForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    website: '',
    licenseNumber: '',
    specialties: [],
    description: '',
    status: 'pending'
  })

  // Page form
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft'
  })

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FiBarChart3 },
    { id: 'analytics', name: 'Analytics', icon: FiTrendingUp },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'dealers', name: 'Dealers', icon: FiTruck },
    { id: 'pages', name: 'Pages', icon: FiFileText },
    { id: 'feedback', name: 'Feedback', icon: FiHeart },
    { id: 'support', name: 'Support', icon: FiLifeBuoy },
    { id: 'features', name: 'Features', icon: FiFlag },
    { id: 'newsletter', name: 'Newsletter', icon: FiBell },
    { id: 'campaigns', name: 'Campaigns', icon: FiMail },
    { id: 'logs', name: 'System Logs', icon: FiActivity },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ]

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      switch (activeTab) {
        case 'dashboard':
        case 'analytics':
          const analyticsResult = await getAnalytics()
          if (analyticsResult.data) setAnalytics(analyticsResult.data)
          break
        case 'users':
          const usersResult = await getUsers()
          if (usersResult.data) setUsers(usersResult.data)
          break
        case 'pages':
          const pagesResult = await getPages()
          if (pagesResult.data) setPages(pagesResult.data)
          break
        case 'dealers':
          const dealersResult = await getDealers()
          if (dealersResult.data) setDealers(dealersResult.data)
          break
        case 'feedback':
          const feedbackResult = await getFeedbackReviews()
          if (feedbackResult.data) setFeedback(feedbackResult.data)
          break
        case 'support':
          const ticketsResult = await getSupportTickets()
          if (ticketsResult.data) setSupportTickets(ticketsResult.data)
          break
        case 'features':
          const flagsResult = await getFeatureFlags()
          if (flagsResult.data) setFeatureFlags(flagsResult.data)
          break
        case 'newsletter':
          const newsletterResult = await getNewsletterSubscriptions()
          if (newsletterResult.data) setNewsletters(newsletterResult.data)
          break
        case 'campaigns':
          const campaignsResult = await getEmailCampaigns()
          if (campaignsResult.data) setEmailCampaigns(campaignsResult.data)
          break
        case 'logs':
          const logsResult = await getSystemLogs(50)
          if (logsResult.data) setSystemLogs(logsResult.data)
          break
        case 'settings':
          const settingsResult = await getSettings()
          if (settingsResult.data && settingsResult.data.length > 0) {
            const settings = settingsResult.data[0]
            setSettingsForm({
              siteTitle: settings.site_title || '',
              siteDescription: settings.site_description || '',
              contactEmail: settings.contact_email || '',
              supportEmail: settings.support_email || '',
              smtpHost: settings.smtp_host || '',
              smtpPort: settings.smtp_port || '',
              smtpUser: settings.smtp_user || '',
              smtpPass: settings.smtp_pass || '',
              logoUrl: settings.logo_url || ''
            })
          }
          break
      }
    } catch (error) {
      setError(error.message)
      console.error('Error loading data:', error)
    }
    
    setLoading(false)
  }

  // User management functions
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await createUser(userForm)
      if (result.data) {
        setUsers([result.data, ...users])
        setShowCreateModal(false)
        resetUserForm()
        alert('User created successfully!')
      } else {
        alert('Error creating user: ' + result.error)
      }
    } catch (error) {
      alert('Error creating user: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleUpdateUser = async (id, userData) => {
    setLoading(true)
    
    try {
      const result = await updateUser(id, userData)
      if (result.data) {
        setUsers(users.map(user => user.id === id ? result.data : user))
        setEditingItem(null)
        alert('User updated successfully!')
      } else {
        alert('Error updating user: ' + result.error)
      }
    } catch (error) {
      alert('Error updating user: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    setLoading(true)
    
    try {
      const result = await deleteUser(id)
      if (!result.error) {
        setUsers(users.filter(user => user.id !== id))
        alert('User deleted successfully!')
      } else {
        alert('Error deleting user: ' + result.error)
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message)
    }
    
    setLoading(false)
  }

  // Dealer management functions
  const handleCreateDealer = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await createDealer(dealerForm)
      if (result.data) {
        setDealers([result.data, ...dealers])
        setShowCreateModal(false)
        resetDealerForm()
        alert('Dealer created successfully!')
      } else {
        alert('Error creating dealer: ' + result.error)
      }
    } catch (error) {
      alert('Error creating dealer: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleUpdateDealer = async (id, dealerData) => {
    setLoading(true)
    
    try {
      const result = await updateDealer(id, dealerData)
      if (result.data) {
        setDealers(dealers.map(dealer => dealer.id === id ? result.data : dealer))
        setEditingItem(null)
        alert('Dealer updated successfully!')
      } else {
        alert('Error updating dealer: ' + result.error)
      }
    } catch (error) {
      alert('Error updating dealer: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleDeleteDealer = async (id) => {
    if (!confirm('Are you sure you want to delete this dealer?')) return
    
    setLoading(true)
    
    try {
      const result = await deleteDealer(id)
      if (!result.error) {
        setDealers(dealers.filter(dealer => dealer.id !== id))
        alert('Dealer deleted successfully!')
      } else {
        alert('Error deleting dealer: ' + result.error)
      }
    } catch (error) {
      alert('Error deleting dealer: ' + error.message)
    }
    
    setLoading(false)
  }

  // Support ticket functions
  const handleUpdateTicket = async (id, status, response = null) => {
    setLoading(true)
    
    try {
      const updateData = { status }
      if (response) {
        updateData.admin_response = response
        updateData.responded_at = new Date().toISOString()
      }
      
      const result = await updateSupportTicket(id, updateData)
      if (result.data) {
        setSupportTickets(supportTickets.map(ticket => 
          ticket.id === id ? result.data : ticket
        ))
        alert('Ticket updated successfully!')
      } else {
        alert('Error updating ticket: ' + result.error)
      }
    } catch (error) {
      alert('Error updating ticket: ' + error.message)
    }
    
    setLoading(false)
  }

  // Helper functions
  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    })
  }

  const resetDealerForm = () => {
    setDealerForm({
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      website: '',
      licenseNumber: '',
      specialties: [],
      description: '',
      status: 'pending'
    })
  }

  const filteredData = (data) => {
    if (!searchTerm) return data
    return data.filter(item => 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Check admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <SafeIcon icon={FiShield} className={`text-6xl mx-auto mb-4 transition-colors duration-300 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Access Denied</h2>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>You need administrator privileges to access this panel.</p>
        </div>
      </div>
    )
  }

  // Enhanced Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Users</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{analytics.users?.total || 0}</p>
              <p className="text-sm text-green-400">+12% this month</p>
            </div>
            <SafeIcon icon={FiUsers} className="text-3xl text-blue-400" />
          </div>
        </motion.div>

        <motion.div 
          className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Active Dealers</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{analytics.dealers?.active || 0}</p>
              <p className="text-sm text-orange-400">{analytics.dealers?.pending || 0} pending</p>
            </div>
            <SafeIcon icon={FiTruck} className="text-3xl text-green-400" />
          </div>
        </motion.div>

        <motion.div 
          className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Support Tickets</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{analytics.support?.total || 0}</p>
              <p className="text-sm text-red-400">{analytics.support?.urgent || 0} urgent</p>
            </div>
            <SafeIcon icon={FiLifeBuoy} className="text-3xl text-purple-400" />
          </div>
        </motion.div>

        <motion.div 
          className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Avg Rating</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{analytics.feedback?.avgRating || 0}/5</p>
              <p className="text-sm text-yellow-400">{analytics.feedback?.total || 0} reviews</p>
            </div>
            <SafeIcon icon={FiStar} className="text-3xl text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-white text-sm" />
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{user.name}</p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Database</span>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Email Service</span>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>File Storage</span>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>API Services</span>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Users Management
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Users Management</h2>
        <button
          onClick={() => {
            resetUserForm()
            setShowCreateModal(true)
          }}
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add User</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SafeIcon icon={FiSearch} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 border-gray-700 focus:border-orange-500 text-white' 
              : 'bg-white border-gray-300 focus:border-orange-500 text-gray-900'
          }`}
        />
      </div>

      {/* Users Table */}
      <div className={`overflow-x-auto rounded-lg border transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <table className="w-full">
          <thead className={`transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>User</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Role</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Status</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Created</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${
            isDark ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'
          }`}>
            {filteredData(users).map((user) => (
              <tr key={user.id} className={`transition-colors duration-300 ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="text-white" />
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{user.name}</div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : user.role === 'dealer'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(user)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <SafeIcon icon={FiEdit3} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Support Tickets
  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Support Tickets</h2>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {supportTickets.map((ticket) => (
          <div key={ticket.id} className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{ticket.subject}</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  From: {ticket.user_name} ({ticket.user_email})
                </p>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Ticket: {ticket.ticket_number}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  ticket.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            
            <p className={`mb-4 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>{ticket.description}</p>
            
            <div className="flex space-x-2">
              {ticket.status === 'open' && (
                <button
                  onClick={() => handleUpdateTicket(ticket.id, 'in_progress')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Start Progress
                </button>
              )}
              {ticket.status !== 'closed' && (
                <button
                  onClick={() => handleUpdateTicket(ticket.id, 'closed', 'Thank you for your inquiry. This has been resolved.')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Settings Management
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Settings</h2>
      
      {/* Logo Upload Section */}
      <LogoUpload onLogoUpdate={(logoUrl) => setSettingsForm(prev => ({ ...prev, logoUrl }))} />
      
      <form onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          await updateSettings(settingsForm)
          alert('Settings updated successfully!')
        } catch (error) {
          console.error('Error updating settings:', error)
        }
        setLoading(false)
      }} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Site Settings</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Site Title</label>
                <input
                  type="text"
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Site Description</label>
                <textarea
                  value={settingsForm.siteDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Contact Settings</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Support Email</label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <SafeIcon icon={FiLoader} className="animate-spin" /> : <SafeIcon icon={FiSave} />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className={`min-h-screen py-12 px-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Admin Panel</h1>
          <p className={`text-xl transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Comprehensive platform management dashboard
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:w-64">
            <div className={`rounded-lg border p-4 transition-colors duration-300 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className={`rounded-lg border p-6 transition-colors duration-300 ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {error && (
                <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
                  <p>Error: {error}</p>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <SafeIcon icon={FiLoader} className="animate-spin text-2xl text-orange-400" />
                </div>
              )}

              {!loading && activeTab === 'dashboard' && renderDashboard()}
              {!loading && activeTab === 'users' && renderUsers()}
              {!loading && activeTab === 'support' && renderSupport()}
              {!loading && activeTab === 'settings' && renderSettings()}
              
              {/* Placeholder for other tabs */}
              {!loading && !['dashboard', 'users', 'support', 'settings'].includes(activeTab) && (
                <div className="text-center py-8">
                  <SafeIcon icon={FiZap} className={`text-6xl mx-auto mb-4 transition-colors duration-300 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{tabs.find(t => t.id === activeTab)?.name}</h3>
                  <p className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>This section is under development</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && activeTab === 'users' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div 
              className={`rounded-lg p-6 w-full max-w-2xl mx-4 border max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Create New User</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Name</label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 focus:border-orange-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-orange-500 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Email</label>
                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 focus:border-orange-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-orange-500 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 focus:border-orange-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-orange-500 text-gray-900'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="dealer">Dealer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Status</label>
                    <select
                      value={userForm.status}
                      onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 focus:border-orange-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-orange-500 text-gray-900'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel