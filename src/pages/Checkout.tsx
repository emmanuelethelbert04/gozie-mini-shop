import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  createOrder,
  processPaystackPayment,
  processBankTransferPayment,
  processUSSDPayment,
  sendOrderConfirmationEmail
} from "@/services/orderService";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Phone, Building, ArrowRight } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  paymentMethod: z.enum(["Paystack", "Bank Transfer", "USSD"]),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentDetails {
  method: "Paystack" | "Bank Transfer" | "USSD";
  amount: number;
  status: string;
  reference?: string;
}

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
      email: currentUser?.email || "",
      paymentMethod: "Paystack",
    },
  });

  // Watch the payment method to conditionally display fields
  const paymentMethod = form.watch("paymentMethod");

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
      
      // Create order items from cart
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      // Base order data
      const orderData = {
        userId: currentUser.uid,
        userEmail: values.email,
        items: orderItems,
        delivery: {
          firstName: values.firstName,
          lastName: values.lastName,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          phone: values.phone,
        },
        payment: {
          method: values.paymentMethod,
          amount: cartTotal,
          status: "pending",
        } as PaymentDetails,
        total: cartTotal,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Create the order first
      const orderId = await createOrder(orderData);
      console.log("Order created with ID:", orderId);
      
      // Handle payment based on the selected method
      if (values.paymentMethod === "Paystack") {
        // Process Paystack payment
        const metadata = {
          orderId: orderId,
          customer_name: `${values.firstName} ${values.lastName}`
        };
        
        await processPaystackPayment(values.email, cartTotal, metadata, async (response: any) => {
          console.log("Paystack response:", response);
          if (response.status === "success") {
            // Send confirmation email with the orderId
            await sendOrderConfirmationEmail({
              ...orderData,
              orderId: orderId
            }, values.email);
            
            // Clear cart and redirect to success page
            clearCart();
            navigate(`/order-confirmation/${orderId}`);
            toast.success("Payment successful! Your order has been placed.");
          }
        });
      } 
      else if (values.paymentMethod === "Bank Transfer") {
        // Process bank transfer
        await processBankTransferPayment(orderId, {
          amount: cartTotal,
          bankName: "Gozie Bank Ltd",
          accountNumber: "0123456789",
          accountName: "Gozie Mini Store Ltd"
        });
        
        // Send confirmation email with the orderId
        await sendOrderConfirmationEmail({
          ...orderData,
          orderId: orderId
        }, values.email);
        
        // Clear cart and redirect to success page
        clearCart();
        navigate(`/order-confirmation/${orderId}`);
        toast.success("Order placed successfully! Please complete your bank transfer.");
      } 
      else if (values.paymentMethod === "USSD") {
        // Process USSD payment
        await processUSSDPayment(orderId);
        
        // Send confirmation email with the orderId
        await sendOrderConfirmationEmail({
          ...orderData,
          orderId: orderId
        }, values.email);
        
        // Clear cart and redirect to success page
        clearCart();
        navigate(`/order-confirmation/${orderId}`);
        toast.success("Order placed successfully! Please complete your USSD payment.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md border-yellow-300">
            <CardHeader>
              <CardTitle className="text-red-600">Delivery Information</CardTitle>
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
                            <Input placeholder="John" {...field} className="focus:border-yellow-400" />
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
                            <Input placeholder="Doe" {...field} className="focus:border-yellow-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} className="focus:border-yellow-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} className="focus:border-yellow-400" />
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
                            <Input placeholder="Lagos" {...field} className="focus:border-yellow-400" />
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
                            <Input placeholder="10001" {...field} className="focus:border-yellow-400" />
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
                          <Input placeholder="+234 701 234 5678" {...field} className="focus:border-yellow-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-6 bg-yellow-200" />

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-red-600">Payment Method</h3>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${field.value === 'Paystack' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="Paystack" id="paystack" />
                                <FormLabel htmlFor="paystack" className="cursor-pointer flex items-center">
                                  <CreditCard className="mr-2 h-5 w-5 text-red-600" />
                                  Paystack
                                </FormLabel>
                              </div>
                              
                              <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${field.value === 'Bank Transfer' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="Bank Transfer" id="bank" />
                                <FormLabel htmlFor="bank" className="cursor-pointer flex items-center">
                                  <Building className="mr-2 h-5 w-5 text-red-600" />
                                  Bank Transfer
                                </FormLabel>
                              </div>
                              
                              <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${field.value === 'USSD' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                                <RadioGroupItem value="USSD" id="ussd" />
                                <FormLabel htmlFor="ussd" className="cursor-pointer flex items-center">
                                  <Phone className="mr-2 h-5 w-5 text-red-600" />
                                  USSD
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment Method Specific Fields */}
                  {paymentMethod === "Paystack" && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border border-yellow-200">
                      <h4 className="text-md font-medium text-red-600">Paystack Payment</h4>
                      <div className="text-sm text-gray-600">
                        <p>Click "Place Order" to proceed to the Paystack payment gateway.</p>
                        <p>You will be redirected to complete your payment securely.</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "Bank Transfer" && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border border-yellow-200">
                      <h4 className="text-md font-medium text-red-600">Bank Transfer Details</h4>
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="font-medium">Bank Name:</span>
                          <span>Gozie Bank Ltd</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Account Number:</span>
                          <span>0123456789</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Account Name:</span>
                          <span>Gozie Mini Store Ltd</span>
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Please include your name and phone number in the transfer reference.</p>
                        <p>Your order will be processed after payment confirmation.</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "USSD" && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border border-yellow-200">
                      <h4 className="text-md font-medium text-red-600">USSD Payment</h4>
                      <div className="bg-yellow-100 p-3 rounded-md text-center">
                        <p className="text-lg font-bold">*737*34*5000#</p>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>1. Dial the USSD code above on your phone</p>
                        <p>2. Follow the prompts to complete the payment</p>
                        <p>3. Use your order number as reference</p>
                        <p>4. Your order will be processed after payment confirmation</p>
                      </div>
                    </div>
                  )}

                  <div className="md:hidden">
                    <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
                    <Button 
                      type="submit" 
                      className="w-full mt-4 bg-yellow-500 hover:bg-red-500 hover:text-yellow-400 transition-colors"
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
            <Card className="shadow-md border-yellow-300">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="text-red-600">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="w-full bg-yellow-500 hover:bg-red-500 hover:text-yellow-400 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : (
                    <>
                      Place Order <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
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
            <span className="text-yellow-700">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium">₦{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Separator className="bg-yellow-200" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>

      <Separator className="bg-yellow-200" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span className="text-red-600">₦{cartTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Checkout;
