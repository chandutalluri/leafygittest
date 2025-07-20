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
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { EnhancedQRCodeGenerator } from './EnhancedQRCodeGenerator';
import MultipleBarcodeGenerator from './MultipleBarcodeGenerator';
import NutritionFactsForm from './NutritionFactsForm';
import KonvaNutritionTable from './KonvaNutritionTable';
import AutomaticLabelGenerator from './AutomaticLabelGenerator';
import AutomaticLabelTemplates from './AutomaticLabelTemplates';
import DynamicNutritionFacts from './DynamicNutritionFacts';
import NutritionFactsTemplates from './NutritionFactsTemplates';
import TemplateController from './TemplateController';
import TwoTemplateSystem from './TwoTemplateSystem';

// Utility functions for canvas operations
const mmToPx = (mm: number) => mm * 3.7795275591; // 96 DPI conversion
const pxToMm = (px: number) => px / 3.7795275591;

interface CanvasElement {
  id: string;
  type:
    | 'text'
    | 'barcode'
    | 'qr'
    | 'image'
    | 'rectangle'
    | 'line'
    | 'nutrition-table'
    | 'indian-compliance';
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
  // Properties specific to indian-compliance grouped element
  isGroup?: boolean;
  groupName?: string;
  lineHeight?: number;
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
      cornerRadius: number;
    };
  };
}

interface UnifiedLabelState {
  // Template selection
  selectedMediaType: MediaType | null;
  selectedLabelTemplate: LabelTemplate | null;

  // Canvas state
  canvasElements: CanvasElement[];
  selectedElement: string | null;
  selectedElements: string[];

  // Product/data
  selectedProduct: Product | null;

  // UI state
  activeView: 'design' | 'preview' | 'print';
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Settings
  canvasSettings: {
    showOnlyOneLabel: boolean;
    labelDimensions: { width: number; height: number };
    snapToLabelBounds: boolean;
  };

  // History
  undoStack: CanvasElement[][];
  redoStack: CanvasElement[][];
}

