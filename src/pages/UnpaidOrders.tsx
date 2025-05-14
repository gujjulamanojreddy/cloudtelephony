import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';

interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface UnpaidOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  amount: number;
  order_date: string;
  order_id: string;
  status: string;
}

export function UnpaidOrders() {
  const [orders, setOrders] = useState<UnpaidOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUnpaidOrders();
  }, []);
  const fetchUnpaidOrders = async () => {
    try {
      const { data: unpaidOrders, error } = await supabase
        .from('orders')
        .select(`
          id,
          amount,
          created_at,
          status,
          customers (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .in('status', ['pending', 'failed'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure unpaidOrders is not null and handle type properly
      const formattedOrders = (unpaidOrders || []).map(order => {
        // Direct access to customer fields may not work as expected with Supabase joins
        // We need to handle the structure correctly
        const customerData = order.customers as unknown as Customer;
        
        return {
          id: order.id,
          customer_name: `${customerData.first_name} ${customerData.last_name}`,
          email: customerData.email,
          phone: customerData.phone,
          amount: order.amount,
          order_date: order.created_at,
          order_id: order.id,
          status: order.status
        };
      });

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching unpaid orders:', error);
      toast('Failed to fetch unpaid orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-bold">Unpaid Orders</CardTitle>
          <div className="text-sm text-gray-500">
            Total Unpaid Orders: {orders.length}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Order ID</TableHeader>
                  <TableHeader>Customer Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Phone</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Order Date</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading unpaid orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No unpaid orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(order.order_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
