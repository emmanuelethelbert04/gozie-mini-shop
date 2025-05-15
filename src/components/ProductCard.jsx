
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening the product modal
    addToCart(product);
  };

  return (
    <Card 
      className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 truncate">{product.category}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-destructive font-bold">${product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="rounded-full bg-primary text-primary-foreground hover:bg-destructive hover:text-white transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
