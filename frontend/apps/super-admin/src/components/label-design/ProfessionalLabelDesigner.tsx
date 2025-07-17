"use client";

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
  Squares2X2Icon
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
    gaps: { x: number; y: number; };
    margins: { top: number; bottom: number; left: number; right: number; };
  };
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: { name: string; };
  nutritionData?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sodium: string;
  };
}

interface LabelTemplate {
  id?: number;
  name: string;
  description: string;
  type: string;
  mediaId: number;
  templateJson: {
    elements: CanvasElement[];
    labelSettings: {
      backgroundColor: string;
      borderStyle: string;
      borderWidth: number;
      borderColor: string;
    };
  };
}

export function ProfessionalLabelDesigner() {
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
  const [dragMode, setDragMode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(150); // Start with better zoom for visibility
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  // Drag state for elements
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragElementStartPos, setDragElementStartPos] = useState({ x: 0, y: 0 });
  
  // Template state
  const [templateName, setTemplateName] = useState('');
  
  // QR Code state
  const [qrCodeType, setQrCodeType] = useState<'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'whatsapp'>('url');
  const [qrCodeContent, setQrCodeContent] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateType, setTemplateType] = useState('price_tag');

  // Industry standard QR code generators
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
        // WiFi format: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
        const [ssid, password] = content.split('|');
        return `WIFI:T:WPA;S:${ssid};P:${password || ''};H:false;;`;
      case 'vcard':
        // vCard format: BEGIN:VCARD\nVERSION:3.0\nFN:Name\nTEL:Phone\nEMAIL:Email\nEND:VCARD
        const [name, phone, email] = content.split('|');
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone || ''}\nEMAIL:${email || ''}\nEND:VCARD`;
      case 'text':
      default:
        return content;
    }
  };
  const [previewMode, setPreviewMode] = useState(false);
  
  // UI state
  const [activeToolbar, setActiveToolbar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeElementStartState, setResizeElementStartState] = useState<{ 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
  }>({ x: 0, y: 0, width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update canvas size when media changes
  useEffect(() => {
    if (selectedMedia && selectedMedia.dimensions) {
      console.log('🔍 ProfessionalLabelDesigner selectedMedia:', selectedMedia);
      const { labelWidth, labelHeight } = selectedMedia.dimensions;
      setCanvasSize({
        width: mmToPx(labelWidth),
        height: mmToPx(labelHeight)
      });
      console.log(`📐 Canvas size updated: ${labelWidth}×${labelHeight}mm → ${mmToPx(labelWidth)}×${mmToPx(labelHeight)}px`);
    } else {
      console.warn('⚠️ selectedMedia or selectedMedia.dimensions is undefined:', selectedMedia);
    }
  }, [selectedMedia]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [mediaResponse, productsResponse, imagesResponse, companyResponse] = await Promise.all([
        fetch('/api/labels/media-types'),
        fetch('/api/products'),
        fetch('/api/image-management/images'),
        fetch('/api/company-management/companies')
      ]);

      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        if (mediaData.success) {
          // Map backend response to frontend interface - same mapping as MediaTemplateManager
          const mappedMediaTypes = mediaData.data.map((media: any) => ({
            id: media.id,
            name: media.name,
            code: media.productCode, // Map productCode to code
            dimensions: {
              pageWidth: media.physicalProperties.pageWidth,
              pageHeight: media.physicalProperties.pageHeight,
              labelWidth: media.physicalProperties.labelWidth,
              labelHeight: media.physicalProperties.labelHeight,
              columns: media.physicalProperties.labelsPerRow, // Map labelsPerRow to columns
              rows: media.physicalProperties.labelsPerColumn, // Map labelsPerColumn to rows
              marginTop: media.physicalProperties.marginTop,
              marginLeft: media.physicalProperties.marginLeft,
              spacingX: media.physicalProperties.horizontalSpacing, // Map horizontalSpacing to spacingX
              spacingY: media.physicalProperties.verticalSpacing // Map verticalSpacing to spacingY
            },
            orientation: media.orientation,
            description: media.description,
            manufacturer: media.manufacturer,
            isActive: media.isActive
          }));
          setMediaTypes(mappedMediaTypes);
          if (mappedMediaTypes.length > 0) {
            setSelectedMedia(mappedMediaTypes[0]);
          }
        }
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (productsData.success && productsData.data) {
          setProducts(productsData.data);
          if (productsData.data.length > 0) {
            setSelectedProduct(productsData.data[0]);
          }
        }
      }

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        console.log('🖼️ Images Response:', imagesData);
        
        // Handle different response formats and ensure proper URL construction
        let imageList: any[] = [];
        if (imagesData.images && Array.isArray(imagesData.images)) {
          console.log('✅ Setting images from images wrapper:', imagesData.images);
          imageList = imagesData.images;
        } else if (imagesData.success && imagesData.data) {
          console.log('✅ Setting images from success wrapper:', imagesData.data);
          imageList = imagesData.data;
        } else if (Array.isArray(imagesData)) {
          console.log('✅ Setting images from direct array:', imagesData);
          imageList = imagesData;
        } else {
          console.log('📷 No images found or unexpected format, setting empty array');
          imageList = [];
        }

        // Ensure all images have proper URLs for serving
        const processedImages = imageList.map((image: any) => ({
          ...image,
          url: image.url && image.url.startsWith('/api/') 
            ? image.url 
            : `/api/image-management/serve/${image.filename}`
        }));
        
        console.log('🔧 Processed images with proper URLs:', processedImages);
        setAvailableImages(processedImages);
      }

      if (companyResponse.ok) {
        const companyResponse_data = await companyResponse.json();
        // Handle both success wrapper and direct array response
        if (Array.isArray(companyResponse_data) && companyResponse_data.length > 0) {
          setCompanyData(companyResponse_data[0]); // Use first company from direct array
        } else if (companyResponse_data.success && companyResponse_data.data && companyResponse_data.data.length > 0) {
          setCompanyData(companyResponse_data.data[0]); // Use first company from wrapped response
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load designer data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-populate company and product data
  const addCompanyLogo = () => {
    console.log('🏢 Adding company logo, company data:', companyData);
    if (companyData?.logo_url) {
      const logoElement: CanvasElement = {
        id: `logo_${Date.now()}`,
        type: 'image',
        x: 20,
        y: 20,
        width: 60,
        height: 40,
        content: 'Company Logo',
        imageUrl: companyData.logo_url,
        companyData: companyData
      };
      setCanvasElements(prev => [...prev, logoElement]);
      console.log('✅ Company logo added to canvas');
    } else {
      console.warn('⚠️ No logo URL found in company data');
      setError('No company logo available');
    }
  };

  const addCompanyInfo = () => {
    console.log('🏢 Adding company info, company data:', companyData);
    if (companyData) {
      const companyNameElement: CanvasElement = {
        id: `company_name_${Date.now()}`,
        type: 'text',
        x: 100,
        y: 25,
        width: 150,
        height: 25,
        content: companyData.name || 'Company Name',
        fontSize: 16,
        fontWeight: 'bold',
        companyData: companyData
      };
      
      const licenseElement: CanvasElement = {
        id: `license_${Date.now()}`,
        type: 'text',
        x: 100,
        y: 50,
        width: 150,
        height: 20,
        content: `FSSAI: ${companyData.fssaiLicense || 'N/A'}`,
        fontSize: 10,
        companyData: companyData
      };
      
      setCanvasElements(prev => [...prev, companyNameElement, licenseElement]);
      console.log('✅ Company info added to canvas');
    } else {
      console.warn('⚠️ No company data available');
      setError('No company data available');
    }
  };

  const addProductNutrition = () => {
    console.log('🍃 Adding product nutrition table');
    
    const nutritionElement: CanvasElement = {
      id: `nutrition_${Date.now()}`,
      type: 'nutrition-table',
      x: 50,
      y: 50,
      width: 180,
      height: 300,
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
      nutritionData: selectedProduct
    };
    
    setCanvasElements(prev => [...prev, nutritionElement]);
    setSelectedElement(nutritionElement.id);
    console.log('✅ Product nutrition table added to canvas');
    toast.success('Nutrition table added to canvas');
  };

  // Canvas operations
  const addElement = useCallback((type: CanvasElement['type']) => {
    console.log(`🎯 Adding ${type} element to canvas`);
    
    const newElement: CanvasElement = {
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: 20 + (canvasElements.length * 10), // Stagger new elements
      y: 20 + (canvasElements.length * 10),
      width: type === 'text' ? 150 : type === 'qr' ? 60 : type === 'barcode' ? 120 : type === 'image' ? 80 : 100,
      height: type === 'text' ? 30 : type === 'qr' ? 60 : type === 'barcode' ? 40 : type === 'image' ? 80 : 25,
      content: type === 'text' ? 'Sample Text' : 
               type === 'qr' ? 'https://leafyhealth.com' : // Default to functional website URL
               type === 'barcode' ? '1234567890' : 
               type === 'image' ? 'image.jpg' : 'Element',
      placeholder: type === 'text' ? '{{PRODUCT_NAME}}' : undefined,
      fontSize: type === 'text' ? 14 : 12,
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left',
      backgroundColor: type === 'rectangle' ? '#f3f4f6' : 'transparent',
      borderColor: '#374151',
      borderWidth: type === 'rectangle' ? 1 : 0,
      rotation: 0,
      opacity: 1,
      zIndex: canvasElements.length + 1,
      qrType: type === 'qr' ? 'url' : undefined // Set QR type for functional web links
    };

    setCanvasElements(prev => {
      const updated = [...prev, newElement];
      console.log(`✅ Canvas elements updated. Total: ${updated.length}`);
      console.log('✅ New element details:', newElement);
      return updated;
    });
    setSelectedElement(newElement.id);
    console.log(`🎯 Element ${newElement.id} selected`);
  }, [canvasElements.length]);

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev =>
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const deleteElement = (id: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (id: string) => {
    const element = canvasElements.find(el => el.id === id);
    if (element) {
      const duplicated: CanvasElement = {
        ...element,
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: element.x + 10,
        y: element.y + 10,
        zIndex: canvasElements.length
      };
      setCanvasElements(prev => [...prev, duplicated]);
      setSelectedElement(duplicated.id);
    }
  };

  // Template operations
  const saveTemplate = async () => {
    if (!templateName || !selectedMedia) {
      setError('Template name and media type are required');
      return;
    }

    try {
      setLoading(true);
      const templateData: LabelTemplate = {
        name: templateName,
        description: templateDescription,
        type: templateType,
        mediaId: selectedMedia.id,
        templateJson: {
          elements: canvasElements,
          labelSettings: {
            backgroundColor: '#ffffff',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000000'
          }
        }
      };

      const response = await fetch('/api/labels/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...templateData,
          createdBy: 1,
          companyId: 1,
          branchId: 1
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setError(null);
          toast.success('Template saved successfully!');
          console.log('✅ Template saved successfully:', result);
          // Reset form
          setTemplateName('');
          setTemplateDescription('');
          setCanvasElements([]);
          setSelectedElement(null);
        } else {
          const errorMessage = result.message || result.error || 'Failed to save template';
          setError(errorMessage);
          toast.error(errorMessage);
          console.error('❌ Template save failed:', result);
        }
      } else {
        const errorText = `Failed to save template (${response.status}: ${response.statusText})`;
        setError(errorText);
        toast.error(errorText);
        console.error('❌ Template save HTTP error:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  // Preview with real data
  const generatePreview = async () => {
    if (!selectedProduct || canvasElements.length === 0) {
      setError('Select a product and add elements to preview');
      return;
    }

    try {
      setPreviewMode(true);
      // Here you could fetch real preview data from the backend
      // For now, we'll simulate placeholder replacement
      setTimeout(() => setPreviewMode(false), 3000);
    } catch (err) {
      console.error('Error generating preview:', err);
      setError('Failed to generate preview');
    }
  };

  // Text editing handlers
  const handleDoubleClick = (elementId: string) => {
    console.log(`🎯 Double-click detected on element ${elementId}`);
    setEditingElementId(elementId);
  };

  const handleTextEditComplete = (elementId: string, newContent: string) => {
    console.log(`✅ Text edit complete for ${elementId}: "${newContent}"`);
    updateElement(elementId, { content: newContent });
    setEditingElementId(null);
  };

  const handleTextEditCancel = () => {
    console.log('❌ Text edit cancelled');
    setEditingElementId(null);
  };

  // Render canvas element
  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement === element.id;
    const isEditing = editingElementId === element.id;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      opacity: element.opacity,
      zIndex: element.zIndex,
      border: isSelected ? '2px dashed #2563eb' : element.borderWidth ? 
        `${element.borderWidth}px solid ${element.borderColor}` : 'none',
      backgroundColor: element.backgroundColor !== 'transparent' ? element.backgroundColor : undefined,
      cursor: 'move',
      userSelect: 'none'
    };

    const content = previewMode && element.placeholder && selectedProduct ? 
      replaceProductPlaceholder(element.placeholder, selectedProduct) : 
      element.content;

    return (
      <div
        key={element.id}
        style={style}
        onClick={() => setSelectedElement(element.id)}
        onDoubleClick={() => element.type === 'text' && handleDoubleClick(element.id)}
        className={`canvas-element ${isSelected ? 'selected' : ''}`}
      >
        {element.type === 'text' && (
          <>
            {isEditing ? (
              <input
                type="text"
                defaultValue={element.content}
                autoFocus
                onBlur={(e) => handleTextEditComplete(element.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTextEditComplete(element.id, e.currentTarget.value);
                  } else if (e.key === 'Escape') {
                    handleTextEditCancel();
                  }
                }}
                style={{
                  fontSize: element.fontSize,
                  fontWeight: element.fontWeight,
                  fontFamily: element.fontFamily,
                  textAlign: element.textAlign as any,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '2px',
                  color: 'inherit'
                }}
                className="canvas-text-editor"
              />
            ) : (
              <div
                style={{
                  fontSize: element.fontSize,
                  fontWeight: element.fontWeight,
                  fontFamily: element.fontFamily,
                  textAlign: element.textAlign as any,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  overflow: 'hidden'
                }}
              >
                {content}
              </div>
            )}
          </>
        )}
        
        {element.type === 'qr' && (
          <div className="w-full h-full bg-white border flex items-center justify-center relative">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(content || 'QR-CODE-DATA')}`}
              alt="QR Code"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={() => {
                // QR code failed to load - fallback is already handled by conditional rendering
              }}
            />
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-xs" style={{display: 'none'}}>
              QR: {content}
            </div>
          </div>
        )}
        
        {element.type === 'barcode' && (
          <div className="w-full h-full bg-white border flex flex-col items-center justify-center text-xs">
            <div className="flex-1 w-full flex items-center justify-center">
              <div className="w-full h-8 bg-white flex items-center justify-center" style={{
                background: `repeating-linear-gradient(
                  90deg,
                  #000 0px,
                  #000 2px,
                  #fff 2px,
                  #fff 3px,
                  #000 3px,
                  #000 4px,
                  #fff 4px,
                  #fff 6px
                )`
              }}>
              </div>
            </div>
            <div className="text-xs font-mono mt-1" style={{fontSize: '8px'}}>
              {content}
            </div>
          </div>
        )}
        
        {element.type === 'rectangle' && (
          <div className="w-full h-full border border-gray-400"></div>
        )}
        
        {element.type === 'image' && (
          <div className="w-full h-full bg-gray-100 border flex items-center justify-center relative">
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt="Label Image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={() => {
                  // Image failed to load - fallback is already handled by conditional rendering
                }}
              />
            ) : null}
            <div 
              className="absolute inset-0 bg-gray-100 flex items-center justify-center text-xs cursor-pointer"
              style={{display: element.imageUrl ? 'none' : 'flex'}}
              onClick={(e) => {
                e.stopPropagation();
                setActiveToolbar('image');
                setSelectedElement(element.id);
              }}
            >
              📷 Click to browse
            </div>
          </div>
        )}
      </div>
    );
  };

  // Replace product placeholders
  const replaceProductPlaceholder = (placeholder: string, product: Product): string => {
    return placeholder
      .replace('{{PRODUCT_NAME}}', product.name)
      .replace('{{SKU}}', product.sku)
      .replace('{{PRICE}}', `₹${product.price}`)
      .replace('{{CATEGORY}}', product.category?.name || '');
  };

  // Zoom and pan controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 500)); // Max 500%
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25)); // Min 25%
  };

  const handleZoomReset = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFitToWindow = () => {
    if (selectedMedia && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const canvasWidth = mmToPx(selectedMedia.dimensions.labelWidth);
        const canvasHeight = mmToPx(selectedMedia.dimensions.labelHeight);
        
        // Calculate zoom to fit with padding
        const padding = 100; // 50px padding on each side
        const zoomX = ((containerRect.width - padding) / canvasWidth) * 100;
        const zoomY = ((containerRect.height - padding) / canvasHeight) * 100;
        const newZoom = Math.min(zoomX, zoomY, 300); // Max 300% for fit
        
        setZoom(Math.max(newZoom, 25));
        setPanOffset({ x: 0, y: 0 });
      }
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(25, Math.min(500, newZoom)));
  };

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle click or Ctrl+left click
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -25 : 25;
      setZoom(prev => Math.max(25, Math.min(500, prev + delta)));
    }
  };

  // Event listeners for pan functionality
  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Calculate scaled canvas dimensions
  const scaledCanvasSize = {
    width: (canvasSize.width * zoom) / 100,
    height: (canvasSize.height * zoom) / 100
  };

  // Initialize fit to window on media change
  useEffect(() => {
    if (selectedMedia) {
      // Small delay to allow canvas to render
      setTimeout(() => {
        handleFitToWindow();
      }, 100);
    }
  }, [selectedMedia]);

  // Professional keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
          case '1':
            e.preventDefault();
            handleFitToWindow();
            break;
          default:
            break;
        }
      }
      
      // Element shortcuts
      if (selectedElement && !editingElementId) { // Don't handle delete when editing text
        switch (e.key) {
          case 'Delete':
            e.preventDefault();
            deleteElement(selectedElement);
            break;
          case 'Backspace':
            // Only delete element if not editing text and no input is focused
            if (document.activeElement?.tagName !== 'INPUT' && 
                document.activeElement?.tagName !== 'TEXTAREA') {
              e.preventDefault();
              deleteElement(selectedElement);
            }
            break;
          case 'd':
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              duplicateElement(selectedElement);
            }
            break;
          default:
            break;
        }
      }
      
      // Grid toggle
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrid(!showGrid);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, showGrid]);

  // Element drag handlers
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (editingElementId) return; // Don't drag while editing
    
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;
    
    setSelectedElement(elementId);
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragElementStartPos({ x: element.x, y: element.y });
    
    console.log(`🎯 Starting drag for element ${elementId}`);
  };

  const handleElementMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedElement) return;
    
    const deltaX = (e.clientX - dragStartPos.x) / (zoom / 100);
    const deltaY = (e.clientY - dragStartPos.y) / (zoom / 100);
    
    const newX = dragElementStartPos.x + deltaX;
    const newY = dragElementStartPos.y + deltaY;
    
    setCanvasElements(prev =>
      prev.map(el =>
        el.id === selectedElement
          ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
          : el
      )
    );
  }, [isDragging, selectedElement, dragStartPos, dragElementStartPos, zoom]);

  const handleElementMouseUp = useCallback(() => {
    if (isDragging) {
      console.log(`✅ Drag completed for element ${selectedElement}`);
      setIsDragging(false);
    }
  }, [isDragging, selectedElement]);

  // Drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleElementMouseMove);
      document.addEventListener('mouseup', handleElementMouseUp);
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleElementMouseMove);
        document.removeEventListener('mouseup', handleElementMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [isDragging, handleElementMouseMove, handleElementMouseUp]);

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, elementId: string, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeElementStartState({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    });
    
    console.log(`🔧 Starting resize for element ${elementId} with handle ${handle}`);
  };
  
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !selectedElement) return;
    
    const deltaX = (e.clientX - resizeStartPos.x) / (zoom / 100);
    const deltaY = (e.clientY - resizeStartPos.y) / (zoom / 100);
    
    setCanvasElements(prev =>
      prev.map(el => {
        if (el.id !== selectedElement) return el;
        
        let newX = resizeElementStartState.x;
        let newY = resizeElementStartState.y;
        let newWidth = resizeElementStartState.width;
        let newHeight = resizeElementStartState.height;
        
        switch (resizeHandle) {
          case 'se': // Bottom Right
            newWidth = Math.max(20, resizeElementStartState.width + deltaX);
            newHeight = Math.max(20, resizeElementStartState.height + deltaY);
            break;
          case 'sw': // Bottom Left
            newX = resizeElementStartState.x + deltaX;
            newWidth = Math.max(20, resizeElementStartState.width - deltaX);
            newHeight = Math.max(20, resizeElementStartState.height + deltaY);
            break;
          case 'ne': // Top Right
            newY = resizeElementStartState.y + deltaY;
            newWidth = Math.max(20, resizeElementStartState.width + deltaX);
            newHeight = Math.max(20, resizeElementStartState.height - deltaY);
            break;
          case 'nw': // Top Left
            newX = resizeElementStartState.x + deltaX;
            newY = resizeElementStartState.y + deltaY;
            newWidth = Math.max(20, resizeElementStartState.width - deltaX);
            newHeight = Math.max(20, resizeElementStartState.height - deltaY);
            break;
          case 'n': // Top
            newY = resizeElementStartState.y + deltaY;
            newHeight = Math.max(20, resizeElementStartState.height - deltaY);
            break;
          case 's': // Bottom
            newHeight = Math.max(20, resizeElementStartState.height + deltaY);
            break;
          case 'e': // Right
            newWidth = Math.max(20, resizeElementStartState.width + deltaX);
            break;
          case 'w': // Left
            newX = resizeElementStartState.x + deltaX;
            newWidth = Math.max(20, resizeElementStartState.width - deltaX);
            break;
        }
        
        return { ...el, x: newX, y: newY, width: newWidth, height: newHeight };
      })
    );
  }, [isResizing, selectedElement, resizeStartPos, resizeElementStartState, resizeHandle, zoom]);
  
  const handleResizeEnd = useCallback(() => {
    if (isResizing) {
      console.log(`✅ Resize completed for element ${selectedElement}`);
      setIsResizing(false);
    }
  }, [isResizing, selectedElement]);
  
  // Resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = resizeHandle.includes('e') && resizeHandle.includes('w') ? 'ew-resize' :
        resizeHandle.includes('n') && resizeHandle.includes('s') ? 'ns-resize' :
        resizeHandle.includes('ne') || resizeHandle.includes('sw') ? 'nesw-resize' :
        resizeHandle.includes('nw') || resizeHandle.includes('se') ? 'nwse-resize' :
        resizeHandle === 'n' || resizeHandle === 's' ? 'ns-resize' :
        resizeHandle === 'e' || resizeHandle === 'w' ? 'ew-resize' : 'default';
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = 'default';
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd, resizeHandle]);

  // Fix renderElement to properly handle scaling with drag functionality
  const renderScaledElement = (element: CanvasElement) => {
    const isSelected = selectedElement === element.id;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      opacity: element.opacity,
      zIndex: element.zIndex,
      border: isSelected ? '2px dashed #2563eb' : element.borderWidth ? 
        `${element.borderWidth}px solid ${element.borderColor}` : 'none',
      backgroundColor: element.backgroundColor !== 'transparent' ? element.backgroundColor : undefined,
      cursor: isDragging ? 'grabbing' : 'move',
      userSelect: 'none',
      pointerEvents: 'auto'
    };

    const content = previewMode && element.placeholder && selectedProduct ? 
      replaceProductPlaceholder(element.placeholder, selectedProduct) : 
      element.content;

    return (
      <div
        key={element.id}
        style={style}
        onMouseDown={(e) => handleElementMouseDown(e, element.id)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element.id);
        }}
        className={`canvas-element ${isSelected ? 'selected' : ''}`}
      >
        {element.type === 'text' && (
          editingElementId === element.id ? (
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => {
                setCanvasElements(prev => 
                  prev.map(el => 
                    el.id === element.id 
                      ? { ...el, content: e.target.value }
                      : el
                  )
                );
              }}
              onBlur={() => setEditingElementId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingElementId(null);
                } else if (e.key === 'Escape') {
                  setEditingElementId(null);
                }
              }}
              autoFocus
              style={{
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                fontFamily: element.fontFamily,
                textAlign: element.textAlign as any,
                width: '100%',
                height: '100%',
                padding: '2px',
                border: 'none',
                outline: 'none',
                background: 'white',
                color: element.color || '#000000'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              style={{
                fontSize: element.fontSize,
                fontWeight: element.fontWeight,
                fontFamily: element.fontFamily,
                textAlign: element.textAlign as any,
                color: element.color || '#000000',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                overflow: 'hidden',
                lineHeight: '1.2',
                cursor: 'text'
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingElementId(element.id);
              }}
            >
              {content || 'Click to edit text'}
            </div>
          )
        )}
        
        {element.type === 'qr' && (
          <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
            {content ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(content)}&format=png&margin=0`}
                alt="QR Code"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }}
                onError={(e) => {
                  console.error('QR code generation failed:', content);
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50"
                onDoubleClick={() => setEditingElementId(element.id)}
              >
                <div className="text-center">
                  <QrCodeIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Double-click to add QR content</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {element.type === 'barcode' && (
          <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
            {content ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-3/4 flex items-center justify-center px-2">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* CSS-based barcode visualization */}
                    <div className="flex h-full items-center" style={{ gap: '2px' }}>
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: i % 2 === 0 ? '3px' : i % 3 === 0 ? '5px' : '2px',
                            height: '100%'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center mt-1">{content}</div>
              </div>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50"
                onDoubleClick={() => setEditingElementId(element.id)}
              >
                <div className="text-center">
                  <Square3Stack3DIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Double-click to add barcode</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {element.type === 'rectangle' && (
          <div className="w-full h-full border border-gray-400 bg-transparent"></div>
        )}
        
        {element.type === 'image' && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center border border-gray-400 relative">
            {element.imageUrl ? (
              <img 
                src={element.imageUrl}
                alt="Label Image"
                className="max-w-full max-h-full object-contain"
                style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <div className="text-xs text-gray-500 text-center p-2">
                Double-click to select image
              </div>
            )}
            {isSelected && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 cursor-pointer"
                onDoubleClick={() => setActiveToolbar('image-selector')}
              >
                <PhotoIcon className="w-6 h-6 text-blue-600" />
              </div>
            )}
          </div>
        )}
        
        {element.type === 'nutrition-table' && (
          <div className="w-full h-full bg-white border-2 border-black p-2 overflow-auto">
            <div className="text-center mb-1">
              <h3 className="font-bold text-base">Nutrition Facts</h3>
              <p className="text-xs">8 servings per container</p>
              <p className="text-xs font-semibold">Serving size (500g)</p>
            </div>
            <div className="border-t-8 border-black my-1"></div>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="font-bold pb-1">Amount per serving</td>
                  <td></td>
                </tr>
                <tr className="border-t border-black">
                  <td className="font-bold text-lg">Calories</td>
                  <td className="text-right font-bold text-lg">250</td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-right text-xs border-t-4 border-black">% Daily Value*</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td><b>Total Fat</b> 10g</td>
                  <td className="text-right">15%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="pl-4">Saturated Fat 2g</td>
                  <td className="text-right">7%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="pl-4">Trans Fat 0g</td>
                  <td></td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td><b>Cholesterol</b> 0mg</td>
                  <td className="text-right">0%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td><b>Sodium</b> 100mg</td>
                  <td className="text-right">5%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td><b>Total Carbohydrate</b> 30g</td>
                  <td className="text-right">10%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="pl-4">Dietary Fiber 2g</td>
                  <td className="text-right">11%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="pl-4">Total Sugars 1g</td>
                  <td></td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="pl-6">Incl. Added Sugars 5g</td>
                  <td className="text-right">25%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td><b>Protein</b> 5g</td>
                  <td></td>
                </tr>
                <tr className="border-t-4 border-black">
                  <td>Vitamin A 2mcg</td>
                  <td className="text-right">8%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td>Vitamin C 5mcg</td>
                  <td className="text-right">15%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td>Calcium 200mg</td>
                  <td className="text-right">20%</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td>Iron 10mg</td>
                  <td className="text-right">40%</td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-black mt-1 pt-1 text-xs">
              <p>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</p>
            </div>
          </div>
        )}
        
        {/* Resize handles */}
        {isSelected && !editingElementId && (
          <>
            {/* Top Left */}
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-nw-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'nw')}
            />
            {/* Top Right */}
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-ne-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'ne')}
            />
            {/* Bottom Left */}
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-sw-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'sw')}
            />
            {/* Bottom Right */}
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-se-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'se')}
            />
            {/* Top Middle */}
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-n-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'n')}
            />
            {/* Bottom Middle */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-s-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 's')}
            />
            {/* Left Middle */}
            <div 
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-w-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'w')}
            />
            {/* Right Middle */}
            <div 
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-e-resize hover:scale-125 transition-transform"
              onMouseDown={(e) => handleResizeStart(e, element.id, 'e')}
            />
          </>
        )}
      </div>
    );
  };

  // Render toolbar
  const renderToolbar = () => (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-medium text-gray-900">Professional Label Designer</h3>
        <span className="text-sm text-gray-500">
          {selectedMedia ? `${selectedMedia.name} (${selectedMedia.dimensions.labelWidth}×${selectedMedia.dimensions.labelHeight}mm)` : 'Select Media Type'}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('🎯 Text button clicked');
              addElement('text');
            }}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
            Text
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('🎯 QR Code button clicked');
              setQrCodeContent('');
              setQrCodeType('url');
              setActiveToolbar('qr-selector');
            }}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <QrCodeIcon className="w-4 h-4 mr-1" />
            QR Code
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('🎯 Barcode button clicked');
              addElement('barcode');
            }}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Square3Stack3DIcon className="w-4 h-4 mr-1" />
            Barcode
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('🎯 Image button clicked');
              addElement('image');
            }}
            className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors active:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <PhotoIcon className="w-4 h-4 mr-1" />
            Image
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('🎯 Rectangle button clicked');
              addElement('rectangle');
            }}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <RectangleGroupIcon className="w-4 h-4 mr-1" />
            Rectangle
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-200 rounded"
              title="Zoom Out (Ctrl + Scroll)"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-1">
              <input
                type="range"
                min="25"
                max="500"
                step="25"
                value={zoom}
                onChange={(e) => handleZoomChange(parseInt(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">{zoom}%</span>
            </div>
            
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-200 rounded"
              title="Zoom In (Ctrl + Scroll)"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="w-px h-4 bg-gray-300"></div>
            
            <button
              onClick={handleZoomReset}
              className="p-1 hover:bg-gray-200 rounded text-xs font-medium text-gray-600"
              title="Reset Zoom (100%)"
            >
              1:1
            </button>
            
            <button
              onClick={handleFitToWindow}
              className="p-1 hover:bg-gray-200 rounded"
              title="Fit to Window"
            >
              <ArrowsPointingOutIcon className="w-4 h-4 text-gray-600" />
            </button>
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1 hover:bg-gray-200 rounded ${showGrid ? 'text-blue-600' : 'text-gray-600'}`}
              title="Toggle Grid"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={generatePreview}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Preview
            </button>
            
            <button
              onClick={saveTemplate}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render properties panel
  const renderPropertiesPanel = () => {
    const element = canvasElements.find(el => el.id === selectedElement);
    if (!element) return null;

    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Element Properties</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => updateElement(element.id, { content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {element.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <select
                value={element.placeholder || ''}
                onChange={(e) => updateElement(element.id, { placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No placeholder</option>
                <option value="{{PRODUCT_NAME}}">Product Name</option>
                <option value="{{SKU}}">SKU</option>
                <option value="{{PRICE}}">Price</option>
                <option value="{{CATEGORY}}">Category</option>
              </select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X (mm)</label>
              <input
                type="number"
                value={Math.round(pxToMm(element.x) * 10) / 10}
                onChange={(e) => updateElement(element.id, { x: mmToPx(parseFloat(e.target.value) || 0) })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Y (mm)</label>
              <input
                type="number"
                value={Math.round(pxToMm(element.y) * 10) / 10}
                onChange={(e) => updateElement(element.id, { y: mmToPx(parseFloat(e.target.value) || 0) })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
              <input
                type="number"
                value={Math.round(pxToMm(element.width) * 10) / 10}
                onChange={(e) => updateElement(element.id, { width: mmToPx(parseFloat(e.target.value) || 0) })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (mm)</label>
              <input
                type="number"
                value={Math.round(pxToMm(element.height) * 10) / 10}
                onChange={(e) => updateElement(element.id, { height: mmToPx(parseFloat(e.target.value) || 0) })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          {element.type === 'text' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={element.fontSize || 12}
                    onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) || 12 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="6"
                    max="72"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={element.color || '#000000'}
                      onChange={(e) => updateElement(element.id, { color: e.target.value })}
                      className="w-12 h-9 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={element.color || '#000000'}
                      onChange={(e) => updateElement(element.id, { color: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  value={element.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                  <option value="Impact, sans-serif">Impact</option>
                  <option value="'Lucida Console', monospace">Lucida Console</option>
                  <option value="Tahoma, sans-serif">Tahoma</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                  <select
                    value={element.fontWeight || 'normal'}
                    onChange={(e) => updateElement(element.id, { fontWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                  <select
                    value={element.textAlign || 'left'}
                    onChange={(e) => updateElement(element.id, { textAlign: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          {/* Background Color for all elements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={element.backgroundColor || '#ffffff'}
                onChange={(e) => updateElement(element.id, { backgroundColor: e.target.value })}
                className="w-12 h-9 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.backgroundColor || '#ffffff'}
                onChange={(e) => updateElement(element.id, { backgroundColor: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
          
          {/* Border settings */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
              <input
                type="number"
                value={element.borderWidth || 0}
                onChange={(e) => updateElement(element.id, { borderWidth: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                min="0"
                max="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
              <input
                type="color"
                value={element.borderColor || '#000000'}
                onChange={(e) => updateElement(element.id, { borderColor: e.target.value })}
                className="w-full h-9 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => duplicateElement(element.id)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowsRightLeftIcon className="w-4 h-4 mr-1" />
              Duplicate
            </button>
            
            <button
              onClick={() => deleteElement(element.id)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Label Designer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      {renderToolbar()}
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Controls */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <select
                value={selectedMedia?.id || ''}
                onChange={(e) => {
                  const media = mediaTypes.find(m => m.id === parseInt(e.target.value));
                  setSelectedMedia(media || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Media Type</option>
                {mediaTypes.map((media, index) => (
                  <option key={`media-${media.id}-${index}`} value={media.id}>
                    {media.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview Product</label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === parseInt(e.target.value));
                  setSelectedProduct(product || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Preview Product</option>
                {products.map((product, index) => (
                  <option key={`product-${product.id}-${index}`} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price_tag">Price Tag</option>
                <option value="product_label">Product Label</option>
                <option value="barcode_label">Barcode Label</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            {/* Smart Data Integration */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Smart Data Integration</label>
              <div className="space-y-2">
                <button
                  onClick={addCompanyLogo}
                  disabled={!companyData?.logo_url}
                  className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {companyData?.logo_url ? 'Add Company Logo' : 'No Logo Available'}
                </button>
                
                <button
                  onClick={addCompanyInfo}
                  disabled={!companyData}
                  className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {companyData ? 'Add Company Info & License' : 'Loading Company...'}
                </button>
                
                <button
                  onClick={addProductNutrition}
                  disabled={!selectedProduct}
                  className="w-full px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Product Nutrition
                </button>
                
                <button
                  onClick={() => setActiveToolbar('image-selector')}
                  className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Browse Images
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
          {/* Canvas Container with Scroll and Zoom */}
          <div 
            className="flex-1 flex items-center justify-center p-8 overflow-auto cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            style={{
              cursor: isPanning ? 'grabbing' : 'grab'
            }}
          >
            <div 
              className="relative"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                transition: isPanning ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              {/* Professional Canvas with Shadow and Border */}
              <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-300">
                {/* Canvas with Professional Scaling */}
                <div
                  ref={canvasRef}
                  className="relative bg-white"
                  style={{
                    width: scaledCanvasSize.width,
                    height: scaledCanvasSize.height,
                    backgroundImage: showGrid ? 
                      `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)` : 
                      'none',
                    backgroundSize: `${(10 * zoom) / 100}px ${(10 * zoom) / 100}px`,
                    transform: 'translateZ(0)', // Hardware acceleration
                    imageRendering: 'crisp-edges'
                  }}
                >
                  {/* Render all canvas elements with scaling */}
                  {canvasElements.map((element) => {
                    const scaledElement = {
                      ...element,
                      x: (element.x * zoom) / 100,
                      y: (element.y * zoom) / 100,
                      width: (element.width * zoom) / 100,
                      height: (element.height * zoom) / 100,
                      fontSize: element.fontSize ? (element.fontSize * zoom) / 100 : undefined
                    };
                    return renderScaledElement(scaledElement);
                  })}
                  
                  {/* Preview overlay */}
                  {previewMode && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-4 shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Generating Preview...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Canvas Rulers */}
                  <div className="absolute -top-6 left-0 right-0 h-6 bg-gray-100 border-b border-gray-300 flex items-end text-xs text-gray-500">
                    {Array.from({ length: Math.ceil(scaledCanvasSize.width / ((10 * zoom) / 100)) }, (_, i) => (
                      <div 
                        key={i} 
                        className="border-l border-gray-400" 
                        style={{ 
                          width: (10 * zoom) / 100,
                          height: i % 5 === 0 ? '100%' : '50%'
                        }}
                      >
                        {i % 5 === 0 && <span className="ml-1">{i * 2}</span>}
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute -left-6 top-0 bottom-0 w-6 bg-gray-100 border-r border-gray-300 flex flex-col justify-end text-xs text-gray-500">
                    {Array.from({ length: Math.ceil(scaledCanvasSize.height / ((10 * zoom) / 100)) }, (_, i) => (
                      <div 
                        key={i} 
                        className="border-t border-gray-400 flex items-start" 
                        style={{ 
                          height: (10 * zoom) / 100,
                          width: i % 5 === 0 ? '100%' : '50%',
                          marginLeft: i % 5 === 0 ? '0' : '50%'
                        }}
                      >
                        {i % 5 === 0 && <span className="mt-1 -rotate-90 origin-left text-xs">{i * 2}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Professional Status Bar */}
          <div className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>
                  Canvas: {selectedMedia ? `${selectedMedia.dimensions.labelWidth}×${selectedMedia.dimensions.labelHeight}mm` : 'No media selected'}
                </span>
                <span className={`font-semibold ${canvasElements.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  Elements: {canvasElements.length}
                </span>
                <span>• Zoom: {zoom}%</span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs">
                <span>Pan: Ctrl+Click & Drag | Zoom: Ctrl+Scroll | Shortcuts: Ctrl+0 (Reset), Ctrl+1 (Fit), G (Grid)</span>
                {selectedElement && (
                  <span className="text-blue-600 font-medium">• Element Selected (Del to delete, Ctrl+D to duplicate)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Properties */}
        {selectedElement && renderPropertiesPanel()}
      </div>
      
      {/* Image Selector Modal */}
      {activeToolbar === 'image-selector' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Select Image</h3>
              <button
                onClick={() => setActiveToolbar(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {availableImages.map((image: any) => (
                <div
                  key={image.id}
                  className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (selectedElement) {
                      setCanvasElements(prev => 
                        prev.map(el => 
                          el.id === selectedElement 
                            ? { ...el, imageUrl: image.url, content: image.filename }
                            : el
                        )
                      );
                    } else {
                      const imageElement: CanvasElement = {
                        id: `image_${Date.now()}`,
                        type: 'image',
                        x: 20,
                        y: 80,
                        width: 80,
                        height: 60,
                        content: image.filename,
                        imageUrl: image.url,
                        imageId: image.id
                      };
                      setCanvasElements(prev => [...prev, imageElement]);
                    }
                    setActiveToolbar(null);
                  }}
                >
                  <img 
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => {
                      console.error('Image failed to load:', image.url);
                      const target = e.target as HTMLImageElement;
                      // Set a fallback placeholder image
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAyNEwzOCAzNkg0Nkw0MiAyNFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
                    }}
                  />
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.filename}</p>
                </div>
              ))}
            </div>
            
            {availableImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                <p>No images available. Upload images through Image Management.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Selector Modal */}
      {activeToolbar === 'qr-selector' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create QR Code</h3>
              <button
                onClick={() => setActiveToolbar(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* QR Code Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Type
              </label>
              <select
                value={qrCodeType}
                onChange={(e) => setQrCodeType(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="url">🌐 Website URL</option>
                <option value="text">📝 Plain Text</option>
                <option value="email">📧 Email Address</option>
                <option value="phone">📞 Phone Number</option>
                <option value="sms">💬 SMS Text Message</option>
                <option value="whatsapp">🟢 WhatsApp Message</option>
                <option value="wifi">📶 WiFi Network</option>
                <option value="vcard">👤 Contact Card (vCard)</option>
              </select>
            </div>

            {/* Content Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {qrCodeType === 'url' && 'Website URL (e.g., google.com)'}
                {qrCodeType === 'text' && 'Text Content'}
                {qrCodeType === 'email' && 'Email Address'}
                {qrCodeType === 'phone' && 'Phone Number (e.g., +919876543210)'}
                {qrCodeType === 'sms' && 'Phone Number for SMS'}
                {qrCodeType === 'whatsapp' && 'WhatsApp Number (e.g., 919876543210)'}
                {qrCodeType === 'wifi' && 'Network Name | Password (e.g., MyWiFi|password123)'}
                {qrCodeType === 'vcard' && 'Name | Phone | Email (e.g., John Doe|+919876543210|john@example.com)'}
              </label>
              <input
                type="text"
                value={qrCodeContent}
                onChange={(e) => setQrCodeContent(e.target.value)}
                placeholder={
                  qrCodeType === 'url' ? 'Enter website URL...' :
                  qrCodeType === 'text' ? 'Enter text content...' :
                  qrCodeType === 'email' ? 'Enter email address...' :
                  qrCodeType === 'phone' ? 'Enter phone number...' :
                  qrCodeType === 'sms' ? 'Enter phone number...' :
                  qrCodeType === 'whatsapp' ? 'Enter WhatsApp number...' :
                  qrCodeType === 'wifi' ? 'Enter network|password...' :
                  'Enter name|phone|email...'
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Industry Standard Format Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-1">Generated QR Content:</p>
              <code className="text-xs text-gray-600 break-all">
                {qrCodeContent ? generateQRContent(qrCodeType, qrCodeContent) : 'Enter content above to see preview...'}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveToolbar(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (qrCodeContent.trim()) {
                    const qrElement: CanvasElement = {
                      id: `qr-${Date.now()}`,
                      type: 'qr',
                      x: 20,
                      y: 20,
                      width: 50,
                      height: 50,
                      content: generateQRContent(qrCodeType, qrCodeContent),
                      qrType: qrCodeType,
                      zIndex: canvasElements.length + 1
                    };
                    setCanvasElements(prev => [...prev, qrElement]);
                    setActiveToolbar(null);
                    console.log('✅ QR Code created:', qrElement);
                  }
                }}
                disabled={!qrCodeContent.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}