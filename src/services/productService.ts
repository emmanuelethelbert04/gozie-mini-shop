
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { Product } from "@/contexts/CartContext";

// Fetch all products from Firebase
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // For demonstration, we'll use mock data as we don't have initial products
    // In a real app, you would fetch from: const productsRef = ref(database, 'products');
    
    // Mock products data for Gozie Mini Store
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Golden Morn",
        price: 12.99,
        description: "Delicious golden morn cereal, perfect for breakfast.",
        image: "https://images.unsplash.com/photo-1575386248261-11d1a01795a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Groceries"
      },
      {
        id: "2",
        name: "Cornflakes",
        price: 9.99,
        description: "Crunchy cornflakes cereal that stays crispy in milk.",
        image: "https://images.unsplash.com/photo-1600788284-cbc4ff0df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Groceries"
      },
      {
        id: "3",
        name: "Noodles Pack",
        price: 5.99,
        description: "Pack of instant noodles, ready in just 3 minutes.",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Groceries"
      },
      {
        id: "4",
        name: "Spaghetti",
        price: 7.99,
        description: "Premium quality spaghetti pasta.",
        image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Groceries"
      },
      {
        id: "5",
        name: "Red Wine",
        price: 24.99,
        description: "Premium quality red wine perfect for special occasions.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Beverages"
      },
      {
        id: "6",
        name: "Coffee Pack",
        price: 15.99,
        description: "Premium coffee blend for the perfect morning brew.",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Beverages"
      },
      {
        id: "7",
        name: "Soft Drinks Pack",
        price: 8.99,
        description: "Pack of assorted soft drinks for your refreshment.",
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Beverages"
      },
      {
        id: "8",
        name: "Biscuits Variety Pack",
        price: 6.99,
        description: "Assorted biscuits perfect for tea time or snacks.",
        image: "https://images.unsplash.com/photo-1590679915005-5c13e880f002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Provisions"
      },
      {
        id: "9",
        name: "Bar Soap Pack",
        price: 7.99,
        description: "Pack of 4 premium quality bar soaps.",
        image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Household"
      },
      {
        id: "10",
        name: "Detergent",
        price: 11.99,
        description: "High-quality laundry detergent for effective cleaning.",
        image: "https://images.unsplash.com/photo-1631726089065-0c4775c86f51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Household"
      },
      {
        id: "11",
        name: "Vegetable Oil",
        price: 18.99,
        description: "100% pure vegetable oil for all your cooking needs.",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Provisions"
      },
      {
        id: "12",
        name: "Premium Rice",
        price: 22.99,
        description: "Premium quality rice, 5kg bag.",
        image: "https://images.unsplash.com/photo-1536304447766-ccc345fc133b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        category: "Groceries"
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
