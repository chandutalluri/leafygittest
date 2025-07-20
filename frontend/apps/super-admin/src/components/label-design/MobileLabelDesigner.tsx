'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  PhotoIcon,
  RectangleGroupIcon,
  PaintBrushIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  Square3Stack3DIcon,
  CogIcon,
  TrashIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon,
  BeakerIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

// Utility functions for canvas operations
const mmToPx = (mm: number) => mm * 3.7795275591; // 96 DPI conversion
const pxToMm = (px: number) => px / 3.7795275591;

interface CanvasElement {
  id: string;
  type: 'text' | 'barcode' | 'qr' | 'image' | 'rectangle' | 'line' | 'nutrition-table';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  placeholder?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
  isEditing?: boolean;
  imageId?: string;
  imageUrl?: string;
  qrType?: 'text' | 'url' | 'phone' | 'email' | 'sms' | 'wifi' | 'vcard' | 'whatsapp';
  nutritionData?: any;
  nutritionTemplate?: 'standard' | 'tall-bottle' | 'wide-bag' | 'compact-square' | 'mini-sachet';
  companyData?: any;
}

interface MediaType {
  id: number;
  name: string;
  dimensions: {
    labelWidth: number;
    labelHeight: number;
    pageWidth: number;
    pageHeight: number;
  };
  layout: {
    rows: number;
    columns: number;
    gaps: { x: number; y: number };
    margins: { top: number; bottom: number; left: number; right: number };
  };
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: { name: string };
  nutritionData?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sodium: string;
  };
}

