import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile, updateUserProfile, uploadProfileAvatar } from '../services/userService'

const {
  FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase, FiSettings,
  FiCamera, FiSave, FiEdit3, FiEye, FiEyeOff, FiBell, FiShield, FiMonitor
} = FiIcons

const UserProfile = () => {
  const { user, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const avatarInputRef = useRef(null)

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    website: '',
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    privacy_level: 'public',
    timezone: 'America/New_York',
    language: 'en',
    theme: 'dark'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy', icon: FiShield }
  ]

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ]

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const result = await getUserProfile(user.id)
      if (result.data) {
        setProfile(result.data)
        setFormData({
          display_name: result.data.display_name || user.name || '',
          bio: result.data.bio || '',
          phone: result.data.phone || '',
          company: result.data.company || '',
          address: result.data.address || '',
          city: result.data.city || '',
          state: result.data.state || '',
          zip: result.data.zip || '',
          website: result.data.website || '',
          email_notifications: result.data.email_notifications !== false,
          sms_notifications: result.data.sms_notifications || false,
          marketing_emails: result.data.marketing_emails !== false,
          privacy_level: result.data.privacy_level || 'public',
          timezone: result.data.timezone || 'America/New_York',
          language: result.data.language || 'en',
          theme: result.data.theme || 'dark'
        })
      } else {
        // Create default profile
        setFormData(prev => ({ ...prev, display_name: user.name || '' }))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const profileData = {
        user_id: user.id,
        ...formData
      }

      const result = await updateUserProfile(user.id, profileData)
      if (result.data) {
        setProfile(result.data)
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        alert('Error updating profile: ' + result.error)
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message)
    }
    setSaving(false)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const result = await uploadProfileAvatar(user.id, file)
      if (result.data) {
        // Update user context with new avatar
        const updatedUser = { ...user, avatar: result.data.avatar_url }
        login(updatedUser)
        alert('Avatar updated successfully!')
      } else {
        alert('Error uploading avatar: ' + result.error)
      }
    } catch (error) {
      alert('Error uploading avatar: ' + error.message)
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
          />
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-colors"
          >
            <SafeIcon icon={FiCamera} />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{formData.display_name || user?.name}</h2>
          <p className="text-gray-400">{user?.email}</p>
          <p className="text-sm text-orange-400 capitalize">{user?.role || 'user'} account</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
            placeholder="https://"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
            rows="3"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
            placeholder="123 Main St"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code</label>
          <input
            type="text"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          >
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-gray-400">Receive updates via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.email_notifications}
              onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
              disabled={!isEditing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium">SMS Notifications</h4>
            <p className="text-sm text-gray-400">Receive updates via text message</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.sms_notifications}
              onChange={(e) => setFormData({ ...formData, sms_notifications: e.target.checked })}
              disabled={!isEditing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium">Marketing Emails</h4>
            <p className="text-sm text-gray-400">Receive promotional content and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketing_emails}
              onChange={(e) => setFormData({ ...formData, marketing_emails: e.target.checked })}
              disabled={!isEditing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Profile Visibility</label>
        <select
          value={formData.privacy_level}
          onChange={(e) => setFormData({ ...formData, privacy_level: e.target.value })}
          disabled={!isEditing}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white disabled:opacity-50"
        >
          <option value="public">Public - Visible to all users</option>
          <option value="private">Private - Only visible to you</option>
          <option value="dealers">Dealers Only - Visible to dealers</option>
        </select>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Data & Privacy</h4>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Your personal information is encrypted and secure</p>
          <p>• We never share your data with third parties without consent</p>
          <p>• You can request data deletion at any time</p>
          <p>• Messages with dealers are private and confidential</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Profile Settings</h1>
          <p className="text-xl text-gray-300">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <SafeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-700 p-6 bg-gray-750">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
              </div>
              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        loadProfile() // Reset form
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <SafeIcon icon={FiSave} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile