
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus, updatePaymentStatus } from '@/services/orderService';
import { toast } from 'sonner';
import { MoreHorizontal, Eye } from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  delivery: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  payment: {
    method: string;
    amount: number;
    status: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface AdminOrdersTableProps {
  orders: Order[];
  refreshOrders: () => void;
  onViewDetails: (order: Order) => void;
}

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({ orders, refreshOrders, onViewDetails }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleStatusChange = async (orderId: string, status: string) => {
    setLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      refreshOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handlePaymentStatusChange = async (orderId: string, status: string) => {
    setLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      await updatePaymentStatus(orderId, status);
      toast.success(`Payment status updated to ${status}`);
      refreshOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-NG', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 text-left font-medium text-gray-700">Order ID</th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">Customer</th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">Date</th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">Payment</th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">Total</th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <span className="font-mono text-sm">
                  #{order.id.substring(0, 8)}
                </span>
              </td>
              <td className="py-3 px-4">
                {order.delivery.firstName} {order.delivery.lastName}
              </td>
              <td className="py-3 px-4 text-gray-500 text-sm">
                {formatDate(order.createdAt)}
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={getStatusBadgeColor(order.status)}>
                  {order.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className={getPaymentStatusBadgeColor(order.payment.status)}>
                    {order.payment.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{order.payment.method}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium">
                ₦{order.total.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loading[order.id]}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(order)}>
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Processing')}>
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Shipped')}>
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Completed')}>
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Cancelled')}>
                      Mark as Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'Pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'Completed')}>
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'Failed')}>
                      Mark as Failed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
