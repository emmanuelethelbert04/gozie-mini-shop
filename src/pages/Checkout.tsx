
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { createOrder } from "@/services/orderService";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  phone: z.string().min(5, "Phone number is required"),
  cardNumber: z.string().min(16, "Card number is required").max(16),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cardCvc: z.string().min(3, "CVC is required").max(4),
});

type FormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!currentUser) {
      toast.error("You must be logged in to checkout");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/products");
      return;
    }

    try {
      setIsLoading(true);

      // Create order in Firebase
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const orderData = {
        userId: currentUser.uid,
        items: orderItems,
        delivery: {
          firstName: values.firstName,
          lastName: values.lastName,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          phone: values.phone,
        },
        paymentMethod: "Credit Card",
        total: cartTotal,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const orderId = await createOrder(orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
              <CardDescription>
                Enter your shipping details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Details</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="4111 1111 1111 1111" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardCvc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
                    <Button 
                      type="submit" 
                      className="w-full mt-4" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = ({ cartItems, cartTotal }: { cartItems: any[], cartTotal: number }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {cartItems.map(item => (
          <div key={item.product.id} className="flex justify-between">
            <span className="text-muted-foreground">
              {item.product.name} × {item.quantity}
            </span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Checkout;
