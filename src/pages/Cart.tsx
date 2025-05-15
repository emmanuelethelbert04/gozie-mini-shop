
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error("Please login to continue to checkout");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
              </div>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row">
                    <div className="w-full sm:w-20 h-20 mr-4 mb-4 sm:mb-0 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-muted/30 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCheckout}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
