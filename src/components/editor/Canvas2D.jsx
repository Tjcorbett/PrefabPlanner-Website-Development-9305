import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { fabric } from 'fabric'

const Canvas2D = forwardRef(({
  canvasData,
  selectedTool,
  gridSize,
  snapToGrid,
  onCanvasChange
}, ref) => {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const [canvasInitialized, setCanvasInitialized] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || canvasInitialized) return

    // Get parent dimensions
    const parentElement = canvasRef.current.parentElement
    if (!parentElement) return

    const width = parentElement.clientWidth || 800
    const height = parentElement.clientHeight || 600

    // Initialize Fabric.js canvas with optimized settings
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: '#111827',
      selection: selectedTool === 'select',
      renderOnAddRemove: true,
      skipTargetFind: false,
      allowTouchScrolling: false,
      imageSmoothingEnabled: false,
      enableRetinaScaling: false
    })

    // Optimize performance
    canvas.freeDrawingBrush.width = 2
    canvas.freeDrawingBrush.color = '#f97316'

    fabricCanvasRef.current = canvas
    setCanvasInitialized(true)

    // Setup grid
    if (snapToGrid) {
      drawGrid(canvas, gridSize)
    }

    // Handle tool changes
    setupTool(canvas, selectedTool)

    // Handle canvas events with debouncing
    let debounceTimer = null
    const handleCanvasChange = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (onCanvasChange) {
          onCanvasChange(canvas.toJSON(['selectable', 'evented']))
        }
      }, 100)
    }

    canvas.on('object:added', handleCanvasChange)
    canvas.on('object:modified', handleCanvasChange)
    canvas.on('object:removed', handleCanvasChange)

    // Cleanup function
    return () => {
      if (canvas) {
        canvas.dispose()
      }
      if (debounceTimer) clearTimeout(debounceTimer)
      setCanvasInitialized(false)
    }
  }, [])

  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !canvasInitialized) return
    
    const canvas = fabricCanvasRef.current
    
    // Update grid
    if (snapToGrid) {
      drawGrid(canvas, gridSize)
    } else {
      // Remove grid
      const objects = canvas.getObjects()
      objects.forEach(obj => {
        if (obj.isGrid) {
          canvas.remove(obj)
        }
      })
    }
    
    // Setup tool
    setupTool(canvas, selectedTool)
    canvas.requestRenderAll()
  }, [selectedTool, gridSize, snapToGrid, canvasInitialized])

  // Handle canvas data changes
  useEffect(() => {
    if (canvasData && fabricCanvasRef.current && canvasInitialized) {
      fabricCanvasRef.current.loadFromJSON(canvasData, () => {
        fabricCanvasRef.current.requestRenderAll()
      })
    }
  }, [canvasData, canvasInitialized])

  const snapToGridPoint = (point) => {
    if (!snapToGrid) return point
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    }
  }

  const drawGrid = (canvas, size) => {
    const width = canvas.width
    const height = canvas.height

    // Remove existing grid
    const objects = canvas.getObjects()
    objects.forEach(obj => {
      if (obj.isGrid) {
        canvas.remove(obj)
      }
    })

    // Create grid group for better performance
    const gridLines = []

    // Draw vertical lines
    for (let i = 0; i <= width; i += size) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#374151',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        isGrid: true,
        excludeFromExport: true
      })
      gridLines.push(line)
    }

    // Draw horizontal lines
    for (let i = 0; i <= height; i += size) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#374151',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        isGrid: true,
        excludeFromExport: true
      })
      gridLines.push(line)
    }

    // Add all grid lines at once
    gridLines.forEach(line => canvas.add(line))
    canvas.sendToBack(...gridLines)
  }

  const setupTool = (canvas, tool) => {
    // Reset canvas interaction
    canvas.isDrawingMode = false
    canvas.selection = tool === 'select'
    canvas.defaultCursor = 'default'

    // Remove all event listeners
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
    canvas.off('path:created')

    // Set cursor based on tool
    const cursors = {
      select: 'default',
      wall: 'crosshair',
      rectangle: 'crosshair',
      circle: 'crosshair',
      line: 'crosshair',
      text: 'text',
      door: 'crosshair',
      window: 'crosshair'
    }
    canvas.defaultCursor = cursors[tool] || 'default'

    switch (tool) {
      case 'select':
        canvas.selection = true
        break
      case 'wall':
        setupWallTool(canvas)
        break
      case 'rectangle':
        setupRectangleTool(canvas)
        break
      case 'circle':
        setupCircleTool(canvas)
        break
      case 'line':
        setupLineTool(canvas)
        break
      case 'text':
        setupTextTool(canvas)
        break
      case 'door':
        setupDoorTool(canvas)
        break
      case 'window':
        setupWindowTool(canvas)
        break
      default:
        break
    }
  }

  const setupWallTool = (canvas) => {
    let isDrawing = false
    let startPoint = null
    let currentLine = null

    canvas.on('mouse:down', (o) => {
      isDrawing = true
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      startPoint = pointer
      
      currentLine = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: '#f97316',
        strokeWidth: 8,
        selectable: false,
        evented: false,
        strokeLineCap: 'square'
      })
      canvas.add(currentLine)
      setIsDrawing(true)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDrawing || !currentLine) return
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      currentLine.set({ x2: pointer.x, y2: pointer.y })
      canvas.requestRenderAll()
    })

    canvas.on('mouse:up', () => {
      if (currentLine) {
        currentLine.set({ selectable: true, evented: true })
        currentLine = null
      }
      isDrawing = false
      startPoint = null
      setIsDrawing(false)
    })
  }

  const setupRectangleTool = (canvas) => {
    let isDrawing = false
    let startPoint = null
    let rect = null

    canvas.on('mouse:down', (o) => {
      isDrawing = true
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      startPoint = pointer
      
      rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: '#f97316',
        strokeWidth: 2,
        selectable: false,
        evented: false
      })
      canvas.add(rect)
      setIsDrawing(true)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDrawing || !rect) return
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      
      const width = Math.abs(pointer.x - startPoint.x)
      const height = Math.abs(pointer.y - startPoint.y)
      const left = Math.min(pointer.x, startPoint.x)
      const top = Math.min(pointer.y, startPoint.y)
      
      rect.set({ left, top, width, height })
      canvas.requestRenderAll()
    })

    canvas.on('mouse:up', () => {
      if (rect) {
        rect.set({ selectable: true, evented: true })
        rect = null
      }
      isDrawing = false
      startPoint = null
      setIsDrawing(false)
    })
  }

  const setupCircleTool = (canvas) => {
    let isDrawing = false
    let startPoint = null
    let circle = null

    canvas.on('mouse:down', (o) => {
      isDrawing = true
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      startPoint = pointer
      
      circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: 'transparent',
        stroke: '#f97316',
        strokeWidth: 2,
        selectable: false,
        evented: false
      })
      canvas.add(circle)
      setIsDrawing(true)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDrawing || !circle) return
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      const radius = Math.sqrt(Math.pow(startPoint.x - pointer.x, 2) + Math.pow(startPoint.y - pointer.y, 2)) / 2
      circle.set({ radius: Math.max(radius, 1) })
      canvas.requestRenderAll()
    })

    canvas.on('mouse:up', () => {
      if (circle) {
        circle.set({ selectable: true, evented: true })
        circle = null
      }
      isDrawing = false
      startPoint = null
      setIsDrawing(false)
    })
  }

  const setupLineTool = (canvas) => {
    let isDrawing = false
    let line = null

    canvas.on('mouse:down', (o) => {
      isDrawing = true
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      
      line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: '#f97316',
        strokeWidth: 2,
        selectable: false,
        evented: false
      })
      canvas.add(line)
      setIsDrawing(true)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDrawing || !line) return
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      line.set({ x2: pointer.x, y2: pointer.y })
      canvas.requestRenderAll()
    })

    canvas.on('mouse:up', () => {
      if (line) {
        line.set({ selectable: true, evented: true })
        line = null
      }
      isDrawing = false
      setIsDrawing(false)
    })
  }

  const setupTextTool = (canvas) => {
    canvas.on('mouse:down', (o) => {
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      const text = new fabric.IText('Click to edit', {
        left: pointer.x,
        top: pointer.y,
        fill: '#f97316',
        fontSize: 16,
        fontFamily: 'Arial'
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
    })
  }

  const setupDoorTool = (canvas) => {
    canvas.on('mouse:down', (o) => {
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      
      // Create door opening
      const doorOpening = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 80,
        height: 8,
        fill: 'transparent',
        stroke: '#8B4513',
        strokeWidth: 3
      })
      
      // Create door swing
      const doorSwing = new fabric.Path('M 0 0 Q 40 0 40 40', {
        left: pointer.x,
        top: pointer.y,
        fill: 'transparent',
        stroke: '#f97316',
        strokeWidth: 1,
        strokeDashArray: [5, 5]
      })
      
      const doorGroup = new fabric.Group([doorOpening, doorSwing], {
        left: pointer.x,
        top: pointer.y
      })
      
      canvas.add(doorGroup)
    })
  }

  const setupWindowTool = (canvas) => {
    canvas.on('mouse:down', (o) => {
      const pointer = snapToGridPoint(canvas.getPointer(o.e))
      
      // Create window frame
      const windowFrame = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 60,
        height: 6,
        fill: '#87CEEB',
        stroke: '#4682B4',
        strokeWidth: 2
      })
      
      // Create window dividers
      const divider1 = new fabric.Line([pointer.x + 20, pointer.y, pointer.x + 20, pointer.y + 6], {
        stroke: '#4682B4',
        strokeWidth: 1
      })
      
      const divider2 = new fabric.Line([pointer.x + 40, pointer.y, pointer.x + 40, pointer.y + 6], {
        stroke: '#4682B4',
        strokeWidth: 1
      })
      
      const windowGroup = new fabric.Group([windowFrame, divider1, divider2], {
        left: pointer.x,
        top: pointer.y
      })
      
      canvas.add(windowGroup)
    })
  }

  // Canvas methods
  const zoomIn = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    const zoom = Math.min(canvas.getZoom() * 1.2, 5)
    canvas.setZoom(zoom)
  }

  const zoomOut = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    const zoom = Math.max(canvas.getZoom() * 0.8, 0.1)
    canvas.setZoom(zoom)
  }

  const zoomToFit = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    canvas.setZoom(1)
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
    canvas.requestRenderAll()
  }

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    canvas.clear()
    canvas.backgroundColor = '#111827'
    if (snapToGrid) {
      drawGrid(canvas, gridSize)
    }
  }

  const exportCanvas = () => {
    if (!fabricCanvasRef.current) return null
    return fabricCanvasRef.current.toDataURL('image/png', 1.0)
  }

  const getCanvasData = () => {
    if (!fabricCanvasRef.current) return null
    return fabricCanvasRef.current.toJSON(['selectable', 'evented'])
  }

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    zoomIn,
    zoomOut,
    zoomToFit,
    clearCanvas,
    exportCanvas,
    getCanvasData,
    fabricCanvasRef
  }))

  return (
    <div className="w-full h-full relative bg-gray-950">
      <canvas ref={canvasRef} className="border border-gray-700 cursor-crosshair" />
      {isDrawing && (
        <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-sm">
          Drawing...
        </div>
      )}
    </div>
  )
})

Canvas2D.displayName = 'Canvas2D'

export default Canvas2D