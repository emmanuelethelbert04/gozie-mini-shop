
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="text-xl font-heading font-bold text-primary flex items-center">
            ShopMini
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary transition-colors">
              Products
            </Link>
            {currentUser && (
              <Link to="/orders" className="text-gray-700 hover:text-primary transition-colors">
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* User and Cart actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </div>
            )}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
                onClick={toggleMobileMenu}
              >
                Products
              </Link>
              {currentUser && (
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  onClick={toggleMobileMenu}
                >
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  onClick={toggleMobileMenu}
                >
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-2 border-t">
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="block text-gray-700 hover:text-primary transition-colors px-2 py-1"
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="w-full text-left text-gray-700 hover:text-primary transition-colors px-2 py-1"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-2">
                    <Button variant="outline" onClick={() => {
                      navigate("/login");
                      toggleMobileMenu();
                    }}>
                      Login
                    </Button>
                    <Button onClick={() => {
                      navigate("/register");
                      toggleMobileMenu();
                    }}>
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
