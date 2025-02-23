import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "100% Organic",
      description: "All our products are certified organic, sourced directly from trusted farmers.",
      icon: "🌱"
    },
    {
      title: "Cold Pressed",
      description: "Our oils are cold-pressed to retain maximum nutrients and natural benefits.",
      icon: "🌿"
    },
    {
      title: "Pure & Natural",
      description: "No additives, preservatives, or chemical processing involved.",
      icon: "✨"
    },
    {
      title: "Health Benefits",
      description: "Rich in essential nutrients, antioxidants, and healthy fats.",
      icon: "💪"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "I've been using Murli's mustard oil for months now. The quality is exceptional!",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Rajesh Kumar",
      text: "Their flaxseed oil has become a staple in my daily diet. Excellent product!",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Anita Patel",
      text: "The purity of their products is unmatched. Highly recommended!",
      rating: "⭐⭐⭐⭐⭐"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-green-300">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Murli Organic Products
          </h1>
          <p className="text-xl text-white mb-8">
            Experience the goodness of pure, organic, cold-pressed oils
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            Shop Now
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
          Why Choose Murli Organic?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <p className="font-bold text-green-800">{testimonial.name}</p>
                <div className="mt-2">{testimonial.rating}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-4">
          Ready to Experience the Difference?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Join thousands of satisfied customers who have made the switch to organic.
        </p>
        <Button
          onClick={() => navigate('/products')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          Browse Our Products
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>Email: info@murliorganic.com</p>
            <p>Phone: +91 123 456 7890</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/products')}>Products</button></li>
              <li><button onClick={() => navigate('/about')}>About Us</button></li>
              <li><button onClick={() => navigate('/contact')}>Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-300">Facebook</a>
              <a href="#" className="hover:text-green-300">Instagram</a>
              <a href="#" className="hover:text-green-300">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;