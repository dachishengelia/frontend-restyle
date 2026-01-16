import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cancel() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment canceled', {
      icon: '✖',
      autoClose: 4000,
    });
    // Redirect based on checkout type
    const checkoutType = localStorage.getItem('checkoutType');
    setTimeout(() => {
      if (checkoutType === 'single') {
        const productId = localStorage.getItem('checkoutProductId');
        localStorage.removeItem('checkoutType');
        localStorage.removeItem('checkoutProductId');
        navigate(`/product/${productId}`);
      } else if (checkoutType === 'cv') {
        localStorage.removeItem('checkoutType');
        navigate('/cv-marketplace');
      } else {
        localStorage.removeItem('checkoutType');
        navigate('/');
      }
    }, 1000);
  }, [navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled ✖</h1>
      <p className="mt-4 text-lg text-gray-700">Redirecting...</p>
    </div>
  );
}

 