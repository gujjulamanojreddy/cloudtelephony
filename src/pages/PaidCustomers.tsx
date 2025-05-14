import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';

interface PaidCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_paid: number;
  last_payment_date: string;
  order_count: number;
}

export function PaidCustomers() {
  const [customers, setCustomers] = useState<PaidCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaidCustomers();
  }, []);

  const fetchPaidCustomers = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('customer_id, amount, created_at')
        .eq('status', 'paid');

      if (error) throw error;

      // Group orders by customer
      const customerOrders = orders.reduce((acc: any, order) => {
        if (!acc[order.customer_id]) {
          acc[order.customer_id] = {
            total_paid: 0,
            order_count: 0,
            last_payment_date: order.created_at
          };
        }
        acc[order.customer_id].total_paid += order.amount;
        acc[order.customer_id].order_count += 1;
        if (new Date(order.created_at) > new Date(acc[order.customer_id].last_payment_date)) {
          acc[order.customer_id].last_payment_date = order.created_at;
        }
        return acc;
      }, {});

      // Get customer details
      const customerIds = Object.keys(customerOrders);
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id, first_name, last_name, email, phone')
        .in('id', customerIds);

      if (customerError) throw customerError;

      // Combine customer details with order data
      const paidCustomers = customers.map((customer) => ({
        ...customer,
        total_paid: customerOrders[customer.id].total_paid,
        last_payment_date: customerOrders[customer.id].last_payment_date,
        order_count: customerOrders[customer.id].order_count
      }));

      setCustomers(paidCustomers);
    } catch (error) {
      console.error('Error fetching paid customers:', error);
      toast('Failed to fetch paid customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-bold">Paid Customers</CardTitle>
          <div className="text-sm text-gray-500">
            Total Paid Customers: {customers.length}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Customer Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Phone</TableHeader>
                  <TableHeader>Total Orders</TableHeader>
                  <TableHeader>Total Paid</TableHeader>
                  <TableHeader>Last Payment Date</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading paid customers...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No paid customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.order_count}</TableCell>
                      <TableCell>₹{customer.total_paid.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(customer.last_payment_date).toLocaleDateString()}
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
