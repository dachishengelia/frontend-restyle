// import React, { useState, useContext, useEffect } from "react";
// import axios from "../axios.js";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { ThemeContext } from "../context/ThemeContext.jsx";
// import { sendNewsletterSignup } from "../utils/emailService.js";

// function setCookie(name, value, days) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// export default function Profile() {
//   const { user, logIn, signOut } = useContext(AuthContext);
//   const { theme } = useContext(ThemeContext);
//   const [form, setForm] = useState({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
//   const [imageFile, setImageFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(user?.avatar || "");
//   const [message, setMessage] = useState("");
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newsletterEmail, setNewsletterEmail] = useState("");
//   const [newsletterStatus, setNewsletterStatus] = useState(null);
//   const [newsletterLoading, setNewsletterLoading] = useState(false);

//   const getTitle = () => {
//     switch (user?.role) {
//       case "seller":
//         return "Seller Dashboard";
//       case "admin":
//         return "Admin Profile";
//       default:
//         return "User Profile";
//     }
//   };

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // ----------- IMAGE UPLOAD ------------------
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
  
//     const formData = new FormData();
//     formData.append("avatar", file);
  
//     try {
//       const res = await axios.patch("/users/update", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       logIn(res.data.user);
//       setImageUrl(res.data.user.avatar);
//       setMessage("Avatar updated successfully");
//     } catch (err) {
//       setMessage("Failed to upload avatar");
//     }
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {};

//     // Check if profile picture changed
//     if (imageUrl && imageUrl !== user?.avatar) {
//       payload.avatar = imageUrl;
//     }

//     // Check if username changed
//     if (form.username && form.username !== user.username) {
//       payload.username = form.username;
//       if (!form.currentPassword) {
//         setMessage("Current password is required to change username.");
//         return;
//       }
//     }

//     // Check if password is being changed
//     if (form.newPassword) {
//       if (form.newPassword !== form.confirmPassword) {
//         setMessage("New passwords do not match.");
//         return;
//       }
//       if (!form.currentPassword) {
//         setMessage("Current password is required to change password.");
//         return;
//       }
//       payload.newPassword = form.newPassword;
//     }

//     // If changing username or password, currentPassword is needed
//     if ((payload.username || payload.newPassword) && !form.currentPassword) {
//       setMessage("Current password is required for account changes.");
//       return;
//     }

//     if (form.currentPassword) {
//       payload.currentPassword = form.currentPassword;
//     }

//     if (Object.keys(payload).length === 0) {
//       setMessage("No changes to update.");
//       return;
//     }

//     try {
//       const res = await axios.patch(
//         "/users/update",
//         payload
//       );
//       logIn(res.data.user);
//       if (res.data.token) setCookie("token", res.data.token, 1);
//       setMessage("Profile updated successfully.");
//       // Reset form
//       setForm({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to update profile.");
//     }
//   };

//   const handleNewsletterSubmit = async (e) => {
//     e.preventDefault();
//     setNewsletterLoading(true);
//     const result = await sendNewsletterSignup(newsletterEmail);
//     setNewsletterStatus(result);
//     setNewsletterLoading(false);
//     if (result.success) {
//       setNewsletterEmail("");
//     }
//   };

//   const handleSignOut = () => {
//     if (window.confirm("Are you sure you want to sign out?")) {
//       signOut();
//     }
//   };

//   const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);


//     const fetchSellerProducts = async () => {
//       try {
//         const res = await axios.get("/api/products/seller");

//         setProducts(res.data);

