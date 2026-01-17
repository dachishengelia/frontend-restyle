// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../axios.js";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { ThemeContext } from "../context/ThemeContext.jsx";

// export default function ProductDetails() {
//    const { productId } = useParams();
//    const navigate = useNavigate();
//    const [product, setProduct] = useState(null);
//    const [error, setError] = useState(null);
//    const { user } = useContext(AuthContext);
//    const { theme } = useContext(ThemeContext);
//    const [comments, setComments] = useState([]);
//    const [commentInput, setCommentInput] = useState("");

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axios.get(`/api/products/${productId}`);
//         setProduct(data);
//       } catch (err) {
//         if (err.response && err.response.status === 404) {
//           setError("Product not found");
//         } else {
//           setError("Failed to fetch product details");
//         }
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   useEffect(() => {
//     setComments(product?.comments || []);
//   }, [product]);

//   const handleAddComment = async () => {
//     if (!user) return alert("Please log in to comment");
//     if (!commentInput.trim()) return;

//     try {
//       const res = await axios.post(
//         `https://restyle-backend123.vercel.app/api/product-actions/${productId}/comment`,
//         { text: commentInput.trim() },
//         { withCredentials: true }
//       );
//       setComments(res.data.comments);
//       setCommentInput("");
//     } catch (err) {
//       console.error("Comment error:", err);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!user) return;
//     try {
//       const res = await axios.delete(
//         `https://restyle-backend123.vercel.app/api/product-actions/${productId}/comment/${commentId}`,
//         { withCredentials: true }
//       );
//       setComments(res.data.comments);
//     } catch (err) {
//       console.error("Delete comment error:", err);
//     }
//   };

//   if (error) {
//     return (
//       <div className="p-6 max-w-3xl mx-auto text-center">
//         <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
//         <button
//           onClick={() => navigate("/")}
//           className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
//         >
//           Go Back to Home
//         </button>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-500 text-xl animate-pulse">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//     {/* Product Card */}
//     <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row`}>
      
//       {/* Image Section */}
//       <div className={`md:w-1/2 flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
//         <img
//           src={product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
//           alt={product.name}
//           className="w-full h-auto rounded-lg object-cover max-h-[400px]"
//         />
//       </div>
  
//       {/* Details Section */}
//       <div className="md:w-1/2 p-8 flex flex-col justify-between">
//         <div>
//           <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//             {product.name}
//           </h2>
//           <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//             {product.description}
//           </p>
//           <p className="text-2xl font-semibold mb-4 text-green-600">
//             {product.price} GEL
//           </p>
  
//           {product.sizes?.length > 0 && (
//             <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//               Available Sizes: {product.sizes.join(", ")}
//             </p>
//           )}
//           {product.colors?.length > 0 && (
//             <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//               Available Colors: {product.colors.join(", ")}
//             </p>
//           )}
  
//           <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//             Seller: <span className="font-medium">{product.sellerId?.username || "Unknown"}</span>
//           </p>
//         </div>
  
//         <div className="flex flex-col gap-4">
//           <button
//             disabled
//             className={`w-full px-6 py-3 rounded-lg text-lg font-semibold text-white opacity-50 cursor-not-allowed ${
//               theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
//             }`}
//           >
//             Add to Cart
//           </button>
//           <button
//             disabled
//             className={`w-full px-6 py-3 rounded-lg text-lg font-semibold text-white opacity-50 cursor-not-allowed ${
//               theme === 'dark' ? 'bg-green-700' : 'bg-green-600'
//             }`}
//           >
//             Buy Now
//           </button>
           
//         </div>
//       </div>
//     </div>
  
//     {/* Comments Section */}
//     <div className={`mt-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-xl p-6`}>
//       <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//         Comments
//       </h3>
  
//       <div className="mb-4">
//         {comments.length === 0 ? (
//           <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>No comments yet.</p>
//         ) : (
//           comments.map((c) => (
//             <div
//               key={c._id || c.createdAt}
//               className={`mb-2 border-b pb-1 ${
//                 theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-200 text-gray-800'
//               }`}
//             >
//               <span className="font-semibold">{c.username}:</span> <span>{c.text}</span>
//               <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
//               {user && (user._id === c.userId || user.role === "admin") && (
//                 <button
//                   onClick={() => handleDeleteComment(c._id)}
//                   className="text-red-500 text-xs ml-2"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
  
//       {user && (
//         <div>
//           <input
//             type="text"
//             value={commentInput}
//             onChange={(e) => setCommentInput(e.target.value)}
//             placeholder="Add a comment..."
//             className={`w-full p-2 mb-2 rounded border ${
//               theme === 'dark'
//                 ? 'bg-gray-900 text-gray-200 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
//                 : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
//             }`}
//           />
//           <button
//             onClick={handleAddComment}
//             className={`px-4 py-2 rounded text-white transition ${
//               theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
//             }`}
//           >
//             Add Comment
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
  
//     );
//   }

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Heart, MessageCircle, ShoppingCart, CreditCard, ThumbsUp, ThumbsDown, User, Trash2 } from 'lucide-react';

export default function ProductDetails({ cart, addToCart, removeFromCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Fetch initial likes/dislikes data
  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}/likes`, {
          withCredentials: true
        });
        setLikesCount(res.data.likesCount || 0);
        setDislikesCount(res.data.dislikesCount || 0);
        setUserLiked(res.data.liked || false);
        setUserDisliked(res.data.disliked || false);
      } catch (err) {
        // If fetch fails, keep defaults (0, false)
        console.error("Failed to fetch likes data:", err);
      }
    };

    if (productId) {
      fetchLikesData();
    }
  }, [productId]);

  // Removed getToken as we use withCredentials for auth

  const isInCart = Array.isArray(cart) && cart.some((item) => item.id === productId);

  // Fetch product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await axios.get(`/api/products/${productId}`);
        setProduct(productData);
        setComments(productData.comments || []);
        setLikesCount(productData.likesCount || 0);
        setDislikesCount(productData.dislikesCount || 0);
      } catch (err) {
        if (err.response && err.response.status === 404) setError("Product not found");
        else setError("Failed to fetch product details");
      }
    };
    fetchData();
  }, [productId]);

  // Check for payment status in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    if (payment === 'success') {
      toast.success('Payment successful', {
        icon: '✔',
        autoClose: 4000,
      });
    } else if (payment === 'cancel') {
      toast.error('Payment canceled', {
        icon: '✖',
        autoClose: 4000,
      });
    }
    // Clear the query param to avoid re-showing on refresh
    if (payment) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Add or remove product from cart
  const handleCartAction = () => {
    if (!user) {
      toast.error("Please log in to add to cart");
      return;
    }

    if (isInCart) {
      removeFromCart(productId);
      toast.success("Removed from cart");
    } else {
      addToCart(productId);
      toast.success("Added to cart");
    }
  };

  // Checkout single product
  const handleCheckout = async () => {
    try {
      const transformedItem = {
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_PROD}/api/checkout/create-checkout-session`,
        { items: [transformedItem], productId },
        { withCredentials: true }
      );

      localStorage.setItem('checkoutType', 'single');
      localStorage.setItem('checkoutProductId', productId);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  // Comments
  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    if (!commentInput.trim()) return;

    try {
      const res = await axios.post(
        `/api/product-actions/${productId}/comment`,
        { text: commentInput.trim() },
        { withCredentials: true }
      );
      setComments(res.data.comments);
      setCommentInput("");
      toast.success("Comment added successfully");
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!user || !commentToDelete) return;
    try {
      const res = await axios.delete(
        `/api/product-actions/${productId}/comment/${commentToDelete}`,
        { withCredentials: true }
      );
      setComments(res.data.comments);
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error("Failed to delete comment");
    } finally {
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like");
      return;
    }
    try {
      const res = await axios.post(`/api/product-actions/${productId}/like`, {}, {
        withCredentials: true
      });
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserLiked(res.data.liked);
      setUserDisliked(false);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Server error");
      }
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("Please log in to dislike");
      return;
    }
    try {
      const res = await axios.post(`/api/product-actions/${productId}/dislike`, {}, {
        withCredentials: true
      });
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserDisliked(res.data.disliked);
      setUserLiked(false);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Server error");
      }
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-red-600">{error}</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Product Card */}
        <div
          className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-sm transform transition-all duration-500 md:hover:scale-[1.02] md:hover:shadow-3xl"
          style={{
            background: theme === "dark"
              ? 'rgba(31, 41, 55, 0.9)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: theme === "dark"
              ? '1px solid rgba(75, 85, 99, 0.3)'
              : '1px solid rgba(209, 213, 219, 0.3)'
          }}
        >
        {/* Image Section */}
        <div className="md:w-1/2 flex items-center justify-center p-3 sm:p-5 md:p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl sm:rounded-2xl"></div>
          <div className="relative z-10 p-2 sm:p-4">
            <img
              src={product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
              alt={product.name}
              className="w-full h-auto rounded-xl sm:rounded-2xl object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] shadow-lg sm:shadow-2xl transform transition-all duration-500 md:hover:scale-105 md:hover:rotate-1"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-4 sm:p-6 md:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {product.name}
            </h2>
            <p className={`mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {product.description}
            </p>
            <div className="mb-4 sm:mb-6 md:mb-8">
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
                {product.price} GEL
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>In Stock</span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
              {product.sizes?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`text-xs sm:text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Sizes:
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-200 border border-gray-600"
                            : "bg-gray-100 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.colors?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`text-xs sm:text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Colors:
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-200 border border-gray-600"
                            : "bg-gray-100 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 rounded-lg sm:rounded-xl ${
              theme === "dark" ? "bg-gray-800/50" : "bg-gray-50/50"
            }`}>
              <User className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Seller:
              </span>
              <span className={`font-semibold text-sm sm:text-base ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {product.sellerId?.username || "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 active:scale-95 md:hover:scale-105 touch-manipulation ${
                  userLiked
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : theme === "dark"
                    ? "bg-gray-700/50 text-gray-200 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-600/50"
                    : "bg-gray-200/50 text-gray-700 hover:bg-blue-500/20 hover:text-blue-400 border border-gray-300/50"
                }`}
              >
                <ThumbsUp className={`w-4 h-4 sm:w-5 sm:h-5 ${userLiked ? 'fill-current' : ''}`} />
                <span className="font-semibold text-sm sm:text-base">{likesCount}</span>
              </button>
              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 active:scale-95 md:hover:scale-105 touch-manipulation ${
                  userDisliked
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    : theme === "dark"
                    ? "bg-gray-700/50 text-gray-200 hover:bg-red-500/20 hover:text-red-400 border border-gray-600/50"
                    : "bg-gray-200/50 text-gray-700 hover:bg-red-500/20 hover:text-red-400 border border-gray-300/50"
                }`}
              >
                <ThumbsDown className={`w-4 h-4 sm:w-5 sm:h-5 ${userDisliked ? 'fill-current' : ''}`} />
                <span className="font-semibold text-sm sm:text-base">{dislikesCount}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={handleCartAction}
              className={`w-full px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 overflow-hidden relative touch-manipulation ${
                isInCart
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{isInCart ? "Remove from Cart" : "Add to Cart"}</span>
              </span>
              <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                isInCart
                  ? "bg-gradient-to-r from-red-600 to-red-700"
                  : "bg-gradient-to-r from-blue-600 to-blue-700"
              }`}></div>
            </button>

            <button
              onClick={handleCheckout}
              className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 overflow-hidden relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 touch-manipulation"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Buy Now</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div
        className="mt-6 sm:mt-8 md:mt-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm"
        style={{
          background: theme === "dark"
            ? 'rgba(31, 41, 55, 0.9)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: theme === "dark"
            ? '1px solid rgba(75, 85, 99, 0.3)'
            : '1px solid rgba(209, 213, 219, 0.3)'
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-500" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Comments
          </h3>
        </div>

        <div className="mb-4">
          {comments.length === 0 ? (
            <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div
                key={c._id || c.createdAt}
                className={`mb-3 sm:mb-2 border-b pb-2 sm:pb-1 ${
                  theme === "dark" ? "border-gray-600 text-gray-200" : "border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm sm:text-base">{c.username}:</span> <span className="text-sm sm:text-base break-words">{c.text}</span>
                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                  {user && (user._id == c.userId || user.role === "admin") && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="ml-2 sm:ml-4 p-2 sm:p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200 active:scale-95 md:hover:scale-110 touch-manipulation flex-shrink-0"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {user && (
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Share your thoughts..."
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border transition-all duration-300 text-sm sm:text-base ${
                  theme === "dark"
                    ? "bg-gray-800/50 text-gray-200 border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-gray-800"
                    : "bg-white/50 text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                }`}
              />
              <MessageCircle className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`} />
            </div>
            <button
              onClick={handleAddComment}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base touch-manipulation"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Comment
            </button>
          </div>
        )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onClick={() => setShowDeleteModal(false)}
            ></div>
            <div
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 max-w-md w-full transform transition-all duration-300 scale-100 mx-3"
              style={{
                background: theme === "dark"
                  ? 'rgba(31, 41, 55, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: theme === "dark"
                  ? '1px solid rgba(75, 85, 99, 0.3)'
                  : '1px solid rgba(209, 213, 219, 0.3)'
              }}
            >
              <div className="text-center">
                <div className="mb-4 sm:mb-6">
                  <Trash2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-red-500 mb-3 sm:mb-4" />
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    Delete Comment
                  </h3>
                  <p className={`text-sm sm:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Are you sure you want to delete this comment? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform active:scale-95 md:hover:scale-105 touch-manipulation ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteComment}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 touch-manipulation"
                  >
                    Delete
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
