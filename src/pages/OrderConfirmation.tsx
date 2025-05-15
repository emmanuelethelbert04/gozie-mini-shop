
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Calendar, Clock } from "lucide-react";

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
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you may not have permission to view it.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Estimated delivery date (5 days from order date)
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order Number:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span>{formattedDate} at {formattedTime}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h2 className="font-semibold text-lg">Order Status</h2>
              <div className="flex items-center text-green-600">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-gray-600">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm">{formattedDeliveryDate}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-4">Order Details</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold text-lg mb-3">Shipping Address</h2>
                <p className="text-gray-600">
                  {order.delivery.firstName} {order.delivery.lastName}
                  <br />
                  {order.delivery.address}
                  <br />
                  {order.delivery.city}, {order.delivery.postalCode}
                  <br />
                  Phone: {order.delivery.phone}
                </p>
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-3">Payment Method</h2>
                <p className="text-gray-600 mb-4">{order.paymentMethod}</p>
                
                <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <Button asChild variant="default" className="w-full">
                <Link to="/orders">View All Orders</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
