
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserOrders } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ChevronRight } from "lucide-react";

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
  total: number;
  status: string;
  createdAt: string;
}

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => {
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Placed on {formattedDate}</p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center">
                      <Badge variant="outline" className={`${getStatusColor(order.status)} mr-4`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/order-confirmation/${order.id}`}>
                          Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Order Summary</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Items:</span>
                            <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-medium">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Shipping Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.delivery.firstName} {order.delivery.lastName}, {order.delivery.address}, {order.delivery.city}, {order.delivery.postalCode}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Items</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.items.slice(0, 2).map(item => (
                          <div key={item.productId} className="flex justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Button asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
