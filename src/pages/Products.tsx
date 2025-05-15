
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Product } from "@/contexts/CartContext";
import { getAllProducts } from "@/services/productService";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category") as string] : []
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));
        setCategories(uniqueCategories);
        
        // Apply initial filtering
        applyFilters(allProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters(products);
  }, [searchQuery, sortBy, selectedCategories]);

  const applyFilters = (productsToFilter: Product[]) => {
    let result = [...productsToFilter];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // featured is default, no sorting needed
      default:
        break;
    }
    
    setFilteredProducts(result);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL query parameters
    if (searchQuery) {
      searchParams.set("q", searchQuery);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category.toLowerCase()) 
        ? prev.filter(c => c !== category.toLowerCase()) 
        : [...prev, category.toLowerCase()];
        
      // Update URL query parameters
      if (newCategories.length > 0) {
        searchParams.set("category", newCategories.join(","));
      } else {
        searchParams.delete("category");
      }
      setSearchParams(searchParams);
        
      return newCategories;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("featured");
    setSelectedCategories([]);
    searchParams.delete("q");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
          <Input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Narrow down products by category
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category.toLowerCase())}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Applied filters */}
      {(selectedCategories.length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategories.map(category => (
            <div key={category} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
              {category}
              <button 
                onClick={() => handleCategoryChange(category)}
                className="ml-2 text-primary/70 hover:text-primary"
              >
                &times;
              </button>
            </div>
          ))}
          {searchQuery && (
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
              Search: {searchQuery}
              <button 
                onClick={() => {
                  setSearchQuery("");
                  searchParams.delete("q");
                  setSearchParams(searchParams);
                }}
                className="ml-2 text-primary/70 hover:text-primary"
              >
                &times;
              </button>
            </div>
          )}
          <button 
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow p-4 animate-pulse">
              <div className="h-48 bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => openProductModal(product)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
      
      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeProductModal} 
      />
    </div>
  );
};

export default Products;
