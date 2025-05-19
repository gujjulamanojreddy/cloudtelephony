import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const ContactRequests: React.FC = () => {
  const navigate = useNavigate();  const mockData: ContactRequest[] = [
    {
      id: 1,
      name: "Srinu Vemula",
      email: "vemulasrinuiso@gmail.com",
      message: "good",
      created_at: "2024-11-19T14:19:00"
    },
    {
      id: 2,
      name: "John Smith",
      email: "john.smith@example.com",
      message: "Interested in your services",
      created_at: "2024-11-19T10:30:00"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      message: "Please contact me regarding business inquiry",
      created_at: "2024-11-18T15:45:00"
    },
  ];
  const [contactRequests] = useState<ContactRequest[]>(mockData);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Contact Requests</h2>        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate('/contact-requests/new')}
        >
          New Contact Requests
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-600 mr-2">Show</span>
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600 ml-2">entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email/Mobile
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody>
              {contactRequests.slice(0, entriesPerPage).map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">
                    {request.email}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">
                    {request.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b text-sm text-gray-900">
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing 1 to {Math.min(entriesPerPage, contactRequests.length)} of {contactRequests.length} entries
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white text-sm font-medium rounded">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactRequests;