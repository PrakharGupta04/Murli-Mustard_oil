import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = (subtotal) => {
    return subtotal > 1000 ? subtotal * 0.1 : 0;
  };

  const calculateGST = (amount) => {
    return amount * 0.05;
  };

  const handlePayment = async () => {
    try {
      // Clear any previous errors
      setError('');

      // Calculate amounts
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount(subtotal);
      const amountAfterDiscount = subtotal - discount;
      const gst = calculateGST(amountAfterDiscount);
      const totalAmount = amountAfterDiscount + gst;

      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        setError('Failed to load payment gateway. Please try again.');
        return;
      }

      // Get and format authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        return;
      }
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      // Create order
      const orderResponse = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // Convert to paise
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_F2SLDLGxSqdknW', // Replace with your key
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'Murli Organic',
        description: 'Purchase from Murli Organic',
        handler: async function(response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('http://localhost:5000/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.message || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Clear cart and redirect on success
              localStorage.removeItem('cart');
              navigate('/order-success');
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed');
            console.error('Payment Verification Error:', err);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
        theme: {
          color: '#15803d'
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled by user');
          }
        }
      };

      // Initialize Razorpay
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setError(err.message || 'Failed to process payment');
      console.error('Payment Processing Error:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <Button 
          onClick={() => navigate('/products')}
          className="mt-4 bg-green-600 hover:bg-green-700"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const amountAfterDiscount = subtotal - discount;
  const gst = calculateGST(amountAfterDiscount);
  const totalAmount = amountAfterDiscount + gst;

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-900">
            Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount (10% off on orders above ₹1000)</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;