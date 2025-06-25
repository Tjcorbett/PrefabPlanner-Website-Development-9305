import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { fabric } from 'fabric'
import EditorToolbar from '../components/editor/EditorToolbar'
import Canvas2D from '../components/editor/Canvas2D'
import FurnitureLibrary from '../components/editor/FurnitureLibrary'
import TemplateSelector from '../components/editor/TemplateSelector'
import SaveLoadPanel from '../components/editor/SaveLoadPanel'

const FloorplanEditor = () => {
  const [selectedTool, setSelectedTool] = useState('select')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showFurniture, setShowFurniture] = useState(true)
  const [showSaveLoad, setShowSaveLoad] = useState(false)
  const [canvasData, setCanvasData] = useState(null)
  const [gridSize, setGridSize] = useState(20)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const canvasRef = useRef(null)

  const handleAddFurnitureItem = (item) => {
    // Add furniture item to canvas at center
    const canvas = canvasRef.current?.fabricCanvasRef?.current
    if (!canvas) return

    const rect = new fabric.Rect({
      left: canvas.width / 2 - item.width / 2,
      top: canvas.height / 2 - item.height / 2,
      width: item.width,
      height: item.height,
      fill: item.color,
      stroke: '#333',
      strokeWidth: 1
    })

    // Add label
    const text = new fabric.Text(item.name, {
      left: canvas.width / 2 - item.width / 2,
      top: canvas.height / 2 - item.height / 2 - 20,
      fontSize: 12,
      fill: '#fff',
      fontFamily: 'Arial'
    })

    const group = new fabric.Group([rect, text], {
      left: canvas.width / 2 - item.width / 2,
      top: canvas.height / 2 - item.height / 2
    })

    canvas.add(group)
    canvas.renderAll()
  }

  const handleSave = () => {
    setShowSaveLoad(true)
  }

  const handleExport = () => {
    const dataURL = canvasRef.current?.exportCanvas()
    if (dataURL) {
      const link = document.createElement('a')
      link.download = 'floorplan.png'
      link.href = dataURL
      link.click()
    }
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      canvasRef.current?.clearCanvas()
    }
  }

  const handleZoomIn = () => {
    canvasRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    canvasRef.current?.zoomOut()
  }

  const handleZoomFit = () => {
    canvasRef.current?.zoomToFit()
  }

  const handleLoadDesign = (designData) => {
    setCanvasData(designData)
  }

  const getCurrentCanvasData = () => {
    return canvasRef.current?.getCanvasData()
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorToolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        showFurniture={showFurniture}
        setShowFurniture={setShowFurniture}
        gridSize={gridSize}
        setGridSize={setGridSize}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        onSave={handleSave}
        onExport={handleExport}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomFit={handleZoomFit}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Side Panel */}
        {(showTemplates || showFurniture || showSaveLoad) && (
          <motion.div
            className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showTemplates && (
              <TemplateSelector
                onSelectTemplate={(template) => {
                  setCanvasData(template)
                  setShowTemplates(false)
                }}
              />
            )}
            
            {showFurniture && !showTemplates && !showSaveLoad && (
              <FurnitureLibrary onAddItem={handleAddFurnitureItem} />
            )}
            
            {showSaveLoad && (
              <SaveLoadPanel
                canvasData={getCurrentCanvasData()}
                onLoadDesign={handleLoadDesign}
                onClose={() => setShowSaveLoad(false)}
              />
            )}
          </motion.div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <Canvas2D
            ref={canvasRef}
            canvasData={canvasData}
            selectedTool={selectedTool}
            gridSize={gridSize}
            snapToGrid={snapToGrid}
            onCanvasChange={setCanvasData}
          />
        </div>
      </div>
    </div>
  )
}

export default FloorplanEditor