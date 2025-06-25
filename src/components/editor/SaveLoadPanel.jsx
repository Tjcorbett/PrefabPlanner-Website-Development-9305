import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'
import { saveFloorplan, getFloorplans, updateFloorplan, deleteFloorplan } from '../../services/adminService'

const { FiSave, FiFolderOpen, FiTrash2, FiEye, FiEyeOff, FiPlus, FiEdit3, FiX } = FiIcons

const SaveLoadPanel = ({ canvasData, onLoadDesign, onClose }) => {
  const { user } = useAuth()
  const [savedDesigns, setSavedDesigns] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingDesign, setEditingDesign] = useState(null)
  const [saveForm, setSaveForm] = useState({
    title: '',
    description: '',
    isPublic: false
  })

  useEffect(() => {
    loadSavedDesigns()
  }, [user])

  const loadSavedDesigns = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const result = await getFloorplans(user.id)
      if (result.data) {
        setSavedDesigns(result.data)
      }
    } catch (error) {
      console.error('Error loading designs:', error)
    }
    setLoading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user || !canvasData) return

    setLoading(true)
    try {
      const floorplanData = {
        userId: user.id,
        title: saveForm.title,
        description: saveForm.description,
        canvasData: canvasData,
        isPublic: saveForm.isPublic,
        templateName: saveForm.title.toLowerCase().replace(/\s+/g, '-')
      }

      let result
      if (editingDesign) {
        result = await updateFloorplan(editingDesign.id, floorplanData)
      } else {
        result = await saveFloorplan(floorplanData)
      }

      if (result.data) {
        setShowSaveModal(false)
        setEditingDesign(null)
        setSaveForm({ title: '', description: '', isPublic: false })
        loadSavedDesigns()
        alert(editingDesign ? 'Design updated successfully!' : 'Design saved successfully!')
      } else {
        alert('Error saving design: ' + result.error)
      }
    } catch (error) {
      alert('Error saving design: ' + error.message)
    }
    setLoading(false)
  }

  const handleLoad = (design) => {
    if (onLoadDesign && design.canvas_data) {
      onLoadDesign(design.canvas_data)
      onClose()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this design?')) return

    setLoading(true)
    try {
      const result = await deleteFloorplan(id)
      if (!result.error) {
        loadSavedDesigns()
        alert('Design deleted successfully!')
      } else {
        alert('Error deleting design: ' + result.error)
      }
    } catch (error) {
      alert('Error deleting design: ' + error.message)
    }
    setLoading(false)
  }

  const openSaveModal = (design = null) => {
    if (design) {
      setEditingDesign(design)
      setSaveForm({
        title: design.title,
        description: design.description || '',
        isPublic: design.is_public || false
      })
    } else {
      setEditingDesign(null)
      setSaveForm({ title: '', description: '', isPublic: false })
    }
    setShowSaveModal(true)
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 mb-4">Please sign in to save and load designs</p>
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">My Designs</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => openSaveModal()}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiSave} />
              <span>Save Current</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SafeIcon icon={FiX} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading designs...</p>
          </div>
        ) : savedDesigns.length > 0 ? (
          <div className="space-y-4">
            {savedDesigns.map((design) => (
              <motion.div
                key={design.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{design.title}</h4>
                    {design.description && (
                      <p className="text-sm text-gray-400 mt-1">{design.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {design.is_public ? (
                      <SafeIcon icon={FiEye} className="text-green-400" title="Public" />
                    ) : (
                      <SafeIcon icon={FiEyeOff} className="text-gray-400" title="Private" />
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  Created: {new Date(design.created_at).toLocaleDateString()}
                  {design.updated_at !== design.created_at && (
                    <span> • Updated: {new Date(design.updated_at).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoad(design)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => openSaveModal(design)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} />
                  </button>
                  <button
                    onClick={() => handleDelete(design.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiFolderOpen} className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No saved designs yet</p>
            <p className="text-gray-500 text-sm">Create and save your first floorplan design!</p>
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold mb-4">
              {editingDesign ? 'Update Design' : 'Save Design'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={saveForm.title}
                  onChange={(e) => setSaveForm({ ...saveForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                  placeholder="My Floorplan Design"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                  rows="3"
                  placeholder="Optional description..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={saveForm.isPublic}
                  onChange={(e) => setSaveForm({ ...saveForm, isPublic: e.target.checked })}
                  className="rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-300">
                  Make this design public (visible in gallery)
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingDesign ? 'Update' : 'Save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SaveLoadPanel