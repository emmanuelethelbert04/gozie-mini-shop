
import { ref, push, set, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from "@/lib/firebase";

// Create a new order
export const createOrder = async (orderData: any): Promise<string> => {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    
    await set(newOrderRef, orderData);
    
    return newOrderRef.key || '';
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.key,
        ...snapshot.val()
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

// Get all orders for a specific user
export const getUserOrders = async (userId: string) => {
  try {
    const ordersRef = query(ref(database, 'orders'), orderByChild('userId'), equalTo(userId));
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
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};
