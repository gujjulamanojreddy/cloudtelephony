import { useState } from 'react';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const mockOrders = [
  {
    id: '202500000005',
    customer: {
      name: 'Pawan Kumar',
      email: 'pawan@example.com',
    },
    amount: 6990,
    status: 'new' as const,
    date: 'Tue, 29 Apr 2025, 7:53 am',
    paymentStatus: 'pending' as const,
  },
  {
    id: '202500000004',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
    },
    amount: 3499,
    status: 'processing' as const,
    date: 'Mon, 28 Apr 2025, 2:30 pm',
    paymentStatus: 'paid' as const,
  },
  {
    id: '202500000003',
    customer: {
      name: 'Priya Singh',
      email: 'priya@example.com',
    },
    amount: 1999,
    status: 'delivered' as const,
    date: 'Sun, 27 Apr 2025, 11:45 am',
    paymentStatus: 'paid' as const,
  },
  {
    id: '202500000002',
    customer: {
      name: 'Amit Patel',
      email: 'amit@example.com',
    },
    amount: 8990,
    status: 'cancelled' as const,
    date: 'Sat, 26 Apr 2025, 5:15 pm',
    paymentStatus: 'failed' as const,
  },
];

const topProducts = [
  { id: 1, name: 'Smartphone X Pro', orders: 24, revenue: 239880 },
  { id: 2, name: 'Wireless Earbuds', orders: 18, revenue: 35982 },
  { id: 3, name: 'Smart Watch', orders: 15, revenue: 74985 },
  { id: 4, name: 'Laptop Sleeve', orders: 12, revenue: 11988 },
  { id: 5, name: 'Power Bank', orders: 10, revenue: 9990 },
];

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock revenue data for visualization
const revenueData = {
  daily: {
    labels: ['May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14'],
    datasets: [
      {
        label: 'Revenue',
        data: [58420, 62150, 49380, 72560, 65840, 82450, 78990],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ]
  },
  monthly: {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue',
        data: [154200, 189560, 172350, 206780, 243650, 275120, 312740],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ]
  }
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: function(context: {dataset: {label?: string}, parsed: {y: number | null}}) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += '₹' + context.parsed.y.toLocaleString();
          }
          return label;
        }
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      } as Partial<any>,
      ticks: {
        callback: function(value: number): string {
          return '₹' + value.toLocaleString();
        }
      } as Partial<any>
    },
    x: {
      grid: {
        display: false
      } as Partial<any>
    }
  }
};

const Dashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly'>('daily');
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Customers"
          value="356"
          icon={<Users size={24} />}
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Total Products"
          value="128"
          icon={<Package size={24} />}
          change={{ value: 5, type: 'increase' }}
        />
        <StatCard
          title="Total Orders"
          value="1,024"
          icon={<ShoppingBag size={24} />}
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="Total Revenue"
          value="₹8,54,492"
          icon={<DollarSign size={24} />}
          change={{ value: 14, type: 'increase' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
            <div className="flex items-center gap-2">
              <select 
                className="bg-white border border-gray-300 text-gray-700 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                value={timeframe === 'daily' ? 'Last 7 days' : 'Last 6 months'}
                onChange={(e) => setTimeframe(e.target.value.includes('7') ? 'daily' : 'monthly')}
              >
                <option>Last 7 days</option>
                <option>Last 6 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 border-t border-gray-200 pt-4">
              <Line 
                data={timeframe === 'daily' ? revenueData.daily : revenueData.monthly}
                options={chartOptions}
                className="h-full w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Top Products</CardTitle>
            <div className="p-1 rounded text-xs text-blue-600 font-medium hover:bg-blue-50 cursor-pointer">
              View All
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {topProducts.map((product) => (
                <li key={product.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.orders} orders</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
          <div className="p-1 rounded text-xs text-blue-600 font-medium hover:bg-blue-50 cursor-pointer">
            View All Orders
          </div>
        </CardHeader>
        <RecentOrdersTable orders={mockOrders} />
      </Card>
    </div>
  );
};

export default Dashboard;