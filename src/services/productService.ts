
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { Product } from "@/contexts/CartContext";

// Fetch all products from Firebase
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // For demonstration, we'll use mock data as we don't have initial products
    // In a real app, you would fetch from: const productsRef = ref(database, 'products');
    
    // Mock products data
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Wireless Headphones",
        price: 79.99,
        description: "Premium wireless headphones with noise cancellation and 20-hour battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Electronics"
      },
      {
        id: "2",
        name: "Smart Watch",
        price: 149.99,
        description: "Feature-rich smart watch with health tracking, notifications, and apps.",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Electronics"
      },
      {
        id: "3",
        name: "Cotton T-Shirt",
        price: 19.99,
        description: "Soft and comfortable 100% cotton t-shirt, perfect for everyday wear.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Clothing"
      },
      {
        id: "4",
        name: "Coffee Maker",
        price: 89.99,
        description: "Programmable coffee maker with 12-cup capacity and auto shut-off.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Home"
      },
      {
        id: "5",
        name: "Backpack",
        price: 49.99,
        description: "Durable backpack with multiple compartments and laptop sleeve.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Accessories"
      },
      {
        id: "6",
        name: "Portable Speaker",
        price: 59.99,
        description: "Waterproof portable speaker with 10-hour battery life.",
        image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Electronics"
      },
      {
        id: "7",
        name: "Desk Lamp",
        price: 29.99,
        description: "Adjustable desk lamp with multiple brightness levels and USB charging port.",
        image: "https://images.unsplash.com/photo-1534277376214-8591ba42884b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Home"
      },
      {
        id: "8",
        name: "Yoga Mat",
        price: 34.99,
        description: "Non-slip yoga mat with carrying strap, perfect for home workouts.",
        image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "Fitness"
      }
    ];
    
    return mockProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch featured products (subset of all products)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    // Return first 4 products as featured
    return allProducts.slice(0, 4);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};