//       } catch (err) {
//         console.error("Failed to fetch seller products:", err.response?.data || err.message);
//         alert(err.response?.data?.message || "Failed to fetch seller products.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//   const handleDelete = async (productId) => {
//     try {
//       await axios.delete(`/api/products/${productId}`);
//       setProducts(products.filter((product) => product._id !== productId));
//       alert("Product deleted successfully");
//     } catch (err) {
//       console.error("Failed to delete product:", err.message);
//       alert("Failed to delete product");
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "seller") {
//       fetchSellerProducts();
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   if (loading) {
//     return <div className="text-center py-10">Loading your dashboard...</div>;
//   }

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-8`}>
//       <div className="container mx-auto px-4">
//         <h1 className={`text-4xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//           {getTitle()}
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Profile Picture Card */}
//           <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
//             <div className="flex items-center mb-4">
//               <span className="text-2xl mr-3">📸</span>
//               <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Profile Picture</h3>
//             </div>
//             <div className="flex flex-col items-center">
//               {imageUrl && (
//                 <img
//                   src={imageUrl}
//                   alt="Profile Preview"
//                   className="w-24 h-24 object-cover rounded-full mb-4 shadow-md"
//                 />
//               )}
//               <input
//                 type="file"
//                 onChange={handleImageUpload}
//                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
//               />
//             </div>
//           </div>

//           {/* Account Information Card */}
//           <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
//             <div className="flex items-center mb-4">
//               <span className="text-2xl mr-3">🔐</span>
//               <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Account Settings</h3>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 placeholder={`Current: ${user.username}`}
//                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
//               />
//               <input
//                 type="password"
//                 name="currentPassword"
//                 value={form.currentPassword}
//                 onChange={handleChange}
//                 placeholder="Current Password"
//                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
//               />
//               <input
//                 type="password"
//                 name="newPassword"
//                 value={form.newPassword}
//                 onChange={handleChange}
//                 placeholder="New Password"
//                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
//               />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm New Password"
//                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
//               />
//               <button
//                 type="submit"
//                 className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Update Profile
//               </button>
//             </form>
//           </div>

//           {/* Newsletter Card */}
//           <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
//             <div className="flex items-center mb-4">
//               <span className="text-2xl mr-3">📧</span>
//               <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Newsletter</h3>
//             </div>
//             <p className={`mb-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Get the latest fashion trends and updates!</p>
//             <form onSubmit={handleNewsletterSubmit} className="space-y-3">
//               <input
//                 type="email"
//                 value={newsletterEmail}
//                 onChange={(e) => setNewsletterEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
//               />
//               <button
//                 type="submit"
//                 disabled={newsletterLoading}
//                 className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
//               >
//                 {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
//               </button>
//             </form>
//             {newsletterStatus && (
//               <p className={`mt-3 text-sm ${newsletterStatus.success ? 'text-green-600' : 'text-red-600'}`}>
//                 {newsletterStatus.message}
//               </p>
//             )}
//           </div>

//           {/* Actions Card */}
//           <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
//             <div className="flex items-center mb-4">
//               <span className="text-2xl mr-3">⚙️</span>
//               <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Actions</h3>
//             </div>
//             <div className="space-y-3">
//               <button
//                 onClick={handleSignOut}
//                 className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Sign Out
//               </button>
//               {user?.role === "admin" && (
//                 <Link
//                   to="/admin"
//                   className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg block text-center"
//                 >
//                   Admin Panel
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Message Display */}
//           {message && (
//             <div className={`col-span-full p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
//               {message}
//             </div>
//           )}

//           {/* Seller Products Card */}
//           {user?.role === "seller" && (
//             <div className={`col-span-full p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
//               <div className="flex items-center mb-4">
//                 <span className="text-2xl mr-3">🛍️</span>
//                 <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Your Products</h3>
//               </div>
//               {products.length === 0 ? (
//                 <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>You have not added any products yet.</p>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {products.map((product) => (
//                     <div key={product._id} className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
//                       <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{product.name}</h4>
//                       <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{product.category}</p>
//                       <p className={`font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{product.price} GEL</p>
//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }  

// //i was here

