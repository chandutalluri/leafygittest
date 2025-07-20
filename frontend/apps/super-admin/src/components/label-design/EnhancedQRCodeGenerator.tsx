'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  QrCodeIcon,
  PhotoIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface QRCodeOptions {
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  logoImage?: string;
  logoSize: number;
  margin: number;
  borderRadius: number;
  style: 'square' | 'dot' | 'rounded';
}

interface QRCodeData {
  type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'whatsapp';
  content: string;
}

interface EnhancedQRCodeGeneratorProps {
  onQRCodeGenerated: (qrCode: {
    content: string;
    options: QRCodeOptions;
    imageUrl: string;
    type: string;
  }) => void;
  onClose: () => void;
  initialData?: QRCodeData;
}

export function EnhancedQRCodeGenerator({
  onQRCodeGenerated,
  onClose,
  initialData,
}: EnhancedQRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<QRCodeData>(
    initialData || { type: 'url', content: 'leafyhealth.com' }
  );

  const [options, setOptions] = useState<QRCodeOptions>({
    size: 300,
    errorCorrectionLevel: 'H', // High error correction for logo support
    foregroundColor: '#059669',
    backgroundColor: '#ffffff',
    logoImage: '',
    logoSize: 25, // 25% of QR code area for optimal scanning
    margin: 10,
    borderRadius: 0,
    style: 'square',
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'logo'>('content');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code content based on type
  const generateQRContent = (type: string, content: string): string => {
    switch (type) {
      case 'url':
        return content.startsWith('http') ? content : `https://${content}`;
      case 'email':
        return `mailto:${content}`;
      case 'phone':
        return `tel:${content}`;
      case 'sms':
        return `sms:${content}`;
      case 'whatsapp':
        return `https://wa.me/${content.replace(/[^0-9]/g, '')}`;
      case 'wifi':
        const [ssid, password] = content.split('|');
        return `WIFI:T:WPA;S:${ssid};P:${password || ''};H:false;;`;
      case 'vcard':
        const [name, phone, email] = content.split('|');
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone || ''}\nEMAIL:${email || ''}\nEND:VCARD`;
      case 'text':
      default:
        return content;
    }
  };

  // Generate QR code URL using server-side proxy to bypass CORS
  const generateQRCodeUrl = () => {
    if (!qrData.content) return '';

    const qrContent = generateQRContent(qrData.type, qrData.content);

    // Use unified gateway QR proxy endpoint with logo support
    const params = new URLSearchParams({
      data: qrContent,
      size: options.size.toString(),
      color: options.foregroundColor.replace('#', ''),
      bgcolor: options.backgroundColor.replace('#', ''),
      ecc: options.errorCorrectionLevel,
      margin: options.margin.toString(),
    });

    // Note: Logo embedding will be handled client-side for now
    // Professional QR services like qrserver.com don't support direct logo embedding
    return `/api/labels/qr/proxy?${params.toString()}`;
  };

  // Alternative QR generation method for fallback
  const generateSimpleQRUrl = (content: string) => {
    return `/api/labels/qr/proxy?data=${encodeURIComponent(content)}&size=300`;
  };

  // Create QR code with logo overlay using canvas
  const createQRWithLogo = async (
    qrImageUrl: string,
    logoImage: string,
    logoSize: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas not supported');
        return;
      }

      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';

      qrImg.onload = () => {
        canvas.width = qrImg.width;
        canvas.height = qrImg.height;

        // Draw QR code
        ctx.drawImage(qrImg, 0, 0);

        if (logoImage) {
          const logoImg = new Image();
          logoImg.onload = () => {
            // Calculate logo size (percentage of QR code)
            const logoPixelSize = (qrImg.width * logoSize) / 100;
            const logoX = (qrImg.width - logoPixelSize) / 2;
            const logoY = (qrImg.height - logoPixelSize) / 2;

            // Add white background circle for logo
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(qrImg.width / 2, qrImg.height / 2, logoPixelSize / 2 + 5, 0, 2 * Math.PI);
            ctx.fill();

            // Draw logo
            ctx.drawImage(logoImg, logoX, logoY, logoPixelSize, logoPixelSize);

            resolve(canvas.toDataURL('image/png'));
          };
          logoImg.onerror = () => {
            // If logo fails to load, return QR code without logo
            resolve(canvas.toDataURL('image/png'));
          };
          logoImg.src = logoImage;
        } else {
          resolve(canvas.toDataURL('image/png'));
        }
      };

      qrImg.onerror = () => {
        reject('Failed to load QR code image');
      };
      qrImg.src = qrImageUrl;
    });
  };

  // Update preview when options change - USE PROXY TO BYPASS CSP
  useEffect(() => {
    if (qrData.content.trim()) {
      setImageLoading(true);
      setImageError('');

      // Build QR content and use proxy to bypass CSP restrictions
      const qrContent = generateQRContent(qrData.type, qrData.content);
      const proxyUrl = `/api/labels/qr/proxy?data=${encodeURIComponent(qrContent)}&size=${options.size}&color=${options.foregroundColor.replace('#', '')}&bgcolor=${options.backgroundColor.replace('#', '')}&ecc=${options.errorCorrectionLevel}&margin=${options.margin}`;

      // If logo is present, create composite image
      if (options.logoImage) {
        createQRWithLogo(proxyUrl, options.logoImage, options.logoSize)
          .then(compositeUrl => {
            setPreviewUrl(compositeUrl);
            setImageError('');
            setImageLoading(false);
            console.log('✅ QR code with logo generated successfully');
          })
          .catch(error => {
            console.warn('Logo overlay failed, using QR without logo:', error);
            setPreviewUrl(proxyUrl);
            setImageError('');
            setImageLoading(false);
          });
      } else {
        // Use proxy URL directly - no external fetch needed
        setPreviewUrl(proxyUrl);
        setImageError('');
        setImageLoading(false);
        console.log('✅ QR code URL set via proxy - CSP compliant:', proxyUrl);
      }
    } else {
      setPreviewUrl('');
      setImageError('');
      setImageLoading(false);
    }
  }, [
    qrData.content,
    qrData.type,
    options.size,
    options.errorCorrectionLevel,
    options.foregroundColor,
    options.backgroundColor,
    options.margin,
    options.logoImage,
    options.logoSize,
  ]);

  // Handle QR code generation
  const handleGenerate = async () => {
    if (!qrData.content.trim()) return;

    const qrContent = generateQRContent(qrData.type, qrData.content);
    let finalImageUrl = generateQRCodeUrl();

    // If logo is present, generate composite image for final output
    if (options.logoImage && previewUrl && previewUrl.startsWith('data:')) {
      finalImageUrl = previewUrl; // Use the composite image with logo
    }

    onQRCodeGenerated({
      content: qrContent,
      options,
      imageUrl: finalImageUrl,
      type: qrData.type,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <QrCodeIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enhanced QR Code Generator</h2>
              <p className="text-sm text-gray-600">
                Professional QR code creation with advanced styling
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Left Panel - Controls */}
          <div className="w-2/3 p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'design'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setActiveTab('logo')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'logo'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Logo & Advanced
              </button>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Type
                  </label>
                  <select
                    value={qrData.type}
                    onChange={e => setQrData({ ...qrData, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="url">🌐 Website URL</option>
                    <option value="text">📝 Plain Text</option>
                    <option value="email">📧 Email Address</option>
                    <option value="phone">📞 Phone Number</option>
                    <option value="sms">💬 SMS Message</option>
                    <option value="whatsapp">📱 WhatsApp</option>
                    <option value="wifi">📶 WiFi Network</option>
                    <option value="vcard">👤 Contact Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {qrData.type === 'url' && 'Website URL (e.g., leafyhealth.com)'}
                    {qrData.type === 'text' && 'Text Content'}
                    {qrData.type === 'email' && 'Email Address'}
                    {qrData.type === 'phone' && 'Phone Number (e.g., +919876543210)'}
                    {qrData.type === 'sms' && 'Phone Number for SMS'}
                    {qrData.type === 'whatsapp' && 'WhatsApp Number (e.g., 919876543210)'}
                    {qrData.type === 'wifi' && 'Network Name | Password (e.g., MyWiFi|password123)'}
                    {qrData.type === 'vcard' && 'Name | Phone | Email (separated by |)'}
                  </label>
                  <textarea
                    value={qrData.content}
                    onChange={e => setQrData({ ...qrData, content: e.target.value })}
                    placeholder={
                      qrData.type === 'url'
                        ? 'Enter website URL...'
                        : qrData.type === 'text'
                          ? 'Enter your text content...'
                          : qrData.type === 'email'
                            ? 'Enter email address...'
                            : qrData.type === 'phone'
                              ? 'Enter phone number...'
                              : qrData.type === 'sms'
                                ? 'Enter phone number...'
                                : qrData.type === 'whatsapp'
                                  ? 'Enter WhatsApp number...'
                                  : qrData.type === 'wifi'
                                    ? 'NetworkName|Password'
                                    : 'John Doe|+919876543210|john@example.com'
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Generated QR Content:</p>
                  <code className="text-xs text-blue-700 break-all bg-blue-100 p-2 rounded block">
                    {qrData.content
                      ? generateQRContent(qrData.type, qrData.content)
                      : 'Enter content above...'}
                  </code>
                </div>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code Size
                    </label>
                    <input
                      type="range"
                      min="150"
                      max="500"
                      value={options.size}
                      onChange={e => setOptions({ ...options, size: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">{options.size}px</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Error Correction
                    </label>
                    <select
                      value={options.errorCorrectionLevel}
                      onChange={e =>
                        setOptions({ ...options, errorCorrectionLevel: e.target.value as any })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foreground Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={options.foregroundColor}
                        onChange={e => setOptions({ ...options, foregroundColor: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={options.foregroundColor}
                        onChange={e => setOptions({ ...options, foregroundColor: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={options.backgroundColor}
                        onChange={e => setOptions({ ...options, backgroundColor: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={options.backgroundColor}
                        onChange={e => setOptions({ ...options, backgroundColor: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin Size
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={options.margin}
                    onChange={e => setOptions({ ...options, margin: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{options.margin}px</span>
                </div>

                {/* Quick Color Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Presets
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Black & White', fg: '#000000', bg: '#ffffff' },
                      { name: 'Blue & White', fg: '#1e40af', bg: '#ffffff' },
                      { name: 'Green & White', fg: '#059669', bg: '#ffffff' },
                      { name: 'Red & White', fg: '#dc2626', bg: '#ffffff' },
                    ].map(preset => (
                      <button
                        key={preset.name}
                        onClick={() =>
                          setOptions({
                            ...options,
                            foregroundColor: preset.fg,
                            backgroundColor: preset.bg,
                          })
                        }
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-xs"
                        style={{
                          backgroundColor: preset.bg,
                          color: preset.fg,
                          border: `2px solid ${preset.fg}`,
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Logo & Advanced Tab */}
            {activeTab === 'logo' && (
              <div className="space-y-6">
                {/* Logo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Logo Upload
                  </label>

                  {/* Logo Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {options.logoImage ? (
                      <div className="space-y-3">
                        <img
                          src={options.logoImage}
                          alt="Logo Preview"
                          className="max-w-16 max-h-16 mx-auto rounded-md shadow-sm"
                        />
                        <div className="space-x-2">
                          <button
                            onClick={() => setOptions({ ...options, logoImage: '' })}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                          >
                            Remove Logo
                          </button>
                          <label className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer">
                            Change Logo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = e => {
                                    const result = e.target?.result as string;
                                    setOptions({ ...options, logoImage: result });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">Upload your logo for center placement</p>
                        <p className="text-xs text-gray-500 mb-4">
                          PNG, JPG up to 2MB. Logo will be 25% of QR code size.
                        </p>
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                          <PhotoIcon className="w-4 h-4 mr-2" />
                          Choose Logo File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = e => {
                                  const result = e.target?.result as string;
                                  setOptions({ ...options, logoImage: result });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Size Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Size: {options.logoSize}%
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="30"
                    value={options.logoSize}
                    onChange={e => setOptions({ ...options, logoSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small (15%)</span>
                    <span>Optimal (25%)</span>
                    <span>Max (30%)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    ⚠️ Larger logos may affect scanning reliability. 25% is recommended for best
                    results.
                  </p>
                </div>

                {/* Error Correction Level Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Professional Logo Implementation
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Error correction level set to High (30% recovery)</li>
                    <li>• Logo automatically centered for optimal scanning</li>
                    <li>• Transparent backgrounds recommended</li>
                    <li>• Professional sizing follows industry standards</li>
                  </ul>
                </div>

                {/* QR Code Style Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Style
                  </label>
                  <select
                    value={options.style}
                    onChange={e => setOptions({ ...options, style: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="square">Square (Classic)</option>
                    <option value="dot">Dot Pattern</option>
                    <option value="rounded">Rounded Corners</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/3 bg-gray-50 p-6 border-l">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <EyeIcon className="w-5 h-5 mr-2" />
                Live Preview
              </h3>

              <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[300px]">
                {imageLoading ? (
                  <div className="text-center text-blue-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Generating QR code...</p>
                  </div>
                ) : imageError ? (
                  <div className="text-center text-red-500">
                    <QrCodeIcon className="w-16 h-16 mx-auto mb-2 text-red-300" />
                    <p className="text-sm">Failed to load QR code</p>
                    <p className="text-xs text-gray-500 mt-1">{imageError}</p>
                    <button
                      onClick={() => {
                        setImageError('');
                        setImageLoading(true);
                        // Retry with proxy
                        const qrContent = generateQRContent(qrData.type, qrData.content);
                        const proxyUrl = `/api/labels/qr/proxy?data=${encodeURIComponent(qrContent)}&size=${options.size}&color=${options.foregroundColor.replace('#', '')}&bgcolor=${options.backgroundColor.replace('#', '')}&ecc=${options.errorCorrectionLevel}&margin=${options.margin}`;
                        setPreviewUrl(proxyUrl);
                        setImageLoading(false);
                      }}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : previewUrl ? (
                  <div className="text-center">
                    <img
                      src={previewUrl}
                      alt="QR Code Preview"
                      className="max-w-full max-h-full object-contain shadow-lg rounded-lg mx-auto"
                      style={{
                        maxWidth: `${Math.min(options.size, 250)}px`,
                        maxHeight: `${Math.min(options.size, 250)}px`,
                      }}
                      onLoad={() => {
                        console.log('✅ QR Code preview loaded successfully via blob!');
                        setImageError('');
                      }}
                      onError={e => {
                        console.error('❌ QR Code blob preview failed:', e);
                        setImageError('Failed to display QR code');
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      QR Code for: {generateQRContent(qrData.type, qrData.content)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCodeIcon className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                    <p>Enter content to see preview</p>
                  </div>
                )}
              </div>

              {/* QR Code Info */}
              {qrData.content && (
                <div className="bg-white rounded-lg p-4 border text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">QR Code Details</h4>
                  <div className="space-y-1 text-gray-600">
                    <div>
                      Type: <span className="font-medium">{qrData.type.toUpperCase()}</span>
                    </div>
                    <div>
                      Size:{' '}
                      <span className="font-medium">
                        {options.size}×{options.size}px
                      </span>
                    </div>
                    <div>
                      Error Correction:{' '}
                      <span className="font-medium">{options.errorCorrectionLevel}</span>
                    </div>
                    <div>
                      Estimated Capacity:{' '}
                      <span className="font-medium">
                        {options.errorCorrectionLevel === 'L'
                          ? '2953'
                          : options.errorCorrectionLevel === 'M'
                            ? '2331'
                            : options.errorCorrectionLevel === 'Q'
                              ? '1663'
                              : '1273'}{' '}
                        chars
                      </span>
                    </div>
                  </div>

                  {/* Debug Tools */}
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={() => {
                        const testUrl = generateSimpleQRUrl(qrData.content);
                        console.log('🧪 Testing simple QR URL:', testUrl);
                        window.open(testUrl, '_blank');
                      }}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 mr-2"
                    >
                      Test QR URL
                    </button>
                    <button
                      onClick={() => {
                        const currentUrl = generateQRCodeUrl();
                        console.log('🎨 Testing styled QR URL (via proxy):', currentUrl);
                        window.open(currentUrl, '_blank');
                      }}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Test Proxy URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            Professional QR codes for LeafyHealth product labels
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!qrData.content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <QrCodeIcon className="w-4 h-4 mr-2" />
              Generate QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
