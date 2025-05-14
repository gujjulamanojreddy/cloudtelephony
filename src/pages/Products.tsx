import { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TablePagination } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import SearchBar from '../components/ui/SearchBar';
import AddProductForm from '../components/forms/AddProductForm';
import { useToast } from '../components/ui/Toaster';

// Product interface
interface Product {
  id: string;
  name: string;
  category: string;
  listPrice: number;
  salePrice: number;
  status: string;
  dateAdded: string;
  stock: number;
}

// Mock data for initial development
const mockProducts: Product[] = [
  {
    id: 'PROD001',
    name: 'Smartphone X Pro',
    category: 'Electronics',
    listPrice: 9999,
    salePrice: 8999,
    status: 'active',
    dateAdded: '2025-04-29',
    stock: 50
  },
  {
    id: 'PROD002',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    listPrice: 2499,
    salePrice: 1999,
    status: 'active',
    dateAdded: '2025-04-28',
    stock: 100
  },
  {
    id: 'PROD003',
    name: 'Smart Watch',
    category: 'Electronics',
    listPrice: 5999,
    salePrice: 4999,
    status: 'active',
    dateAdded: '2025-04-27',
    stock: 30
  }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<string>('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { toast } = useToast();

  const totalPages = Math.ceil(products.length / parseInt(entriesPerPage));

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    toast('Product saved successfully', 'success');
    // Here you would typically refresh the products list
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Here you would typically call your delete API
        setProducts(products.filter(p => p.id !== productId));
        toast('Product deleted successfully', 'success');
      } catch (error) {
        toast('Failed to delete product', 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6">
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm
              product={editingProduct}
              onSuccess={handleAddSuccess}
              onCancel={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg font-medium">All Products</CardTitle>
            <Button 
              leftIcon={<Plus size={16} />}
              variant="primary"
              onClick={() => {
                setEditingProduct(null); // Clear editing state when adding new
                setShowAddForm(true);
              }}
            >
              Add Product
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div>
                  <label htmlFor="entries" className="text-sm text-gray-500">Show</label>
                  <Select
                    id="entries"
                    value={entriesPerPage}
                    onChange={handleEntriesChange}
                    options={[
                      { value: '10', label: '10' },
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: '100', label: '100' },
                    ]}
                    className="w-16 mx-2"
                  />
                  <span className="text-sm text-gray-500">entries</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <SearchBar
                  placeholder="Search products..."
                  onSearch={(value: string) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                  }}
                  initialValue={searchTerm}
                  className="w-full sm:w-80"
                />
                <Select
                  value={categoryFilter}
                  onChange={(value) => setCategoryFilter(value)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'accessories', label: 'Accessories' },
                  ]}
                  className="w-full sm:w-40"
                />
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'out_of_stock', label: 'Out of Stock' },
                  ]}
                  className="w-full sm:w-40"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Product Name
                        {sortBy === 'name' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHeader>
                    <TableHeader 
                      className="cursor-pointer"
                      onClick={() => handleSort('listPrice')}
                    >
                      <div className="flex items-center">
                        Price
                        {sortBy === 'listPrice' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Date Added</TableHeader>
                    <TableHeader className="text-right">Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">₹{product.salePrice.toLocaleString()}</span>
                            {product.listPrice > product.salePrice && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{product.listPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}
                          >
                            {product.status.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>{product.dateAdded}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <button 
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Product"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Product"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

