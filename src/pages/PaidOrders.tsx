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

interface PaidOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  amount: number;
  order_date: string;
  order_id: string;
}

export function PaidOrders() {
  const [orders, setOrders] = useState<PaidOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaidOrders();
  }, []);
  const fetchPaidOrders = async () => {
    try {
      const { data: paidOrders, error } = await supabase
        .from('orders')
        .select(`
          id,
          amount,
          created_at,
          customers (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure paidOrders is not null and handle type properly
      const formattedOrders = (paidOrders || []).map(order => {
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
          order_id: order.id
        };
      });

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching paid orders:', error);
      toast('Failed to fetch paid orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-bold">Paid Orders</CardTitle>
          <div className="text-sm text-gray-500">
            Total Paid Orders: {orders.length}
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
                  <TableHeader>Order Date</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading paid orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No paid orders found
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
