import React, { useState } from 'react';
import { FileSpreadsheet, Search, Eye, Download, Printer, MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TablePagination } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { exportToExcel } from '../utils/exportToExcel';
import { useToast } from '../components/ui/Toaster';

// Mock data
const mockOrders = [
  {
    id: '202500000005',
    customer: {
      name: 'Pawan Kumar',
      email: 'pawan@example.com',
    },
    amount: 6990,
    status: 'new',
    date: 'Tue, 29 Apr 2025, 7:53 am',
    paymentStatus: 'pending',
  },
  {
    id: '202500000004',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
    },
    amount: 3499,
    status: 'processing',
    date: 'Mon, 28 Apr 2025, 2:30 pm',
    paymentStatus: 'paid',
  },
  {
    id: '202500000003',
    customer: {
      name: 'Priya Singh',
      email: 'priya@example.com',
    },
    amount: 1999,
    status: 'delivered',
    date: 'Sun, 27 Apr 2025, 11:45 am',
    paymentStatus: 'paid',
  },
  {
    id: '202500000002',
    customer: {
      name: 'Amit Patel',
      email: 'amit@example.com',
    },
    amount: 8990,
    status: 'cancelled',
    date: 'Sat, 26 Apr 2025, 5:15 pm',
    paymentStatus: 'failed',
  },
  {
    id: '202500000001',
    customer: {
      name: 'Neha Gupta',
      email: 'neha@example.com',
    },
    amount: 2499,
    status: 'delivered',
    date: 'Fri, 25 Apr 2025, 9:20 am',
    paymentStatus: 'paid',
  },
];

const Orders: React.FC = () => {
  const [orders] = useState(mockOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('orderId');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { toast } = useToast();
  const totalPages = Math.ceil(orders.length / parseInt(entriesPerPage));
  
  const handleExportToExcel = async () => {
    try {
      // Format data for export
      const exportData = orders.map(order => ({
        'Order ID': order.id,
        'Customer': order.customer.name,
        'Email': order.customer.email,
        'Amount': `₹${order.amount.toLocaleString()}`,
        'Date': order.date,
        'Payment Status': order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending' ? 'Not Paid' : 'Failed',
        'Order Status': order.status
      }));
      
      await exportToExcel(exportData, 'Orders_List');
      toast('Orders exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      toast('Failed to export orders', 'error');
    }
  };
  
  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    setCurrentPage(1);
  };
  
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Add new functions for action buttons
  const handleViewOrder = (orderId: string) => {
    toast(`Viewing details for Order #${orderId}`, 'info');
    // In a real app, this would open order details page or modal
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast(`Downloading invoice for Order #${orderId}`, 'success');
    // In a real app, this would download the invoice PDF
  };

  const handlePrintOrder = (orderId: string) => {
    toast(`Printing order #${orderId}`, 'info');
    // In a real app, this would open the print dialog
    window.print();
  };

  const handleMoreOptions = (orderId: string) => {
    toast(`More options for Order #${orderId}`, 'info');
    // In a real app, this would show a dropdown with more actions
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg font-medium">All Orders</CardTitle>
          <Button 
            leftIcon={<FileSpreadsheet size={16} />} 
            variant="success"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
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
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Select
                  label="Search by :"
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  options={[
                    { value: 'orderId', label: 'Order ID' },
                    { value: 'customer', label: 'Customer' },
                    { value: 'email', label: 'Email' },
                  ]}
                  className="w-32"
                />
                <Input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={handleSearch}
                  leftIcon={<Search size={16} />}
                  className="w-full sm:w-64"
                />
              </div>
              <Select
                label="Status:"
                value={statusFilter}
                onChange={handleStatusFilter}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'new', label: 'New' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                className="w-full sm:w-36"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Order ID</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Order Value</TableHeader>
                  <TableHeader>Order At</TableHeader>
                  <TableHeader>Payment</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending' ? 'Not Paid' : 'Failed'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Order"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="Download Invoice"
                          onClick={() => handleDownloadInvoice(order.id)}
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="Print Order"
                          onClick={() => handlePrintOrder(order.id)}
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          title="More Options"
                          onClick={() => handleMoreOptions(order.id)}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  );
};

export default Orders;