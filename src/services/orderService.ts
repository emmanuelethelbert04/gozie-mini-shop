import { ref, push, set, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from "@/lib/firebase";
import emailjs from 'emailjs-com';

// Initialize EmailJS service
const EMAILJS_SERVICE_ID = "service_5kr10ul";
const EMAILJS_ORDER_TEMPLATE_ID = "template_ye6jjd5";
const EMAILJS_CONTACT_TEMPLATE_ID = "template_12h0zgn";
const EMAILJS_PUBLIC_KEY = "Pb5jDQAKBNYgwUbnL";

// Paystack public key
const PAYSTACK_PUBLIC_KEY = "pk_test_dd07166e34aa9b885fa0ecfaa3d6563ca6c12c06";

// Create a new order
export const createOrder = async (orderData: any): Promise<string> => {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    
    await set(newOrderRef, {
      ...orderData,
      createdAt: new Date().toISOString()
    });
    
    return newOrderRef.key || '';
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Process payment with Paystack
export const processPaystackPayment = async (email: string, amount: number, metadata: any, callback: Function) => {
  try {
    // Load Paystack inline script dynamically if not already loaded
    if (!window.PaystackPop) {
      console.log("Initializing Paystack script dynamically");
      await loadPaystackScript();
    }
    
    // Use the global PaystackPop object that's loaded by the script
    window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert to kobo (smallest unit of Nigerian currency)
      currency: "NGN",
      ref: 'GMS-' + Math.floor((Math.random() * 1000000000) + 1), // Generate a unique reference
      metadata,
      callback: function(response: any) {
        console.log("Payment successful with reference:", response.reference);
        callback(response);
      },
      onClose: function() {
        console.log('Transaction was closed');
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error processing Paystack payment:", error);
    throw error;
  }
};

// Helper function to load Paystack script
const loadPaystackScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
};

// Process bank transfer payment
export const processBankTransferPayment = async (orderId: string, transferDetails: any) => {
  try {
    const paymentRef = ref(database, `orders/${orderId}/payment`);
    await set(paymentRef, {
      ...transferDetails,
      method: "Bank Transfer",
      status: "pending",
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error processing bank transfer:", error);
    throw error;
  }
};

// Process USSD payment
export const processUSSDPayment = async (orderId: string) => {
  try {
    const paymentRef = ref(database, `orders/${orderId}/payment`);
    await set(paymentRef, {
      method: "USSD",
      status: "pending",
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error processing USSD payment:", error);
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

// Update order status (for admin)
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = ref(database, `orders/${orderId}/status`);
    await set(orderRef, status);
    return true;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};

// Update payment status (for admin)
export const updatePaymentStatus = async (orderId: string, status: string) => {
  try {
    const paymentStatusRef = ref(database, `orders/${orderId}/payment/status`);
    await set(paymentStatusRef, status);
    return true;
  } catch (error) {
    console.error(`Error updating payment status for order ${orderId}:`, error);
    throw error;
  }
};

// EmailJS functions for sending emails
export const sendOrderConfirmationEmail = async (orderData: any, userEmail: string) => {
  try {
    // Prepare delivery address string
    const deliveryAddress = `${orderData.delivery.address}, ${orderData.delivery.city}, ${orderData.delivery.postalCode}`;
    
    // Format order items for email
    const orderItemsText = orderData.items.map((item: any) => 
      `${item.name} x ${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    // Get current date in readable format
    const orderDate = new Date().toLocaleDateString('en-NG', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Prepare template parameters
    const templateParams = {
      user_name: `${orderData.delivery.firstName} ${orderData.delivery.lastName}`,
      user_email: userEmail,
      order_items: orderItemsText,
      order_total: `₦${orderData.total.toFixed(2)}`,
      delivery_address: deliveryAddress,
      order_date: orderDate,
      order_id: orderData.orderId || 'N/A'
    };
    
    // Send email using EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

export const sendContactFormEmail = async (formData: any) => {
  try {
    // Prepare template parameters for contact form
    const templateParams = {
      sender_name: formData.name,
      sender_email: formData.email,
      message: formData.message
    };
    
    // Send email using EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    
    return true;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
};

// Add TypeScript interfaces to global Window object
declare global {
  interface Window {
    PaystackPop: any;
  }
}
