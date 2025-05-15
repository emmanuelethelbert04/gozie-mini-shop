
import React from "react";
import { Product } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the product modal
    addToCart(product);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer hover-scale"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 truncate">{product.category}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="rounded-full"
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
