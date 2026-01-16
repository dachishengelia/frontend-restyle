import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import CheckoutButton from "../components/CheckoutButton.jsx";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function CartPage({ products, cart, updateCart, removeFromCart, clearCart }) {
   const { theme } = useContext(ThemeContext);

   const items = cart.map(item => ({
     product: products.find(p => p._id === item.id),
     quantity: item.quantity
   })).filter(item => item.product);

   const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) quantity = 1;
    updateCart(productId, quantity);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className={`p-8 max-w-6xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          Your Cart
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">Your cart is empty.</p>
            <p className="text-gray-400 dark:text-gray-500">Add some items to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.product._id}
                className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg shadow-md border transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={item.product.imageUrl || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-lg shadow-sm"
                  />
                  <div className="ml-6 flex-1">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2">{item.product.name}</h3>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{item.product.price} GEL</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center space-x-3 mr-6">
                    <button
                      onClick={() => updateCart(item.product._id, item.quantity - 1)}
                      className={`p-3 rounded-full transition-colors min-h-[44px] min-w-[44px] ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCart(item.product._id, parseInt(e.target.value))
                      }
                      className={`w-16 text-center border rounded-lg py-3 px-3 font-semibold min-h-[44px] ${theme === 'dark' ? 'bg-gray-600 text-gray-100 border-gray-500' : 'bg-white text-gray-900 border-gray-300'}`}
                    />
                    <button
                      onClick={() => updateCart(item.product._id, item.quantity + 1)}
                      className={`p-3 rounded-full transition-colors min-h-[44px] min-w-[44px] ${theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors min-h-[44px]"
                  >
                    <Trash2 className="w-5 h-5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className={`mt-8 p-6 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="text-lg text-gray-600 dark:text-gray-400">Items in cart: <span className="font-semibold">{items.length}</span></p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Total: {total.toFixed(2)} GEL</h3>
                </div>
                <div className="flex space-x-4">
                  <CheckoutButton items={items} />
                  <button
                    onClick={clearCart}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
