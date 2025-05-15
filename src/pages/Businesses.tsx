import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import AddBusinessForm from '../components/forms/AddBusinessForm';
import AgentsView from '../components/business/AgentsView';

// Business interface
interface Business {
  id: string;
  name: string;
  email: string;
  gstNumber?: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2?: string;
  pincode: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'suspended';
  orderCount?: number;
}

// Mock data for initial development
const mockBusinesses: Business[] = [
  {
    id: 'BUS001',
    name: 'Cloud Telephony',
    email: 'vijayverma25870@gmail.com',
    gstNumber: '',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Allahabad',
    address1: 'Test Address',
    pincode: '211001',
    contactName: 'Vijay Verma',
    contactEmail: 'vijayverma25870@gmail.com',
    status: 'suspended' as const
  }
];

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [editingBusiness, setEditingBusiness] = useState<Business | undefined>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);  const [showViewBusiness, setShowViewBusiness] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setShowAddForm(true);
  };
  const handleView = (business: Business) => {
    setSelectedBusiness(business);
    setShowViewBusiness(true);
  };

  const handleAgentsClick = (business: Business) => {
    setSelectedBusiness(business);
    setShowAgents(true);
  };

  const handleStatusClick = (business: Business) => {
    setSelectedBusiness(business);
    setShowStatusDialog(true);
  };
  const handleStatusChange = () => {
    if (selectedBusiness) {
      const updatedBusinesses = businesses.map(business => {
        if (business.id === selectedBusiness.id) {
          const newStatus = business.status === 'active' ? 'suspended' as const : 'active' as const;
          return {
            ...business,
            status: newStatus
          };
        }
        return business;
      });
      setBusinesses(updatedBusinesses);
      setShowStatusDialog(false);
      setSelectedBusiness(null);
    }
  };

  const handleResetPasswordClick = (business: Business) => {
    setSelectedBusiness(business);
    setShowResetPasswordDialog(true);
  };

  const handleResetPassword = () => {
    // Implement password reset logic here
    setShowResetPasswordDialog(false);
    setSelectedBusiness(null);
  };

  const getStatusColor = (status: Business['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6">
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingBusiness ? 'Edit Business' : 'Add New Business'}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddBusinessForm
              business={editingBusiness}
              onSuccess={() => {
                setShowAddForm(false);
                setEditingBusiness(undefined);
              }}
              onCancel={() => {
                setShowAddForm(false);
                setEditingBusiness(undefined);
              }}
            />
          </CardContent>
        </Card>      ) : showAgents && selectedBusiness ? (
        <AgentsView 
          businessId={selectedBusiness.id}
          onClose={() => {
            setShowAgents(false);
            setSelectedBusiness(null);
          }}
        />
      ) : showViewBusiness && selectedBusiness ? (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl">View Business</h1>
            </div>
            <button
              onClick={() => {
                setShowViewBusiness(false);
                setSelectedBusiness(null);
              }}
              className="text-sm hover:bg-gray-100 px-2 py-1 rounded flex items-center gap-1"
            >
              ← Back
            </button>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 bg-blue-50 p-1.5 rounded">🏢</span>
                <h2 className="text-lg font-medium">Business Details</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="mt-1">{selectedBusiness.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GST Number</p>
                  <p className="mt-1">{selectedBusiness.gstNumber || '-'}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="mt-1">{selectedBusiness.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="mt-1">{selectedBusiness.state}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="mt-1">{selectedBusiness.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pincode</p>
                    <p className="mt-1">{selectedBusiness.pincode}</p>
                  </div>
                </div>

                <div className="grid gap-6 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Address 1</p>
                    <p className="mt-1">{selectedBusiness.address1}</p>
                  </div>
                  {selectedBusiness.address2 && (
                    <div>
                      <p className="text-sm text-gray-500">Address 2</p>
                      <p className="mt-1">{selectedBusiness.address2}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-purple-600 bg-purple-50 p-1.5 rounded">👤</span>
                  <h2 className="text-lg font-medium">Contact Person</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="mt-1">{selectedBusiness.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="mt-1">{selectedBusiness.contactEmail}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1">{selectedBusiness.contactPhone || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Businesses</h1>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Add New Business
            </button>
          </div>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Business Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>City</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businesses.length > 0 ? (
                    businesses.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">{business.name}</TableCell>
                        <TableCell>{business.email}</TableCell>
                        <TableCell>{business.city}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(business.status)}`}
                          >
                            {business.status}
                          </span>
                        </TableCell>                        <TableCell>                          <div className="flex items-center gap-2">
                            <button className="bg-transparent hover:bg-slate-100 py-1 px-2 rounded text-sm">
                              Orders
                            </button>
                            <button
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-1 px-2 rounded text-sm"
                              onClick={() => handleEdit(business)}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 py-1 px-2 rounded text-sm"
                              onClick={() => handleView(business)}
                            >
                              View
                            </button>                            <button 
                              onClick={() => handleAgentsClick(business)}
                              className="bg-purple-100 text-purple-700 hover:bg-purple-200 py-1 px-2 rounded text-sm"
                            >
                              Agents
                            </button>
                            <button 
                              onClick={() => handleResetPasswordClick(business)}
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-1 px-2 rounded text-sm"
                            >
                              Reset Password
                            </button>
                            <button 
                              onClick={() => handleStatusClick(business)}
                              className={`py-1 px-2 rounded text-sm ${
                                business.status === 'active' 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {business.status === 'active' ? 'Suspend' : 'Active'}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No businesses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Change Dialog */}
      {showStatusDialog && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">
              Do you want to change the status to {selectedBusiness.status === 'active' ? 'Suspended' : 'Active'}?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleStatusChange()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Yes, change it
              </button>
              <button
                onClick={() => {
                  setShowStatusDialog(false);
                  setSelectedBusiness(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Dialog */}
      {showResetPasswordDialog && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl text-gray-500">?</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Reset Password?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to reset the password?</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleResetPassword}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Yes, reset it!
              </button>
              <button
                onClick={() => {
                  setShowResetPasswordDialog(false);
                  setSelectedBusiness(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
