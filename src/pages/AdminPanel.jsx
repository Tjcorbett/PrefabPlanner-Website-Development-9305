import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import LogoUpload from '../components/admin/LogoUpload'
import { useTheme } from '../contexts/ThemeContext'
import {
  getUsers, createUser, updateUser, deleteUser,
  getPages, createPage, updatePage, deletePage,
  getDealers, createDealer, updateDealer, deleteDealer,
  getSettings, updateSettings, getAnalytics,
  getFeedbackReviews, updateFeedbackStatus,
  getSupportTickets, updateSupportTicket,
  getFeatureFlags, updateFeatureFlag,
  getSystemLogs, getNewsletterSubscriptions,
  getEmailCampaigns, createEmailCampaign
} from '../services/adminService'

const {
  FiUsers, FiFileText, FiSettings, FiBarChart3, FiPlus, FiEdit3, FiTrash2,
  FiSave, FiUpload, FiDownload, FiEye, FiX, FiCheck, FiLoader, FiTruck,
  FiMail, FiPhone, FiMapPin, FiGlobe, FiMessageSquare, FiInbox, FiStar,
  FiFlag, FiActivity, FiHeart, FiLifeBuoy, FiTool, FiDatabase, FiShield,
  FiZap, FiBell, FiCalendar, FiTrendingUp, FiPieChart
} = FiIcons

const AdminPanel = () => {
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
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
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: '', siteDescription: '', contactEmail: '', supportEmail: '',
    smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '', logoUrl: ''
  })

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FiBarChart3 },
    { id: 'analytics', name: 'Analytics', icon: FiTrendingUp },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'dealers', name: 'Dealers', icon: FiTruck },
    { id: 'pages', name: 'Pages', icon: FiFileText },
    { id: 'inbox', name: 'Messages', icon: FiInbox },
    { id: 'feedback', name: 'Feedback', icon: FiHeart },
    { id: 'support', name: 'Support', icon: FiLifeBuoy },
    { id: 'features', name: 'Features', icon: FiFlag },
    { id: 'newsletter', name: 'Newsletter', icon: FiBell },
    { id: 'campaigns', name: 'Campaigns', icon: FiMail },
    { id: 'logs', name: 'System Logs', icon: FiActivity },
    { id: 'maintenance', name: 'Maintenance', icon: FiTool },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ]

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
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
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  // Enhanced Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
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

        <motion.div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
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

        <motion.div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
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

        <motion.div className={`p-6 rounded-lg border transition-colors duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
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
    </div>
  )

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
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <SafeIcon icon={FiLoader} className="animate-spin text-2xl text-orange-400" />
                </div>
              )}

              {!loading && activeTab === 'dashboard' && renderDashboard()}
              {!loading && activeTab === 'settings' && renderSettings()}
              
              {/* Placeholder for other tabs */}
              {!loading && !['dashboard', 'settings'].includes(activeTab) && (
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
      </div>
    </div>
  )
}

export default AdminPanel