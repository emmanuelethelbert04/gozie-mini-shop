
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { getFeaturedProducts } from "@/services/productService";

const Home = () => {
  const { currentUser } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden" style={{height: "600px"}}>
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full py-16"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')" }}
        >
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative h-full container mx-auto px-4 py-16 flex flex-col justify-center items-start z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl font-heading">
            Welcome to Gozie Mini Store
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl opacity-90">
            Shop quality groceries & household items – Fast, Reliable, Affordable
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-destructive hover:text-white text-lg px-8 py-6 font-bold transition-all duration-300 shadow-lg"
              asChild
            >
              <Link to="/products">Start Shopping</Link>
            </Button>
            {!currentUser && (
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white bg-white/10 font-medium px-8 py-6 hover:bg-white hover:text-primary "
                asChild
              >
                <Link to="/register">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link 
              to="/products" 
              className="text-destructive hover:underline font-medium"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 mb-4 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-primary rounded-full w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => openProductModal(product)} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Product Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Groceries", "Provisions", "Household", "Beverages"].map((category) => (
              <Link 
                key={category} 
                to={`/products?category=${category.toLowerCase()}`} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group border border-gray-100"
              >
                <div className="h-32 md:h-48 bg-gray-100 flex items-center justify-center p-4">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 group-hover:text-destructive transition-colors">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Why Choose Gozie Mini Store</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Products</h3>
              <p className="text-gray-600">We offer only the highest quality groceries and household items.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your groceries and household items delivered quickly to your doorstep.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is always available to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeProductModal} 
      />
    </div>
  );
};

export default Home;
