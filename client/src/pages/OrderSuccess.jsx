// src/pages/OrderSuccess.jsx
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Button } from './Button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Order Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-gray-600">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            <p className="text-gray-600">
              You will receive an email confirmation shortly with your order details.
            </p>
            
            <div className="flex gap-4 justify-center mt-6">
              <Button 
                onClick={() => navigate('/orders')}
                className="bg-green-600 hover:bg-green-700"
              >
                View Orders
              </Button>
              <Button 
                onClick={() => navigate('/products')}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;