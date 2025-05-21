
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Building, Phone, CreditCard } from "lucide-react";
import DeliveryTracking from "@/components/DeliveryTracking";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentDetails {
  method: "Paystack" | "Bank Transfer" | "USSD";
  status: "pending" | "completed";
  amount: number;
  reference?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  delivery: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  payment: PaymentDetails;
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
          <h1 className="text-3xl font-bold mb-4 text-yellow-500">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you may not have permission to view it.</p>
          <Button asChild variant="default" className="bg-yellow-500 hover:bg-red-500 hover:text-yellow-400 transition-colors">
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

  // Payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Paystack": return <CreditCard className="h-5 w-5 text-red-600" />;
      case "Bank Transfer": return <Building className="h-5 w-5 text-red-600" />;
      case "USSD": return <Phone className="h-5 w-5 text-red-600" />;
      default: return <CreditCard className="h-5 w-5 text-red-600" />;
    }
  };

  // Payment status badge
  const getPaymentStatusBadge = (status: string) => {
    if (status === "completed") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Paid</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Add the DeliveryTracking component */}
        <DeliveryTracking orderStatus={order.status} orderId={order.id} />
        
        <Card className="border-yellow-300 shadow-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-red-600">Order Confirmed!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order Number:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span>{formattedDate} at {formattedTime}</span>
              </div>
            </div>

            <Separator className="my-6 bg-yellow-200" />

            <div className="mb-6">
              <h2 className="font-semibold text-lg text-red-600 mb-4">Order Details</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6 bg-yellow-200" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold text-lg text-red-600 mb-3">Shipping Address</h2>
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
                <h2 className="font-semibold text-lg text-red-600 mb-3">Payment Method</h2>
                <div className="flex items-center space-x-2 mb-2">
                  {getPaymentIcon(order.payment.method)}
                  <span>
                    {order.payment.method} {getPaymentStatusBadge(order.payment.status)}
                  </span>
                </div>
                
                {order.payment.method === "Bank Transfer" && (
                  <div className="bg-yellow-50 p-3 rounded mb-4 text-sm">
                    <p className="text-gray-600">Please make your transfer to:</p>
                    <p className="mt-2">
                      <strong>Bank:</strong> Gozie Bank Ltd<br />
                      <strong>Account:</strong> 0123456789<br />
                      <strong>Name:</strong> Gozie Mini Store Ltd<br />
                      <strong>Reference:</strong> Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                )}

                {order.payment.method === "USSD" && (
                  <div className="bg-yellow-50 p-3 rounded mb-4 text-sm">
                    <p className="text-gray-600">Complete your payment with USSD:</p>
                    <p className="font-bold text-center my-2">*737*34*{order.total.toFixed(0)}#</p>
                    <p className="text-xs text-gray-500">Use your order number as reference: #{order.id.slice(0, 8)}</p>
                  </div>
                )}
                
                <h2 className="font-semibold text-lg text-red-600 mb-3">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₦{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-red-600">₦{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <Button asChild variant="default" className="w-full bg-yellow-500 hover:bg-red-500 hover:text-yellow-400 transition-colors">
                <Link to="/orders">View All Orders</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50">
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
