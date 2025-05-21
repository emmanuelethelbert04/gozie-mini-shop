
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { database } from "@/lib/firebase";
import { ref, push, set, serverTimestamp as rtdbServerTimestamp } from "firebase/database";
import { Map, Mail, Phone, Home, Send, Loader2 } from "lucide-react";
import { sendContactFormEmail } from "@/services/orderService";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Add document to Realtime Database
      const messagesRef = ref(database, "messages");
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      // Send email via EmailJS
      await sendContactFormEmail({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      // Reset form and show success message
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message Sent!", {
        description: "We'll get back to you as soon as possible.",
        icon: <Send className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error", {
        description: "There was a problem sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-red-600">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Information */}
        <Card className="shadow-md border-yellow-300 transform transition-all hover:shadow-lg">
          <CardHeader className="bg-yellow-50 border-b border-yellow-100">
            <CardTitle className="text-2xl text-red-600">Our Information</CardTitle>
            <CardDescription>Reach out to us through any of these channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Phone Number</h3>
                <p className="text-gray-600">+234 7012345678</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Email Address</h3>
                <p className="text-gray-600">support@goziestore.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Store Address</h3>
                <p className="text-gray-600">123 Market Road, Lagos, Nigeria</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Map className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Business Hours</h3>
                <p className="text-gray-600">Monday-Friday: 8:00 AM - 8:00 PM</p>
                <p className="text-gray-600">Saturday-Sunday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Form */}
        <Card className="shadow-md border-yellow-300 transform transition-all hover:shadow-lg">
          <CardHeader className="bg-yellow-50 border-b border-yellow-100">
            <CardTitle className="text-2xl text-red-600">Send Us a Message</CardTitle>
            <CardDescription>We'll respond as soon as possible</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${errors.name ? "border-red-500" : "focus:border-yellow-400"}`}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${errors.email ? "border-red-500" : "focus:border-yellow-400"}`}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message" 
                  name="message" 
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full rounded-md border ${errors.message ? 'border-red-500' : 'border-input focus:border-yellow-400'} bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                />
                {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-red-600 hover:text-yellow-300 transition-all duration-300 transform active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Google Maps Embed */}
      <Card className="overflow-hidden shadow-md border-yellow-300 mb-12">
        <CardHeader className="bg-yellow-50 border-b border-yellow-100">
          <CardTitle className="text-2xl text-red-600">Find Us</CardTitle>
          <CardDescription>Visit our store location</CardDescription>
        </CardHeader>
        <div className="h-[400px] w-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.4647211192!2d3.13434355!3d6.5482201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1652864807293!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Gozie Mini Store Location"
          ></iframe>
        </div>
      </Card>
    </div>
  );
};

export default Contact;
