
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  getAllUsers,
  getAllOrders,
  updateOrderStatus 
} from "@/services/adminService";
import { toast } from "sonner";
import {
  Users,
  ShoppingBag,
  Package
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

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

const Admin = () => {
  const { currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !isAdmin) return;
      
      try {
        setLoading(true);
        const [usersData, ordersData] = await Promise.all([
          getAllUsers(),
          getAllOrders()
        ]);
        setUsers(usersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isAdmin]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // If not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Statistics for dashboard
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending').length;
  const shippedOrders = orders.filter(order => order.status.toLowerCase() === 'shipped').length;
  const completedOrders = orders.filter(order => order.status.toLowerCase() === 'completed').length;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {totalOrders} orders
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered accounts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting shipment
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Overview of all order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-yellow-400 h-4 rounded-full" 
                        style={{ width: `${(pendingOrders / totalOrders) * 100}%` }} 
                      />
                    </div>
                    <span className="ml-4 text-sm font-medium w-20">Pending ({pendingOrders})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-400 h-4 rounded-full" 
                        style={{ width: `${(shippedOrders / totalOrders) * 100}%` }} 
                      />
                    </div>
                    <span className="ml-4 text-sm font-medium w-20">Shipped ({shippedOrders})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-green-400 h-4 rounded-full" 
                        style={{ width: `${(completedOrders / totalOrders) * 100}%` }} 
                      />
                    </div>
                    <span className="ml-4 text-sm font-medium w-20">Completed ({completedOrders})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders and user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...orders].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  ).slice(0, 5).map(order => {
                    const date = new Date(order.createdAt);
                    return (
                      <div key={order.id} className="flex items-start">
                        <div className="mr-4 mt-1">
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New order #{order.id.substring(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {date.toLocaleDateString()} - ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Registered Users
              </CardTitle>
              <CardDescription>
                Total users: {users.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => {
                        const date = new Date(user.createdAt);
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{date.toLocaleDateString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" /> Orders
              </CardTitle>
              <CardDescription>
                Total orders: {orders.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => {
                        const date = new Date(order.createdAt);
                        const statusColors = {
                          pending: 'bg-yellow-100 text-yellow-800',
                          shipped: 'bg-blue-100 text-blue-800',
                          completed: 'bg-green-100 text-green-800',
                          cancelled: 'bg-red-100 text-red-800'
                        };
                        const statusColor = 
                          statusColors[order.status.toLowerCase() as keyof typeof statusColors] || 
                          'bg-gray-100 text-gray-800';
                        
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                            <TableCell>{order.delivery.firstName} {order.delivery.lastName}</TableCell>
                            <TableCell>{date.toLocaleDateString()}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Select 
                                defaultValue={order.status.toLowerCase()}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className={`w-[130px] ${statusColor}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewOrderDetails(order)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order #{selectedOrder.id.substring(0, 8)}</h2>
                <Button variant="ghost" size="sm" onClick={closeOrderDetails}>
                  &times;
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {selectedOrder.delivery.firstName} {selectedOrder.delivery.lastName}<br />
                    <span className="font-medium">Address:</span> {selectedOrder.delivery.address}<br />
                    <span className="font-medium">City:</span> {selectedOrder.delivery.city} {selectedOrder.delivery.postalCode}<br />
                    <span className="font-medium">Phone:</span> {selectedOrder.delivery.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}<br />
                    <span className="font-medium">User ID:</span> {selectedOrder.userId}<br />
                    <span className="font-medium">Status:</span> 
                    <Select 
                      defaultValue={selectedOrder.status.toLowerCase()}
                      onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-7 text-xs mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </p>
                </div>
              </div>

              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="rounded-md border mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                      <TableCell className="font-bold">${selectedOrder.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button onClick={closeOrderDetails}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
