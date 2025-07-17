import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { 
  ShoppingBagIcon, 
  CubeIcon, 
  PhotoIcon, 
  TagIcon, 
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PrinterIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import CompositeProductForm from '../../modules/products/CompositeProductForm';
import ProductCRUD from './ProductCRUD';
import { CategoryManagement } from '../../modules/products/CategoryManagement';
import { InventoryManagementCenter } from '../inventory/InventoryManagementCenter';
import SimpleImageGrid from '../image-management/SimpleImageGrid';
import SimpleImageUpload from '../image-management/SimpleImageUpload';
// Removed CreateProductForm import - only using sidebar navigation now
import { StreamlinedLabelDesign } from '../label-design/StreamlinedLabelDesign';
import TemplatePreview from '../label-design/TemplatePreview';
import PrintManagement from '../label-design/PrintManagement';
import LabelAnalytics from '../label-design/LabelAnalytics';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  images: string[];
  description: string;
  created_at: string;
}

interface InventoryAlert {
  product_id: string;
  product_name: string;
  current_stock: number;
  min_threshold: number;
  alert_type: string;
}

export function ProductEcosystemHub() {
  // Removed activeTab state - using only sidebar navigation now
  // Removed labelDesignSubTab as we're using StreamlinedLabelDesign now
  const router = useRouter();
  // Removed showCreateProduct state - only using sidebar navigation now
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateRefreshKey, setTemplateRefreshKey] = useState(0);
  const [templatesNeedRefresh, setTemplatesNeedRefresh] = useState(false);

  useEffect(() => {
    fetchProductData();
  }, []);

  // Template loading function - simplified for StreamlinedLabelDesign
  const handleTemplateLoad = (template) => {
    console.log('🎨 Template loading request received in ProductEcosystemHub:', template.name);
    setSelectedTemplate(template);
    // Toast notification will be handled by StreamlinedLabelDesign component
  };

  const fetchProductData = async () => {
    try {
      setLoading(true);

      // Fetch authentic Telugu data from working endpoints
      const [productsResponse, categoriesResponse, alertsResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/inventory/alerts')
      ]);

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        console.log('Products data received:', productsData);
        if (productsData.success && productsData.data) {
          // Convert products to expected format
          const formattedProducts = productsData.data.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price || 0),
            stock: item.stock || 0,
            category: item.category || 'Unknown',
            status: item.status || 'active',
            images: item.images || [],
            description: item.description || '',
            created_at: item.created_at || new Date().toISOString()
          }));
          setProducts(formattedProducts);
        }
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log('Categories data received:', categoriesData);
        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }
      }

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        console.log('Alerts data received:', alertsData);
        if (alertsData.success && alertsData.data) {
          setAlerts(alertsData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Removed tabs - using only sidebar navigation now

  // labelDesignSubTabs removed - using StreamlinedLabelDesign with integrated tabs

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Product Overview Header - NO CREATE BUTTON */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Overview</h3>
        <p className="text-sm text-gray-500">Use sidebar "Add Product" to create new products</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{Array.isArray(products) ? products.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CubeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Array.isArray(products) ? products.filter(p => p.stock > 0).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">{Array.isArray(alerts) ? alerts.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TagIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Array.isArray(categories) ? categories.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {Array.isArray(alerts) && alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={alert.productId || index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{alert.productName}</p>
                      <p className="text-sm text-gray-600">
                        Current stock: {alert.currentStock} | Minimum: {alert.minimumStock}
                      </p>
                      <p className="text-xs text-gray-500">
                        Branch: {alert.branchName} | Status: {alert.severity}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push('/inventory-management')}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProductCatalog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Catalog</h3>
        <p className="text-sm text-gray-500">Use sidebar "Add Product" to create new products</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-4"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Just show the overview - no create buttons, only sidebar navigation */}
      {renderOverview()}
    </div>
  );
}