export function ProfessionalLabelDesigner({
  selectedTemplate,
  onTemplateCleared,
  onTemplateSaved,
}: {
  selectedTemplate?: any;
  onTemplateCleared?: () => void;
  onTemplateSaved?: () => void;
} = {}) {
  // State Management - Unified state approach
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'preview' | 'print'>('design');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [templateName, setTemplateName] = useState('');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<LabelTemplate[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);
  const [canvasSettings, setCanvasSettings] = useState({
    showOnlyOneLabel: true,
    labelDimensions: { width: 70, height: 37 },
    snapToLabelBounds: true,
  });

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

  // Unified state update function
  const updateUnifiedState = useCallback((updates: Partial<UnifiedLabelState>) => {
    if (updates.canvasElements !== undefined) {
      setCanvasElements(updates.canvasElements);
    }
    if (updates.selectedElement !== undefined) {
      setSelectedElement(updates.selectedElement);
    }
    if (updates.selectedElements !== undefined) {
      setSelectedElements(updates.selectedElements);
    }
    if (updates.selectedProduct !== undefined) {
      setSelectedProduct(updates.selectedProduct);
    }
    if (updates.zoom !== undefined) {
      setZoom(updates.zoom);
    }
    if (updates.showGrid !== undefined) {
      setShowGrid(updates.showGrid);
    }
    if (updates.snapToGrid !== undefined) {
      setSnapToGrid(updates.snapToGrid);
    }
    if (updates.canvasSettings !== undefined) {
      setCanvasSettings(updates.canvasSettings);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // CRITICAL: Canvas should show ONLY SINGLE LABEL, NOT full sheet
  useEffect(() => {
    if (selectedMedia && selectedMedia.dimensions) {
      const { labelWidth, labelHeight } = selectedMedia.dimensions;

      // ENFORCE SINGLE LABEL CONSTRAINT - Only show label dimensions, NOT page dimensions
      const singleLabelSize = {
        width: mmToPx(labelWidth), // Single label width only
        height: mmToPx(labelHeight), // Single label height only
      };

      setCanvasSize(singleLabelSize);

      // Update unified state with single label constraint
      updateUnifiedState({
        canvasSettings: {
          ...canvasSettings,
          showOnlyOneLabel: true, // CRITICAL: Force single label view
          labelDimensions: { width: labelWidth, height: labelHeight },
          snapToLabelBounds: true,
        },
      });

      console.log(`🎯 Canvas set to SINGLE LABEL: ${labelWidth}×${labelHeight}mm (NOT full sheet)`);
    }
  }, [selectedMedia]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [mediaResponse, productsResponse, templatesResponse] = await Promise.all([
        fetch('/api/labels/media-types'),
        fetch('/api/direct-data/products'),
        fetch('/api/labels/custom-templates'),
      ]);

      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        if (mediaData.success) {
          setMediaTypes(mediaData.data);
          if (mediaData.data.length > 0) {
            setSelectedMedia(mediaData.data[0]);
          }
        }
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const productList = Array.isArray(productsData)
          ? productsData
          : productsData.success && productsData.data
            ? productsData.data
            : productsData.products || [];
        setProducts(productList);
      }

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        if (templatesData.success) {
          setSavedTemplates(templatesData.data);
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Add element functions
  const addElement = (type: string, additionalProps = {}) => {
    const newElement: CanvasElement = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 30 : 100,
      content: type === 'text' ? 'Sample Text' : '',
      fontSize: 14,
      fontWeight: 'normal',
      fontFamily: 'Arial',
      color: '#000000',
      rotation: 0,
      opacity: 1,
      zIndex: canvasElements.length,
      ...additionalProps,
    };

    updateUnifiedState({
      canvasElements: [...canvasElements, newElement],
      selectedElement: newElement.id,
    });

    toast.success(`Added ${type} element`);
  };

  const addTextElement = () => addElement('text', { content: 'Click to edit' });

  const addBarcode = () => {
    setShowModal('barcode');
  };

  const addQRCode = () => {
    setShowModal('qr');
  };

  const addImage = () => {
    setShowModal('image');
  };

  const addRectangle = () =>
    addElement('rectangle', {
      backgroundColor: '#f0f0f0',
      borderColor: '#000000',
      borderWidth: 1,
    });

  const addNutrition = () => {
    setShowModal('nutrition');
  };

  const addProductInfo = () => {
    if (products.length === 0) {
      fetchProducts();
    }
    setShowModal('product');
  };

  const addIndianCompliance = () => {
    const complianceElement: CanvasElement = {
      id: `indian-compliance-${Date.now()}`,
      type: 'indian-compliance',
      x: 50,
      y: 50,
      width: 180,
      height: 120,
      isGroup: true,
      groupName: 'Indian Compliance Info',
      fontSize: 8,
      fontFamily: 'Arial',
      color: '#000000',
      lineHeight: 1.2,
      content: `FSSAI License No: {{FSSAI_LICENSE}}
Mfg Date: {{MFG_DATE}}
Best Before: {{BEST_BEFORE}}
Net Qty: {{NET_QTY}}
MRP: ₹{{MRP}} (Incl. all taxes)
Customer Care: {{CUSTOMER_CARE}}`,
      zIndex: canvasElements.length,
    };

    updateUnifiedState({
      canvasElements: [...canvasElements, complianceElement],
      selectedElement: complianceElement.id,
    });

    toast.success('Added Indian Compliance block');
  };

  // Fetch products for Product Info button
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/direct-data/products');
      if (response.ok) {
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  // Canvas interaction handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      updateUnifiedState({
        selectedElement: null,
        selectedElements: [],
      });
    }
  };

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      if (selectedElements.includes(elementId)) {
        updateUnifiedState({
          selectedElements: selectedElements.filter(id => id !== elementId),
        });
      } else {
        updateUnifiedState({
          selectedElements: [...selectedElements, elementId],
        });
      }
    } else {
      updateUnifiedState({
        selectedElement: elementId,
        selectedElements: [],
      });
    }
  };

  const handleDragStart = (elementId: string, e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    updateUnifiedState({ selectedElement: elementId });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const updatedElements = canvasElements.map(el => {
      if (el.id === selectedElement) {
        let newX = el.x + deltaX / (zoom / 100);
        let newY = el.y + deltaY / (zoom / 100);

        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }

        return { ...el, x: newX, y: newY };
      }
      return el;
    });

    setCanvasElements(updatedElements);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Delete selected elements
  const deleteSelectedElements = () => {
    const elementsToDelete =
      selectedElements.length > 0 ? selectedElements : selectedElement ? [selectedElement] : [];

    if (elementsToDelete.length === 0) {
      toast.error('No elements selected');
      return;
    }

    updateUnifiedState({
      canvasElements: canvasElements.filter(el => !elementsToDelete.includes(el.id)),
      selectedElement: null,
      selectedElements: [],
    });

    toast.success(`Deleted ${elementsToDelete.length} elements`);
  };

  // Select all elements
  const selectAllElements = () => {
    updateUnifiedState({
      selectedElements: canvasElements.map(el => el.id),
      selectedElement: null,
    });
    toast.success(`Selected all ${canvasElements.length} elements`);
  };

  // Save template
  const handleSaveTemplate = async (name: string, description: string) => {
    if (!selectedMedia) {
      toast.error('Please select a media type first');
      return;
    }

    const template: LabelTemplate = {
      name,
      description,
      type: 'custom',
      mediaId: selectedMedia.id,
      templateJson: {
        elements: canvasElements,
        labelSettings: {
          backgroundColor: '#ffffff',
          borderStyle: 'none',
          cornerRadius: 0,
        },
      },
    };

    try {
      const response = await fetch('/api/labels/custom-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        toast.success('Template saved successfully');
        setShowModal(null);
        fetchInitialData(); // Reload templates
        if (onTemplateSaved) onTemplateSaved();
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  // Render element content
  const renderElementContent = (element: CanvasElement) => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              fontFamily: element.fontFamily,
              textAlign: element.textAlign as any,
              color: element.color,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.textAlign || 'left',
              padding: '2px',
            }}
          >
            {element.content}
          </div>
        );

      case 'qr':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Squares2X2Icon className="w-8 h-8 text-gray-600" />
          </div>
        );

      case 'barcode':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-xs text-center">
              <div className="font-mono">||||| |||| |||||</div>
              <div className="mt-1">{element.content || '1234567890'}</div>
            </div>
          </div>
        );

      case 'image':
        return element.imageUrl ? (
          <img src={element.imageUrl} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <PhotoIcon className="w-8 h-8 text-gray-400" />
          </div>
        );

      case 'rectangle':
        return null;

      case 'nutrition-table':
        return (
          <div className="w-full h-full p-1 bg-white text-black" style={{ fontSize: '6px' }}>
            <div className="font-bold text-center">Nutrition Facts</div>
            <div className="border-t border-black mt-1"></div>
            <div className="text-xs">Per 100g</div>
          </div>
        );

      case 'indian-compliance':
        return (
          <div
            className="w-full h-full p-2 text-left"
            style={{
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              color: element.color,
              lineHeight: element.lineHeight,
            }}
          >
            {element.content?.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Toolbar */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Professional Label Designer</h2>
            <span className="text-sm text-gray-500">A4 Standard (210×297mm)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Main Action Buttons */}
            <button
              onClick={() => addTextElement()}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              Text
            </button>

            <button
              onClick={() => addQRCode()}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <QrCodeIcon className="w-4 h-4" />
              QR Code
            </button>

            <button
              onClick={() => addBarcode()}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              <RectangleStackIcon className="w-4 h-4" />
              Barcode
            </button>

            <button
              onClick={() => addNutrition()}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              <BeakerIcon className="w-4 h-4" />
              Nutrition
            </button>

            <button
              onClick={() => addProductInfo()}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              <DocumentTextIcon className="w-4 h-4" />
              Product Info
            </button>

            <button
              onClick={() => setShowModal('auto-generate')}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <SparklesIcon className="w-4 h-4" />
              Auto Generate
            </button>

            <button
              onClick={() => setShowModal('templates')}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
            >
              <Square3Stack3DIcon className="w-4 h-4" />
              Templates
            </button>

            <button
              onClick={() => addIndianCompliance()}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <ShieldCheckIcon className="w-4 h-4" />
              Indian Compliance
            </button>

            <button
              onClick={() => addImage()}
              className="flex items-center gap-2 px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              <PhotoIcon className="w-4 h-4" />
              Image
            </button>

            <button
              onClick={() => addRectangle()}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <RectangleGroupIcon className="w-4 h-4" />
              Rectangle
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAllElements}
              className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-50"
            >
              <Squares2X2Icon className="w-4 h-4" />
              Select All
            </button>

            <button
              onClick={deleteSelectedElements}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              disabled={!selectedElement && selectedElements.length === 0}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Toolbar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MagnifyingGlassMinusIcon className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(300, zoom + 25))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MagnifyingGlassPlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Grid Controls */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={e => setShowGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Grid</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={e => setSnapToGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Snap to Grid</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <EyeIcon className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={() => setShowModal('save-template')}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Media Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Label Media Type</label>
              <select
                value={selectedMedia?.id || ''}
                onChange={e => {
                  const media = mediaTypes.find(m => m.id === Number(e.target.value));
                  setSelectedMedia(media || null);
                }}
                className="w-full px-3 py-2 border rounded"
              >
                {mediaTypes.map(media => (
                  <option key={media.id} value={media.id}>
                    {media.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Data Source */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Data Source</label>
              <select
                value={selectedProduct?.id || ''}
                onChange={e => {
                  const product = products.find(p => p.id === Number(e.target.value));
                  setSelectedProduct(product || null);
                }}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sku}
                  </option>
                ))}
              </select>
            </div>

            {/* Saved Templates */}
            {savedTemplates.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Saved Templates</label>
                <select
                  onChange={e => {
                    const template = savedTemplates.find(t => t.id === Number(e.target.value));
                    if (template) {
                      setCanvasElements(template.templateJson.elements);
                      toast.success('Template loaded');
                    }
                  }}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Load Template...</option>
                  {savedTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* Product Info Display */}
            {selectedProduct && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">Product Details</h4>
                <div className="text-sm space-y-1">
                  <div>Name: {selectedProduct.name}</div>
                  <div>SKU: {selectedProduct.sku}</div>
                  <div>Price: ₹{selectedProduct.price}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="flex justify-center">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-lg"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                backgroundImage: showGrid
                  ? `repeating-linear-gradient(0deg, #f0f0f0 0px, transparent 1px, transparent ${gridSize}px, #f0f0f0 ${gridSize}px),
                     repeating-linear-gradient(90deg, #f0f0f0 0px, transparent 1px, transparent ${gridSize}px, #f0f0f0 ${gridSize}px)`
                  : 'none',
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
              onClick={handleCanvasClick}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
            >
              {canvasElements.map(element => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${
                    selectedElement === element.id || selectedElements.includes(element.id)
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    backgroundColor:
                      element.type === 'rectangle' ? element.backgroundColor : 'transparent',
                    border:
                      element.type === 'rectangle'
                        ? `${element.borderWidth}px solid ${element.borderColor}`
                        : 'none',
                    transform: `rotate(${element.rotation || 0}deg)`,
                    opacity: element.opacity || 1,
                    zIndex: element.zIndex || 0,
                  }}
                  onClick={e => handleElementClick(element.id, e)}
                  onMouseDown={e => handleDragStart(element.id, e)}
                >
                  {renderElementContent(element)}

                  {/* Resize Handles */}
                  {(selectedElement === element.id || selectedElements.includes(element.id)) && (
                    <>
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal === 'save-template' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save Template</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get('name') as string;
                const description = formData.get('description') as string;
                handleSaveTemplate(name, description);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Template Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Product Label with Barcode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe this template..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'qr' && (
        <EnhancedQRCodeGenerator
          onClose={() => setShowModal(null)}
          onQRCodeGenerated={qrData => {
            addElement('qr', {
              content: qrData.content,
              qrType: qrData.type,
              width: 100,
              height: 100,
            });
            setShowModal(null);
          }}
        />
      )}

      {showModal === 'barcode' && (
        <MultipleBarcodeGenerator
          onClose={() => setShowModal(null)}
          onBarcodeGenerated={barcodeData => {
            addElement('barcode', {
              content: barcodeData.content,
              width: 150,
              height: 50,
            });
            setShowModal(null);
          }}
        />
      )}

      {showModal === 'nutrition' && (
        <DynamicNutritionFacts
          width={200}
          height={250}
          nutritionData={{
            energy_kcal: 250,
            protein: 12,
            total_fat: 15,
            carbohydrates: 30
          }}
        />
      )}

      {showModal === 'product' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select Product</h3>
            <div className="space-y-2">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);

                    // Replace placeholders in text elements
                    const updatedElements = canvasElements.map(el => {
                      if (el.type === 'text' && el.content) {
                        let newContent = el.content
                          .replace(/\{\{PRODUCT_NAME\}\}/g, product.name)
                          .replace(/\{\{SKU\}\}/g, product.sku)
                          .replace(/\{\{PRICE\}\}/g, product.price.toString())
                          .replace(/\{\{CATEGORY\}\}/g, product.category?.name || '');
                        return { ...el, content: newContent };
                      }
                      return el;
                    });

                    setCanvasElements(updatedElements);
                    setShowModal(null);
                    toast.success('Product data applied');
                  }}
                  className="w-full text-left p-3 border rounded hover:bg-gray-50"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    SKU: {product.sku} | Price: ₹{product.price}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(null)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal === 'image' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Image</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="text"
                placeholder="Enter image URL"
                className="w-full px-3 py-2 border rounded"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const url = (e.target as HTMLInputElement).value;
                    if (url) {
                      addElement('image', { imageUrl: url });
                      setShowModal(null);
                    }
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'auto-generate' && (
        <AutomaticLabelGenerator
          onLabelGenerated={elements => {
            setCanvasElements(elements);
            setShowModal(null);
          }}
        />
      )}

      {showModal === 'templates' && (
        <AutomaticLabelTemplates
          onTemplateSelect={template => {
            setCanvasElements(template.elements);
            setShowModal(null);
            toast.success('Template applied');
          }}
        />
      )}
    </div>
  );
}

// Print Preview Component
function PrintPreview({ mediaTemplate, labelElements, selectedProduct }: any) {
  if (!mediaTemplate) {
    return <div className="p-8 text-center text-gray-500">No media template selected</div>;
  }

  const { dimensions } = mediaTemplate;
  const labelsPerPage = dimensions.columns * dimensions.rows;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Print Preview - {mediaTemplate.name}</h2>
      <div className="text-sm text-gray-600 mb-4">
        Page Size: {dimensions.pageWidth}mm × {dimensions.pageHeight}mm | Labels per page:{' '}
        {labelsPerPage} ({dimensions.columns} × {dimensions.rows})
      </div>

      <div
        className="bg-white shadow-lg mx-auto"
        style={{
          width: `${dimensions.pageWidth}mm`,
          height: `${dimensions.pageHeight}mm`,
          padding: `${dimensions.marginTop}mm ${dimensions.marginLeft}mm`,
          display: 'grid',
          gridTemplateColumns: `repeat(${dimensions.columns}, ${dimensions.labelWidth}mm)`,
          gridTemplateRows: `repeat(${dimensions.rows}, ${dimensions.labelHeight}mm)`,
          gap: `${dimensions.spacingY}mm ${dimensions.spacingX}mm`,
        }}
      >
        {Array.from({ length: labelsPerPage }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-500"
            style={{
              width: `${dimensions.labelWidth}mm`,
              height: `${dimensions.labelHeight}mm`,
            }}
          >
            Label {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

// Print Job Manager Component
function PrintJobManager({ mediaTemplate, labelElements, products }: any) {
  const [printJobs, setPrintJobs] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addPrintJob = () => {
    const product = products.find((p: Product) => p.id === selectedProductId);
    if (!product) {
      toast.error('Please select a product');
      return;
    }

    setPrintJobs([...printJobs, { product, quantity }]);
    setSelectedProductId(null);
    setQuantity(1);
    toast.success(`Added ${quantity} labels for ${product.name}`);
  };

  const totalLabels = printJobs.reduce((sum, job) => sum + job.quantity, 0);
  const sheetsNeeded = mediaTemplate
    ? Math.ceil(totalLabels / (mediaTemplate.dimensions.columns * mediaTemplate.dimensions.rows))
    : 0;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Print Job Configuration</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-medium mb-4">Add Products to Print</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Product</label>
            <select
              value={selectedProductId || ''}
              onChange={e => setSelectedProductId(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Product...</option>
              {products.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            onClick={addPrintJob}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {printJobs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium mb-4">Print Queue</h3>
          <div className="space-y-2 mb-4">
            {printJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>{job.product.name}</span>
                <span className="text-sm text-gray-600">{job.quantity} labels</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t text-sm">
            <div>Total Labels: {totalLabels}</div>
            <div>Sheets Needed: {sheetsNeeded}</div>
          </div>
        </div>
      )}
    </div>
  );
}
