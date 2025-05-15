
import { ref, get, update, query, orderByChild } from "firebase/database";
import { database } from "@/lib/firebase";

// Get all users
export const getAllUsers = async () => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users: any[] = [];
      snapshot.forEach((childSnapshot) => {
        users.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return users;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      const orders: any[] = [];
      snapshot.forEach((childSnapshot) => {
        orders.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by creation date (newest first)
      return orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, { status });
    return true;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};

// Get order statistics (for admin dashboard)
export const getOrderStatistics = async () => {
  try {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      let totalRevenue = 0;
      let totalOrders = 0;
      let pendingOrders = 0;
      let shippedOrders = 0;
      let completedOrders = 0;
      
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        totalOrders++;
        totalRevenue += order.total;
        
        switch (order.status.toLowerCase()) {
          case 'pending':
            pendingOrders++;
            break;
          case 'shipped':
            shippedOrders++;
            break;
          case 'completed':
            completedOrders++;
            break;
        }
      });
      
      return {
        totalRevenue,
        totalOrders,
        pendingOrders,
        shippedOrders,
        completedOrders
      };
    }
    
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      completedOrders: 0
    };
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw error;
  }
};