import React, { useState, useContext, useEffect } from "react";
import axios from "../axios.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { sendNewsletterSignup } from "../utils/emailService.js";

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export default function Profile() {
  const { user, logIn, signOut } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({ username: "", currentPassword: "" });
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetForm, setResetForm] = useState({ email: "", newPassword: "" });
  const [imageUrl, setImageUrl] = useState(user?.avatar || "");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const getTitle = () => {
    switch (user?.role) {
      case "seller": return "Seller Dashboard";
      case "admin": return "Admin Profile";
      default: return "User Profile";
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------- IMAGE UPLOAD ------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file); // matches backend multer field

    try {
      const res = await axios.patch("/users/update-avatar", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      logIn(res.data.user);
      setImageUrl(res.data.user.avatar);
      setMessage("Avatar updated successfully");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to upload avatar");
    }
  };

  // ---------------- USERNAME UPDATE ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};

    if (form.username && form.username !== user.username) {
      payload.username = form.username;
      if (!form.currentPassword) {
        setMessage("Current password is required to change username.");
        return;
      }
    }

    if (form.currentPassword) payload.currentPassword = form.currentPassword;
    if (Object.keys(payload).length === 0) {
      setMessage("No changes to update.");
      return;
    }

    try {
      const res = await axios.patch("/users/update", payload, { withCredentials: true });
      logIn(res.data.user);
      if (res.data.token) setCookie("token", res.data.token, 1);
      setMessage("Profile updated successfully.");
      setForm({ username: "", currentPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // ---------------- PASSWORD RESET ------------------
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    // Placeholder for password reset API
    try {
      // await axios.post("/api/auth/forgot-password", { email: resetForm.email, newPassword: resetForm.newPassword });
      alert("Password reset requested. (API not implemented yet)");
      setShowResetModal(false);
      setResetForm({ email: "", newPassword: "" });
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  // ---------------- NEWSLETTER ------------------
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    const result = await sendNewsletterSignup(newsletterEmail);
    setNewsletterStatus(result);
    setNewsletterLoading(false);
    if (result.success) setNewsletterEmail("");
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) signOut();
  };

  // ---------------- SELLER PRODUCTS ------------------
  const fetchSellerProducts = async () => {
    try {
      const res = await axios.get("/api/products/seller");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch seller products:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to fetch seller products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err.message);
      alert("Failed to delete product");
    }
  };

  // ---------------- USER CVs ------------------
  const fetchUserCVs = async () => {
    try {
      const res = await axios.get("/api/cv/user");
      setCvs(res.data.cvs || []);
    } catch (err) {
      console.error("Failed to fetch user CVs:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to fetch user CVs.");
    }
  };

  useEffect(() => {
    fetchUserCVs();
    if (user?.role === "seller") fetchSellerProducts();
    else setLoading(false);
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading your dashboard...</div>;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-8`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-4xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTitle()}</h1>

        {/* Header Section */}
        <div className={`mb-8 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-md border border-gray-600/50' : 'bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-md border border-gray-200/50'}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img src={imageUrl || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white/20 hover:scale-110 transition-transform duration-300" />
            <div className="text-center md:text-left">
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Welcome back, {user.username}!</h2>
              <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{getTitle()}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className={`px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700/50 text-gray-200' : 'bg-gray-100/50 text-gray-800'}`}>
                  <span className="font-semibold">{cvs.length}</span> CVs
                </div>
                {user?.role === "seller" && (
                  <div className={`px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700/50 text-gray-200' : 'bg-gray-100/50 text-gray-800'}`}>
                    <span className="font-semibold">{products.length}</span> Products
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Profile Picture Card */}
          <div className={`p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📸</span>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Profile Picture</h3>
            </div>
            <div className="flex flex-col items-center">
              {imageUrl && <img src={imageUrl} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full mb-4 shadow-md" />}
              <input type="file" onChange={handleImageUpload} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`} />
            </div>
          </div>

          {/* Account Information Card */}
          <div className={`p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🔐</span>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Account Settings</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="username" value={form.username} onChange={handleChange} placeholder={`Current: ${user.username}`} className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`} />
              <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Current Password" className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`} />
              <button type="button" onClick={() => setShowResetModal(true)} className="text-blue-500 hover:underline text-sm">Forgot old password?</button>
              <button type="submit" className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                Update Profile
              </button>
            </form>
          </div>

          {/* Newsletter Card */}
          <div className={`p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📧</span>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Newsletter</h3>
            </div>
            <p className={`mb-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Get the latest fashion trends and updates!</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email" required className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`} />
              <button type="submit" disabled={newsletterLoading} className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50">
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {newsletterStatus && <p className={`mt-3 text-sm ${newsletterStatus.success ? 'text-green-600' : 'text-red-600'}`}>{newsletterStatus.message}</p>}
          </div>

          {/* Actions Card */}
          <div className={`p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚙️</span>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Actions</h3>
            </div>
            <div className="space-y-3">
              <button onClick={handleSignOut} className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg">
                Sign Out
              </button>
              {user?.role === "admin" && <Link to="/admin" className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg block text-center">Admin Panel</Link>}
            </div>
          </div>

          {/* Message Display */}
          {message && <div className={`col-span-full p-6 rounded-xl shadow-lg text-center backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800/70 text-gray-200 border border-gray-600/50' : 'bg-gray-100/90 text-gray-900 border border-gray-200/50'}`}>{message}</div>}

          {/* Seller Products */}
          {user?.role === "seller" && (
            <div className={`col-span-full p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🛍️</span>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Your Products</h3>
              </div>
              {products.length === 0 ? (
                <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>You have not added any products yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gray-700/70 backdrop-blur-sm border border-gray-600/50' : 'bg-gray-50/90 backdrop-blur-sm border border-gray-200/50'}`}>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{product.name}</h4>
                      <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{product.category}</p>
                      <p className={`font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{product.price} GEL</p>
                      <button onClick={() => handleDelete(product._id)} className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User CVs */}
          <div className={`col-span-full p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-md border border-gray-600/50' : 'bg-white/90 backdrop-blur-md border border-gray-200/50'}`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📄</span>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Your CVs</h3>
            </div>
            {cvs.length === 0 ? (
              <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>You have not uploaded any CVs yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(cvs) && cvs.map((cv) => (
                  <div key={cv._id} className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gray-700/70 backdrop-blur-sm border border-gray-600/50' : 'bg-gray-50/90 backdrop-blur-sm border border-gray-200/50'}`}>
                    <img src={cv.profileImage || 'https://via.placeholder.com/150'} alt="Profile" className="w-16 h-16 object-cover rounded-full mx-auto mb-2" />
                    <h4 className={`font-semibold text-center mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{cv.nationality}</h4>
                    <p className={`text-sm text-center mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Height: {cv.height} cm | Weight: {cv.weight} kg</p>
                    <p className={`text-sm text-center mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Languages: {cv.languages.join(', ')}</p>
                    <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{cv.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="email"
                value={resetForm.email}
                onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                placeholder="Enter your email"
                required
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
              />
              <input
                type="password"
                value={resetForm.newPassword}
                onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                placeholder="New Password"
                required
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
              />
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 py-3 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                  Reset Password
                </button>
                <button type="button" onClick={() => setShowResetModal(false)} className="flex-1 py-3 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all duration-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
