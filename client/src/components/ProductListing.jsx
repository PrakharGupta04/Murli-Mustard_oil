import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Changed from Next.js router
import { Card, CardContent } from "../pages/Card";
import { Button } from "../pages/Button";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const API_URL = "http://localhost:5000"; // Your backend URL

const ProductCard = ({ product, addToCart }) => (
  <Card className="shadow-xl rounded-lg bg-white border border-green-500">
    <Carousel showThumbs={false} infiniteLoop autoPlay>
      {product.images.map((image, index) => (
        <div key={index}>
          <img 
            src={image} 
            alt={`${product.name} ${index + 1}`} 
            className="w-full h-56 object-cover"
          />
        </div>
      ))}
    </Carousel>
    <CardContent className="p-6">
      <h2 className="text-2xl font-bold text-green-900 font-serif">{product.name}</h2>
      <p className="text-gray-700 mt-2 font-light text-lg">{product.description}</p>
      <p className="text-xl font-semibold text-green-700 mt-2">₹{product.price}</p>
      <Button 
        className="bg-green-900 text-white mt-3 px-6 py-2 hover:bg-green-700 focus:ring-2 focus:ring-green-500" 
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </Button>
    </CardContent>
  </Card>
);

const FMCGProductListing = () => {
  const navigate = useNavigate(); // Changed from useRouter
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch products from backend
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));

    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const filteredProducts = useMemo(() =>
    products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm, products]
  );

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-green-100 to-green-300 font-sans">
      <div className="flex items-center justify-between mb-8">
        <img src="https://img.favpng.com/20/6/14/university-of-missouri-missouri-tigers-football-logo-missouri-tigers-baseball-png-favpng-UPfET8DifHh1ucUb7LRJrKuNG.jpg" alt="Murli Logo" className="h-20" />
        <h1 className="text-5xl font-extrabold text-green-900 font-serif">
          Murli Organic Products
        </h1>
      </div>
      <input
        type="text"
        placeholder="Search Murli products..."
        className="w-full p-4 mb-8 border border-green-500 rounded-md text-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default FMCGProductListing;