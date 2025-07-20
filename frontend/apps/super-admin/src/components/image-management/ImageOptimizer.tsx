import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ImageOptimizerProps {
  imageId: string;
  onOptimizationComplete: (result: any) => void;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({ imageId, onOptimizationComplete }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [optimizeSettings, setOptimizeSettings] = useState({
    quality: 85,
    format: 'webp',
  });

  const [resizeSettings, setResizeSettings] = useState({
    width: 800,
    height: 600,
    quality: 90,
    format: 'webp',
  });

  const [enhanceSettings, setEnhanceSettings] = useState({
    brightness: 1,
    contrast: 1,
    saturation: 1,
    sharpen: false,
    blur: 0,
    removeNoise: false,
  });

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`/api/image-management/optimize/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimizeSettings),
      });

      if (!response.ok) throw new Error('Optimization failed');

      const result = await response.json();
      toast.success(`Image optimized! Saved ${result.optimized.compressionRatio}% file size`);
      onOptimizationComplete(result);
    } catch (error) {
      toast.error('Failed to optimize image');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleResize = async () => {
    setIsResizing(true);
    try {
      const response = await fetch(`/api/image-management/resize/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resizeSettings),
      });

      if (!response.ok) throw new Error('Resizing failed');

      const result = await response.json();
      toast.success(`Image resized to ${resizeSettings.width}x${resizeSettings.height}`);
      onOptimizationComplete(result);
    } catch (error) {
      toast.error('Failed to resize image');
    } finally {
      setIsResizing(false);
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch(`/api/image-management/enhance/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enhanceSettings),
      });

      if (!response.ok) throw new Error('Enhancement failed');

      const result = await response.json();
      toast.success('Image enhanced successfully');
      onOptimizationComplete(result);
    } catch (error) {
      toast.error('Failed to enhance image');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Optimization Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">🎯 Image Optimization</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Quality: {optimizeSettings.quality}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={optimizeSettings.quality}
              onChange={e =>
                setOptimizeSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Output Format</label>
            <select
              value={optimizeSettings.format}
              onChange={e => setOptimizeSettings(prev => ({ ...prev, format: e.target.value }))}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="webp">WebP (Best compression)</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Image'}
        </button>
      </motion.div>

      {/* Resizing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">📏 Image Resizing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Width (px)</label>
            <input
              type="number"
              value={resizeSettings.width}
              onChange={e =>
                setResizeSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))
              }
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Height (px)</label>
            <input
              type="number"
              value={resizeSettings.height}
              onChange={e =>
                setResizeSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))
              }
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Quality: {resizeSettings.quality}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={resizeSettings.quality}
              onChange={e =>
                setResizeSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Output Format</label>
            <select
              value={resizeSettings.format}
              onChange={e => setResizeSettings(prev => ({ ...prev, format: e.target.value }))}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleResize}
          disabled={isResizing}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isResizing ? 'Resizing...' : 'Resize Image'}
        </button>
      </motion.div>

      {/* Enhancement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">✨ Image Enhancement</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Brightness: {enhanceSettings.brightness}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={enhanceSettings.brightness}
              onChange={e =>
                setEnhanceSettings(prev => ({ ...prev, brightness: parseFloat(e.target.value) }))
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Contrast: {enhanceSettings.contrast}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={enhanceSettings.contrast}
              onChange={e =>
                setEnhanceSettings(prev => ({ ...prev, contrast: parseFloat(e.target.value) }))
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Saturation: {enhanceSettings.saturation}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={enhanceSettings.saturation}
              onChange={e =>
                setEnhanceSettings(prev => ({ ...prev, saturation: parseFloat(e.target.value) }))
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Blur: {enhanceSettings.blur}px
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={enhanceSettings.blur}
              onChange={e =>
                setEnhanceSettings(prev => ({ ...prev, blur: parseFloat(e.target.value) }))
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={enhanceSettings.sharpen}
              onChange={e => setEnhanceSettings(prev => ({ ...prev, sharpen: e.target.checked }))}
              className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
            />
            <span className="text-white">Apply Sharpening</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={enhanceSettings.removeNoise}
              onChange={e =>
                setEnhanceSettings(prev => ({ ...prev, removeNoise: e.target.checked }))
              }
              className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
            />
            <span className="text-white">Remove Noise</span>
          </label>
        </div>

        <button
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isEnhancing ? 'Enhancing...' : 'Enhance Image'}
        </button>
      </motion.div>
    </div>
  );
};

export default ImageOptimizer;