export function MobileLabelDesigner() {
  // Core state
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);

  // Canvas state
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100); // Mobile-optimized zoom
  const [showGrid, setShowGrid] = useState(false); // Disabled by default on mobile
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  // Mobile-specific state
  const [isMobileView, setIsMobileView] = useState(false);
  const [activePanel, setActivePanel] = useState<'tools' | 'properties' | 'templates'>('tools');
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobile =
        window.innerWidth <= 1024 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      console.log('MobileLabelDesigner - Mobile detection:', {
        windowWidth: window.innerWidth,
        userAgent: navigator.userAgent,
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints,
        isMobile,
      });

      setIsMobileView(isMobile);

      // Force mobile mode for this component
      if (!isMobile) {
        console.log('Forcing mobile mode for better mobile experience');
        setIsMobileView(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch media types
      const mediaResponse = await fetch('/api/labels/media-types');
      const mediaData = await mediaResponse.json();

      if (mediaData.success && mediaData.data) {
        setMediaTypes(mediaData.data);
        // Auto-select first media type for mobile
        if (mediaData.data.length > 0) {
          setSelectedMedia(mediaData.data[0]);
        }
      }

      // Fetch products
      const productResponse = await fetch('/api/products');
      const productData = await productResponse.json();

      if (productData && Array.isArray(productData)) {
        setProducts(productData.slice(0, 20)); // Limit for mobile performance
      }

      // Fetch available images
      const imageResponse = await fetch('/api/image-management/images');
      const imageData = await imageResponse.json();

      if (imageData && Array.isArray(imageData)) {
        setAvailableImages(imageData.slice(0, 10)); // Limit for mobile
      }

      // Fetch company data
      const companyResponse = await fetch('/api/company-management/companies');
      const companyData = await companyResponse.json();

      if (companyData && Array.isArray(companyData) && companyData.length > 0) {
        setCompanyData(companyData[0]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load designer data');
    } finally {
      setLoading(false);
    }
  };

  // Touch event handlers for mobile compatibility
  const handleTouchStart = useCallback((e: React.TouchEvent, elementId?: string) => {
    // Don't prevent default to allow scrolling when not interacting with elements
    if (!elementId) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    const now = Date.now();

    setTouchStartTime(now);
    setDragStartPos({ x: touch.clientX, y: touch.clientY });

    if (elementId) {
      setSelectedElement(elementId);
    }

    // Clear any existing timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }

    // Set up long press detection
    touchTimeoutRef.current = setTimeout(() => {
      // Long press detected - show context menu or properties
      if (elementId) {
        setActivePanel('properties');
        toast.success('Element selected for editing');
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 300); // Shorter long press for better mobile UX
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!selectedElement) return;

      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartPos.x;
      const deltaY = touch.clientY - dragStartPos.y;

      // Clear long press timeout if moving
      if (touchTimeoutRef.current && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }

      // Handle dragging with better mobile sensitivity
      if (selectedElement && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
        setIsDragging(true);

        // Get current element position
        const element = canvasElements.find(el => el.id === selectedElement);
        if (element) {
          const newX = Math.max(0, Math.min(280, element.x + (deltaX / (zoom / 100)) * 0.5));
          const newY = Math.max(0, Math.min(180, element.y + (deltaY / (zoom / 100)) * 0.5));

          updateElement(selectedElement, { x: newX, y: newY });

          // Update drag start position for smooth dragging
          setDragStartPos({ x: touch.clientX, y: touch.clientY });
        }
      }
    },
    [selectedElement, dragStartPos, zoom, canvasElements]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (selectedElement) {
        e.preventDefault();
        e.stopPropagation();
      }

      const touchDuration = Date.now() - touchStartTime;

      // Clear timeout
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }

      // Handle tap (short touch)
      if (touchDuration < 250 && !isDragging) {
        // Quick tap - just selection feedback
        if (selectedElement) {
          toast.success('Element selected');
        }
      }

      setIsDragging(false);
    },
    [touchStartTime, isDragging, selectedElement]
  );

  // Canvas operations optimized for mobile
  const addElement = useCallback(
    (type: CanvasElement['type']) => {
      console.log(`Adding ${type} element to mobile canvas`);

      const newElement: CanvasElement = {
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        x: 20 + canvasElements.length * 5, // Smaller stagger for mobile
        y: 20 + canvasElements.length * 5,
        width:
          type === 'text'
            ? 100
            : type === 'qr'
              ? 40
              : type === 'barcode'
                ? 80
                : type === 'image'
                  ? 60
                  : 80,
        height:
          type === 'text'
            ? 20
            : type === 'qr'
              ? 40
              : type === 'barcode'
                ? 30
                : type === 'image'
                  ? 60
                  : 20,
        content:
          type === 'text'
            ? 'Sample Text'
            : type === 'qr'
              ? 'https://leafyhealth.com'
              : type === 'barcode'
                ? '1234567890'
                : type === 'image'
                  ? 'image.jpg'
                  : 'Element',
        fontSize: type === 'text' ? 12 : 10, // Smaller fonts for mobile
        fontWeight: 'normal',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        backgroundColor: type === 'rectangle' ? '#f3f4f6' : 'transparent',
        color: '#000000',
        borderColor: type === 'rectangle' ? '#6b7280' : 'transparent',
        borderWidth: type === 'rectangle' ? 1 : 0,
        rotation: 0,
        opacity: 1,
        zIndex: canvasElements.length + 1,
        qrType: type === 'qr' ? 'url' : undefined,
      };

      setCanvasElements(prev => [...prev, newElement]);
      setSelectedElement(newElement.id);
      toast.success(`${type} added to canvas`);

      // Auto-switch to properties panel for editing
      setActivePanel('properties');
    },
    [canvasElements.length]
  );

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev => prev.map(el => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteElement = (id: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    toast.success('Element deleted');
  };

  // Mobile-optimized zoom controls
  const handleMobileZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 300)); // Smaller increments for mobile
  };

  const handleMobileZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 50)); // Higher minimum for mobile
  };

  const handleFitToMobile = () => {
    if (selectedMedia && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const canvasWidth = mmToPx(selectedMedia.dimensions.labelWidth);
        const canvasHeight = mmToPx(selectedMedia.dimensions.labelHeight);

        // Calculate zoom to fit mobile screen
        const padding = 40; // Smaller padding for mobile
        const zoomX = ((containerRect.width - padding) / canvasWidth) * 100;
        const zoomY = ((containerRect.height - padding) / canvasHeight) * 100;
        const newZoom = Math.min(zoomX, zoomY, 200); // Lower max for mobile

        setZoom(Math.max(newZoom, 50));
        setPanOffset({ x: 0, y: 0 });
      }
    }
  };

  // Calculate scaled canvas dimensions
  const canvasSize = selectedMedia
    ? {
        width: mmToPx(selectedMedia.dimensions.labelWidth),
        height: mmToPx(selectedMedia.dimensions.labelHeight),
      }
    : { width: 200, height: 100 };

  const scaledCanvasSize = {
    width: (canvasSize.width * zoom) / 100,
    height: (canvasSize.height * zoom) / 100,
  };

  // Mobile toolbar buttons with larger touch targets
  const MobileToolButton = ({
    icon: Icon,
    label,
    onClick,
    active = false,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        min-h-[75px] min-w-[75px] p-3 rounded-xl text-sm font-medium
        touch-manipulation select-none shadow-lg
        ${
          active
            ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-emerald-200'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 shadow-gray-200'
        }
        active:scale-90 transition-all duration-200
      `}
    >
      <Icon className="h-8 w-8 mb-2" />
      <span className="text-xs leading-tight text-center">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading mobile designer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p className="mb-2">Error: {error}</p>
          <button
            onClick={fetchInitialData}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-emerald-50 overflow-hidden">
      {/* Mobile Header - More prominent */}
      <div className="bg-emerald-600 text-white p-4 flex-shrink-0 shadow-lg">
        <h1 className="text-xl font-bold">📱 Mobile Label Designer</h1>
        <p className="text-emerald-100">Touch-optimized for mobile screens</p>
        <div className="text-xs text-emerald-200 mt-1">
          Screen:{' '}
          {typeof window !== 'undefined'
            ? `${window.innerWidth}x${window.innerHeight}`
            : 'Loading...'}
        </div>
      </div>

      {/* Mobile Panel Selector - Larger touch targets */}
      <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
        <div className="flex space-x-2">
          {[
            { key: 'tools', label: 'Tools', icon: PlusIcon },
            { key: 'properties', label: 'Properties', icon: CogIcon },
            { key: 'templates', label: 'Templates', icon: Square3Stack3DIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActivePanel(key as any)}
              className={`
                flex-1 flex flex-col items-center py-3 px-4 rounded-xl text-sm font-medium
                min-h-[60px] transition-all duration-200 active:scale-95
                ${
                  activePanel === key
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <Icon className="h-6 w-6 mb-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative bg-gray-100 overflow-hidden touch-manipulation">
          {/* Mobile Zoom Controls - Larger and more accessible */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            <button
              onClick={handleMobileZoomIn}
              className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center border-3 border-emerald-600 active:scale-90 transition-transform touch-manipulation"
            >
              <MagnifyingGlassPlusIcon className="h-7 w-7" />
            </button>
            <button
              onClick={handleMobileZoomOut}
              className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center border-3 border-emerald-600 active:scale-90 transition-transform touch-manipulation"
            >
              <MagnifyingGlassMinusIcon className="h-7 w-7" />
            </button>
            <button
              onClick={handleFitToMobile}
              className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center border-3 border-blue-600 active:scale-90 transition-transform touch-manipulation"
            >
              <ArrowsPointingOutIcon className="h-7 w-7" />
            </button>
            <div className="text-xs text-center text-white bg-black bg-opacity-50 rounded px-2 py-1 mt-1">
              {zoom}%
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={canvasRef}
            className="absolute inset-0 flex items-center justify-center touch-manipulation"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
          >
            {selectedMedia && (
              <div
                className="relative bg-white shadow-2xl border-2 border-gray-400 rounded-lg overflow-hidden"
                style={{
                  width: Math.max(scaledCanvasSize.width, 250),
                  height: Math.max(scaledCanvasSize.height, 150),
                  minWidth: '250px',
                  minHeight: '150px',
                  maxWidth: '90vw',
                  maxHeight: '60vh',
                }}
                onTouchStart={e => handleTouchStart(e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Grid overlay for mobile */}
                {showGrid && (
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #6b7280 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                )}

                {/* Canvas Elements */}
                {canvasElements.map(element => (
                  <div
                    key={element.id}
                    className={`
                      absolute cursor-pointer select-none
                      ${selectedElement === element.id ? 'ring-2 ring-emerald-500' : ''}
                      touch-manipulation
                    `}
                    style={{
                      left: (element.x * zoom) / 100,
                      top: (element.y * zoom) / 100,
                      width: (element.width * zoom) / 100,
                      height: (element.height * zoom) / 100,
                      transform: `rotate(${element.rotation || 0}deg)`,
                      zIndex: element.zIndex || 1,
                      minWidth: '30px', // Minimum touch target
                      minHeight: '30px',
                    }}
                    onTouchStart={e => handleTouchStart(e, element.id)}
                  >
                    {/* Element Content */}
                    {element.type === 'text' && (
                      <div
                        className="w-full h-full flex items-center justify-start p-1"
                        style={{
                          fontSize: Math.max(8, ((element.fontSize || 12) * zoom) / 100),
                          fontWeight: element.fontWeight || 'normal',
                          color: element.color || '#000000',
                          backgroundColor: element.backgroundColor || 'transparent',
                          border: element.borderWidth
                            ? `${element.borderWidth}px solid ${element.borderColor}`
                            : 'none',
                          textAlign: (element.textAlign as any) || 'left',
                        }}
                      >
                        {element.content || 'Text'}
                      </div>
                    )}

                    {element.type === 'qr' && element.imageUrl && (
                      <img
                        src={element.imageUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    )}

                    {element.type === 'barcode' && (
                      <div className="w-full h-full bg-white border border-gray-300 flex items-center justify-center text-xs">
                        {element.content || '1234567890'}
                      </div>
                    )}

                    {element.type === 'rectangle' && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.backgroundColor || '#f3f4f6',
                          border: element.borderWidth
                            ? `${element.borderWidth}px solid ${element.borderColor}`
                            : '1px solid #6b7280',
                        }}
                      />
                    )}

                    {element.type === 'image' && element.imageUrl && (
                      <img
                        src={element.imageUrl}
                        alt="Label Image"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Panel */}
        <div className="bg-white border-t-2 border-gray-300 p-4 max-h-56 overflow-y-auto flex-shrink-0 shadow-2xl">
          {activePanel === 'tools' && (
            <div className="grid grid-cols-3 gap-4">
              <MobileToolButton
                icon={ChatBubbleLeftRightIcon}
                label="Add Text"
                onClick={() => addElement('text')}
              />
              <MobileToolButton
                icon={QrCodeIcon}
                label="QR Code"
                onClick={() => addElement('qr')}
              />
              <MobileToolButton
                icon={RectangleGroupIcon}
                label="Barcode"
                onClick={() => addElement('barcode')}
              />
              <MobileToolButton
                icon={PhotoIcon}
                label="Image"
                onClick={() => addElement('image')}
              />
              <MobileToolButton
                icon={RectangleStackIcon}
                label="Rectangle"
                onClick={() => addElement('rectangle')}
              />
              <MobileToolButton
                icon={BeakerIcon}
                label="Nutrition"
                onClick={() => addElement('nutrition-table')}
              />
              <MobileToolButton
                icon={Squares2X2Icon}
                label="Grid"
                onClick={() => setShowGrid(!showGrid)}
                active={showGrid}
              />
              <MobileToolButton
                icon={EyeIcon}
                label="Preview"
                onClick={() => toast.success('Mobile preview ready!')}
              />
              <div className="col-span-3 text-center mt-2">
                <div className="text-sm text-gray-600">
                  Touch elements on canvas to select and edit
                </div>
              </div>
            </div>
          )}

          {activePanel === 'properties' && selectedElement && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Element Properties</h3>
              {(() => {
                const element = canvasElements.find(el => el.id === selectedElement);
                if (!element) return null;

                return (
                  <div className="space-y-2">
                    {element.type === 'text' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Text content"
                          value={element.content || ''}
                          onChange={e => updateElement(element.id, { content: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Font size"
                            value={element.fontSize || 12}
                            onChange={e =>
                              updateElement(element.id, {
                                fontSize: parseInt(e.target.value) || 12,
                              })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <input
                            type="color"
                            value={element.color || '#000000'}
                            onChange={e => updateElement(element.id, { color: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg h-10"
                          />
                        </div>
                      </div>
                    )}

                    {element.type === 'qr' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="QR content"
                          value={element.content || ''}
                          onChange={e => {
                            const content = e.target.value;
                            const imageUrl = `/api/labels/qr/proxy?data=${encodeURIComponent(content)}&size=200&color=000000&bgcolor=ffffff&ecc=H&margin=10`;
                            updateElement(element.id, { content, imageUrl });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteElement(element.id)}
                        className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm"
                      >
                        <TrashIcon className="h-4 w-4 inline mr-1" />
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedElement(null)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm"
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activePanel === 'templates' && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Label Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                  Food Label
                </button>
                <button className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  Price Tag
                </button>
                <button className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
                  Delivery Label
                </button>
                <button className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                  Custom
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-emerald-600 text-white px-4 py-3 text-sm flex justify-between items-center flex-shrink-0 shadow-inner">
        <span className="font-medium">Zoom: {zoom}%</span>
        <span className="font-medium">Elements: {canvasElements.length}</span>
        <span className="font-medium">{selectedElement ? '✓ Selected' : 'Touch to select'}</span>
      </div>
    </div>
  );
}
