import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUpload, FiImage, FiFileText, FiX } = FiIcons;

const ImageImporter = ({ onImageImport, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setProcessing(true);
    const validFiles = files.filter(file => 
      file.type === 'image/png' || 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' || 
      file.type === 'application/pdf'
    );

    for (const file of validFiles) {
      try {
        if (file.type === 'application/pdf') {
          await processPDF(file);
        } else {
          await processImage(file);
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
    setProcessing(false);
  };

  const processImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const fileData = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: 'image',
            url: e.target.result,
            width: img.width,
            height: img.height,
            file: file
          };
          setUploadedFiles(prev => [...prev, fileData]);
          resolve();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const processPDF = async (file) => {
    try {
      // For now, we'll just create a placeholder for PDF processing
      // This can be enhanced with actual PDF.js integration later
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          id: Date.now() + Math.random(),
          name: `${file.name} - PDF Preview`,
          type: 'pdf',
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Y5ZmFmYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRGIFByZXZpZXc8L3RleHQ+PC9zdmc+',
          width: 200,
          height: 120,
          file: file
        };
        setUploadedFiles(prev => [...prev, fileData]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  };

  const handleImportToCanvas = (fileData) => {
    onImageImport(fileData);
    onClose();
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Import Floorplan Images</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUpload} className="text-2xl text-orange-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Supports PNG, JPEG, and PDF files
              </p>
              
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Choose Files
              </label>
            </div>
          </div>
        </div>

        {processing && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-orange-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-400"></div>
              <span>Processing files...</span>
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Uploaded Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="aspect-video bg-gray-600 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {file.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {file.width} × {file.height}px
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <SafeIcon 
                          icon={file.type === 'pdf' ? FiFileText : FiImage} 
                          className="text-orange-400 text-xs" 
                        />
                        <span className="text-xs text-gray-400 uppercase">
                          {file.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => handleImportToCanvas(file)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Import
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <SafeIcon icon={FiX} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImageImporter;