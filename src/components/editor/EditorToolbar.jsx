import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiMousePointer, FiSquare, FiCircle, FiEdit2, FiType, FiHome, FiZoomIn, FiZoomOut, FiRefreshCw, FiTrash2, FiSave, FiDownload, FiGrid, FiEye, FiLayers, FiMove, FiMinus, FiFolderOpen } = FiIcons

const EditorToolbar = ({
  selectedTool,
  setSelectedTool,
  showTemplates,
  setShowTemplates,
  showFurniture,
  setShowFurniture,
  gridSize,
  setGridSize,
  snapToGrid,
  setSnapToGrid,
  onSave,
  onExport,
  onClear,
  onZoomIn,
  onZoomOut,
  onZoomFit
}) => {
  const tools = [
    { id: 'select', icon: FiMousePointer, label: 'Select', color: 'bg-blue-600' },
    { id: 'wall', icon: FiMinus, label: 'Wall', color: 'bg-orange-600' },
    { id: 'rectangle', icon: FiSquare, label: 'Rectangle', color: 'bg-green-600' },
    { id: 'circle', icon: FiCircle, label: 'Circle', color: 'bg-purple-600' },
    { id: 'line', icon: FiEdit2, label: 'Line', color: 'bg-red-600' },
    { id: 'text', icon: FiType, label: 'Text', color: 'bg-yellow-600' },
    { id: 'door', icon: FiHome, label: 'Door', color: 'bg-indigo-600' },
    { id: 'window', icon: FiSquare, label: 'Window', color: 'bg-teal-600' }
  ]

  return (
    <motion.div
      className="bg-gray-900 border-b border-gray-700 p-4"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Tools */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  selectedTool === tool.id
                    ? `${tool.color} text-white shadow-lg`
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                title={tool.label}
              >
                <SafeIcon icon={tool.icon} className="text-lg" />
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={onZoomOut}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title="Zoom Out"
            >
              <SafeIcon icon={FiZoomOut} />
            </button>
            <button
              onClick={onZoomFit}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title="Fit to Screen"
            >
              <SafeIcon icon={FiRefreshCw} />
            </button>
            <button
              onClick={onZoomIn}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title="Zoom In"
            >
              <SafeIcon icon={FiZoomIn} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Panel Toggles */}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showTemplates
                ? 'bg-orange-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <SafeIcon icon={FiLayers} />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setShowFurniture(!showFurniture)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showFurniture
                ? 'bg-orange-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <SafeIcon icon={FiEye} />
            <span>Library</span>
          </button>

          {/* Grid Settings */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`p-2 rounded-lg transition-colors ${
                snapToGrid
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              title="Snap to Grid"
            >
              <SafeIcon icon={FiGrid} />
            </button>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
            >
              <option value={10}>10px</option>
              <option value={20}>20px</option>
              <option value={30}>30px</option>
              <option value={50}>50px</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSave}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <SafeIcon icon={FiFolderOpen} />
              <span>Save/Load</span>
            </button>

            <button
              onClick={onClear}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} />
              <span>Clear</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <SafeIcon icon={FiDownload} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EditorToolbar