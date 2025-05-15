
import { ref, get, query, orderByChild, limitToFirst } from "firebase/database";
import { database } from "@/lib/firebase";
import { Product } from "@/contexts/CartContext";

// Sample product data until connected to Firebase
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone X",
    price: 699.99,
    description: "The latest smartphone with cutting-edge features, a stunning display, and all-day battery life. Perfect for photography enthusiasts and mobile gamers.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHNtYXJ0cGhvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Electronics"
  },
  {
    id: "2",
    name: "Wireless Headphones",
    price: 149.99,
    description: "Premium wireless headphones with noise cancellation technology, comfortable design, and exceptional sound quality for an immersive audio experience.",
    image: "https://images.unsplash.com/photo-1578319439584-104c94d37305?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Electronics"
  },
  {
    id: "3",
    name: "Smart Watch",
    price: 249.99,
    description: "Feature-packed smartwatch with health monitoring, fitness tracking, and smartphone notifications. Stylish and functional for everyday use.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Electronics"
  },
  {
    id: "4",
    name: "Laptop Pro",
    price: 1299.99,
    description: "Powerful laptop with a fast processor, ample storage, and a high-resolution display. Perfect for professionals, creatives, and gamers alike.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Electronics"
  },
  {
    id: "5",
    name: "Casual T-Shirt",
    price: 24.99,
    description: "Comfortable cotton t-shirt with a modern fit. Available in multiple colors and sizes for everyday casual wear.",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dCUyMHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Clothing"
  },
  {
    id: "6",
    name: "Running Shoes",
    price: 89.99,
    description: "Lightweight and durable running shoes with excellent cushioning and support. Designed for comfort and performance during your workouts.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Clothing"
  },
  {
    id: "7",
    name: "Coffee Maker",
    price: 79.99,
    description: "Programmable coffee maker that brews delicious coffee with ease. Features a thermal carafe to keep your coffee hot for hours.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    category: "Home"
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    price: 59.99,
    description: "Portable Bluetooth speaker with amazing sound quality and long battery life. Perfect for outdoor adventures or home use.",
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxldXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Electronics"
  },
  {
    id: "9",
    name: "Designer Sunglasses",
    price: 129.99,
    description: "Stylish sunglasses with UV protection and polarized lenses. Combines fashion with functionality for a timeless accessory.",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Accessories"
  },
  {
    id: "10",
    name: "Scented Candle",
    price: 19.99,
    description: "Hand-poured scented candle made with natural soy wax. Creates a cozy atmosphere with its long-lasting, refreshing fragrance.",
    image: "https://images.unsplash.com/photo-1603006905393-c273523dc845?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FuZGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Home"
  },
  {
    id: "11",
    name: "Leather Wallet",
    price: 49.99,
    description: "Genuine leather wallet with multiple card slots and a sleek design. Durable and stylish for everyday use.",
    image: "https://images.unsplash.com/photo-1606503825008-909a67e63c61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2FsbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    category: "Accessories"
  },
  {
    id: "12",
    name: "Throw Blanket",
    price: 34.99,
    description: "Soft and warm throw blanket perfect for cozy evenings. Made from high-quality materials for comfort and durability.",
    image: "https://images.unsplash.com/photo-1631097797552-3a71c74a6e65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxhbmtldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    category: "Home"
  }
];

// Function to get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
      return products;
    }
    
    // If no products in database, return sample products
    // In a real application, you would seed the database first
    return sampleProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return sampleProducts;
  }
};

// Function to get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const featuredRef = query(ref(database, 'products'), orderByChild('featured'), limitToFirst(4));
    const snapshot = await get(featuredRef);
    
    if (snapshot.exists()) {
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
      return products;
    }
    
    // If no featured products in database, return first 4 sample products
    return sampleProducts.slice(0, 4);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return sampleProducts.slice(0, 4);
  }
};

// Function to get a product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.key || '',
        ...snapshot.val()
      };
    }
    
    // If product not in database, find in sample products
    const sampleProduct = sampleProducts.find(p => p.id === productId);
    return sampleProduct || null;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    const sampleProduct = sampleProducts.find(p => p.id === productId);
    return sampleProduct || null;
  }
};
