import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../pages/Card";
import { Button } from "../pages/Button";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const initialProducts = [
  { id: 1, name: "Murli Mustard Oil", images: ["https://img.freepik.com/free-vector/set-electric-mosquito-killer-banner_105738-583.jpg?t=st=1740140921~exp=1740144521~hmac=aefb867a722ab992f62a4e6a0322947265c186f1651d73fb13096bf4c0bcdfb8&w=1800", "https://img.freepik.com/free-vector/set-electric-mosquito-killer-banner_105738-583.jpg?t=st=1740140921~exp=1740144521~hmac=aefb867a722ab992f62a4e6a0322947265c186f1651d73fb13096bf4c0bcdfb8&w=1800"], description: "Murli Mustard Oil is 100% pure and natural, known for its strong antibacterial properties. It enhances digestion, boosts immunity, and is perfect for both cooking and skincare.", price: 220, stock: 20 },
  { id: 2, name: "Murli Flaxseed Oil", images: ["https://www.biospectrumindia.com/uploads/articles/ultimate_guide_to_your_product_launch-11552.jpg", "https://www.biospectrumindia.com/uploads/articles/ultimate_guide_to_your_product_launch-11552.jpg"], description: "Murli Flaxseed Oil is a rich source of Omega-3 fatty acids, promoting heart health, reducing inflammation, and improving overall well-being.", price: 300, stock: 30 },
  { id: 3, name: "Murli Sesame Seed Oil", images: ["https://www.biospectrumindia.com/uploads/articles/ultimate_guide_to_your_product_launch-11552.jpg", "https://www.biospectrumindia.com/uploads/articles/ultimate_guide_to_your_product_launch-11552.jpg"], description: "Murli Sesame Seed Oil is high in antioxidants and beneficial for skin health. It helps lower blood pressure and supports overall wellness.", price: 250, stock: 15 },
  { id: 4, name: "Murli Castor Seed Oil", images: ["https://www.biospectrumindia.com/uploads/articles/ultimate_guide_to_your_product_launch-11552.jpg", "https://www.biospectrumindia.com/uploads/articles/ultimate_guide_to_your_product_launch-11552.jpg"], description: "Murli Castor Seed Oil is a natural remedy for hair growth, skin hydration, and inflammation relief. It also acts as a powerful detoxifying agent.", price: 300, stock: 25 }
];

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

const FMCGProductListingWithCart = () => {
  const navigate = useNavigate(); // Changed from useRouter
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const itemIndex = updatedCart.findIndex((item) => item.id === product.id);
      if (itemIndex !== -1) {
        updatedCart[itemIndex].quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }
      return updatedCart;
    });
  }, []);

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    navigate("/checkout"); // Changed from router.push
  };

  const filteredProducts = useMemo(() =>
    initialProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-green-100 to-green-300 font-sans">
      <div className="flex items-center justify-between mb-8">
        <img src="/images/murli-logo.png" alt="Murli Logo" className="h-20" />
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
      <div className="mt-8 p-6 bg-green-200 rounded-lg">
        <h2 className="text-2xl font-bold text-green-900">Cart</h2>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="text-lg flex justify-between items-center">
                {item.name} - ₹{item.price} x {item.quantity}
                <Button
                  className="ml-4 bg-red-600 text-white px-2 py-1"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
        {cart.length > 0 && (
          <Button
            className="bg-green-800 text-white mt-4 px-6 py-2"
            onClick={handleCheckout}
          >
            Proceed to Payment
          </Button>
        )}
      </div>
    </div>
  );
};

export default FMCGProductListingWithCart;