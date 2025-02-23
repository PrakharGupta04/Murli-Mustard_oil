import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-green-500' : 'text-gray-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="ml-2 text-xl font-bold text-green-900">Murli Organic</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/products" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/products')}`}>
                Products
              </Link>
              {isLoggedIn && (
                <Link to="/checkout" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/checkout')}`}>
                  Checkout
                </Link>
              )}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn ? (
              <Button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/products')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            {isLoggedIn && (
              <Link
                to="/checkout"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${isActive('/checkout')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Checkout
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;