
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening the product modal
    addToCart(product);
  };

  return (
    <div 
      className="product-card hover-scale cursor-pointer"
      onClick={onClick}
    >
      <div className="product-card-image">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="product-card-content">
        <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 truncate">{product.category}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-destructive font-bold">${product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="rounded-full bg-primary text-primary-foreground hover:bg-destructive hover:text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
