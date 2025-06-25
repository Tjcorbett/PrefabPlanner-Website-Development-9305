import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { uploadLogo, getLogo } from '../../services/inboxService'

const { FiUpload, FiImage, FiX, FiSave } = FiIcons

const LogoUpload = ({ onLogoUpdate }) => {
  const [currentLogo, setCurrentLogo] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  React.useEffect(() => {
    loadCurrentLogo()
  }, [])

  const loadCurrentLogo = async () => {
    try {
      const result = await getLogo()
      if (result.data && result.data.logo_url) {
        setCurrentLogo(result.data.logo_url)
      }
    } catch (error) {
      console.error('Error loading logo:', error)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileSelect = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, GIF)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!previewUrl) return

    setUploading(true)
    try {
      // Convert preview URL back to file for upload
      const response = await fetch(previewUrl)
      const blob = await response.blob()
      const file = new File([blob], 'logo.png', { type: 'image/png' })

      const result = await uploadLogo(file)
      if (result.data) {
        setCurrentLogo(result.data.logo_url)
        setPreviewUrl(null)
        if (onLogoUpdate) {
          onLogoUpdate(result.data.logo_url)
        }
        alert('Logo uploaded successfully!')
      } else {
        alert('Error uploading logo: ' + result.error)
      }
    } catch (error) {
      alert('Error uploading logo: ' + error.message)
    }
    setUploading(false)
  }

  const clearPreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Website Logo</h3>
      
      {/* Current Logo Display */}
      {currentLogo && !previewUrl && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Current Logo:</p>
          <div className="w-48 h-24 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={currentLogo} 
              alt="Current Logo" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <div className="w-48 h-24 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
              <img 
                src={previewUrl} 
                alt="Logo Preview" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={uploading ? FiUpload : FiSave} />
                <span>{uploading ? 'Uploading...' : 'Save Logo'}</span>
              </button>
              <button
                onClick={clearPreview}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <SafeIcon icon={FiImage} className="text-2xl text-orange-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Upload Logo
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Drag and drop your logo here, or click to browse
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiUpload} />
                <span>Choose File</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Recommended: PNG or JPG, max 5MB, 300x150px optimal
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogoUpload