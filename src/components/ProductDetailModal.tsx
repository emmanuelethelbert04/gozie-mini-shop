
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Minus, 
  Plus, 
  ShoppingCart
} from "lucide-react";
import { useCart, Product } from "@/contexts/CartContext";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-full">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
              <p className="text-sm text-gray-500">{product.category}</p>
            </DialogHeader>
            
            <p className="text-primary text-2xl font-bold mt-4">${product.price.toFixed(2)}</p>
            
            <div className="mt-4 flex-grow">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Quantity</span>
                <div className="flex items-center border rounded">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-1">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleAddToCart} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
