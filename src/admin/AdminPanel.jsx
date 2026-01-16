// import React, { useEffect, useState, useContext } from "react";
// import axios from "../axios.js";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { ThemeContext } from "../context/ThemeContext.jsx";

// const AdminPanel = () => {
//    const { user, fetchUser } = useContext(AuthContext);
//    const { theme } = useContext(ThemeContext);
//    const [stats, setStats] = useState({ totalUsers: 0, buyers: 0, sellers: 0, admins: 0 });
//    const [users, setUsers] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [products, setProducts] = useState([]);
//    const [searchQuery, setSearchQuery] = useState("");

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get("/admin/stats");
//       setStats(res.data);
//     } catch (err) {
//       console.error("Failed to fetch stats:", err);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("/admin/users");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("/api/products");
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//     }
//   };

//   const deleteUser = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await axios.delete(`/admin/users/${id}`);
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (err) {
//       console.error("Failed to delete user:", err);
//       alert("Failed to delete user");
//     }
//   };

//   const changeUserRole = async (id, newRole) => {
//     try {
//       const res = await axios.patch(`/admin/users/${id}/role`, { role: newRole });
//       setUsers(users.map((u) => (u._id === id ? res.data : u)));
//     } catch (err) {
//       console.error("Failed to update role:", err);
//       alert("Failed to update role");
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       await axios.delete(`/api/products/admin/${productId}`);
//       setProducts(products.filter((product) => product._id !== productId));
//       alert("Product deleted successfully");
//     } catch (err) {
//       console.error("Failed to delete product:", err.message);
//       alert("Failed to delete product");
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       fetchUser();
//     }
//     fetchStats();
//     fetchUsers();
//     fetchProducts();
//   }, [user]);

//   if (loading) return <div className="text-center py-10">Loading admin panel...</div>;

//   return (
//     <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
//       <div className={`p-6 w-[90%] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md`}>
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-200">Admin Dashboard</h1>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Total Users</h2>
//             <p className="text-2xl font-bold">{stats.totalUsers}</p>
//           </div>
//           <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Buyers</h2>
//             <p className="text-2xl font-bold">{stats.buyers}</p>
//           </div>
//           <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Sellers</h2>
//             <p className="text-2xl font-bold">{stats.sellers}</p>
//           </div>
//           <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold">Admins</h2>
//             <p className="text-2xl font-bold">{stats.admins}</p>
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">All Users</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-200 dark:border-gray-600 rounded-lg shadow">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Username</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Email</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Role</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Change Role</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{u.username}</td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{u.email}</td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{u.role}</td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
//                     <select
//                       value={u.role}
//                       onChange={(e) => changeUserRole(u._id, e.target.value)}
//                       className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
//                     >
//                       <option value="buyer">Buyer</option>
//                       <option value="seller">Seller</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-center">
//                     <button
//                       onClick={() => deleteUser(u._id)}
//                       className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-200">All Products</h2>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
//         />
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-200 dark:border-gray-600 rounded-lg shadow">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Name</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Price</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Category</th>
//                 <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products
//                 .filter((product) =>
//                   product.name.toLowerCase().includes(searchQuery.toLowerCase())
//                 )
//                 .map((product) => (
//                   <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{product.name}</td>
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{product.price} GEL</td>
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-200">{product.category}</td>
//                     <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-center">
//                       <button
//                         onClick={() => handleDeleteProduct(product._id)}
//                         className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;



import React, { useEffect, useState, useContext } from "react";
import axios from "../axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Users, Package, FileText, BarChart3, Shield, Trash2, Edit, Search, UserCheck, UserX } from 'lucide-react';

const AdminPanel = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [stats, setStats] = useState({ totalUsers: 0, buyers: 0, sellers: 0, admins: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async () => {
    try {
      const res = await axios.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchCvs = async () => {
    try {
      const res = await axios.get("/api/cv/marketplace");
      setCvs(res.data.cvs || res.data);
    } catch (err) {
      console.error("Failed to fetch CVs:", err);
      // CV management might not be available, set empty array
      setCvs([]);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const changeUserRole = async (id, newRole) => {
    try {
      const res = await axios.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/admin/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err.message);
      alert("Failed to delete product");
    }
  };

  const handleDeleteCv = async (cvId) => {
    try {
      await axios.delete(`/api/cv/admin/${cvId}`);
      setCvs(cvs.filter((cv) => cv._id !== cvId));
      alert("CV deleted successfully");
    } catch (err) {
      console.error("Failed to delete CV:", err.message);
      alert("Failed to delete CV");
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
    fetchStats();
    fetchUsers();
    fetchProducts();
    fetchCvs();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin panel...</p>
        </div>
      </div>
    );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "cvs", label: "CVs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
              Admin Control Panel
            </h1>
          </div>
          <p className="text-indigo-100 text-lg">Manage your platform with powerful tools</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-indigo-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div
              className="rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
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
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Platform Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Users", value: stats.totalUsers, color: "blue", icon: Users },
                  { label: "Buyers", value: stats.buyers, color: "green", icon: UserCheck },
                  { label: "Sellers", value: stats.sellers, color: "yellow", icon: Package },
                  { label: "Admins", value: stats.admins, color: "red", icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                        theme === "dark"
                          ? `bg-${item.color}-900/20 border-${item.color}-500/30 text-${item.color}-200`
                          : `bg-${item.color}-50/80 border-${item.color}-200/50 text-${item.color}-800`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`w-8 h-8 ${theme === "dark" ? `text-${item.color}-400` : `text-${item.color}-600`}`} />
                        <div className={`text-3xl font-bold ${theme === "dark" ? `text-${item.color}-300` : `text-${item.color}-700`}`}>
                          {item.value}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold">{item.label}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div
              className="rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
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
              <div className="flex items-center gap-4 mb-8">
                <Users className="w-8 h-8 text-indigo-500" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  User Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full rounded-2xl overflow-hidden shadow-lg">
                  <thead className={`${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/80"} backdrop-blur-sm`}>
                    <tr>
                      {["Username", "Email", "Role", "Change Role", "Actions"].map((th) => (
                        <th key={th} className={`px-6 py-4 text-left font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className={`border-b ${theme === "dark" ? "border-gray-600/30 hover:bg-gray-700/30" : "border-gray-200/50 hover:bg-gray-50/50"} transition-colors duration-200`}>
                        <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{u.username}</td>
                        <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{u.email}</td>
                        <td className={`px-6 py-4`}>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                            u.role === 'seller' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => changeUserRole(u._id, e.target.value)}
                            className={`px-3 py-2 rounded-lg border transition-colors ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500"
                                : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"
                            }`}
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div
              className="rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Package className="w-8 h-8 text-indigo-500" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Product Management
                  </h2>
                </div>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                        : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
                    }`}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full rounded-2xl overflow-hidden shadow-lg">
                  <thead className={`${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/80"} backdrop-blur-sm`}>
                    <tr>
                      {["Name", "Price", "Category", "Actions"].map((th) => (
                        <th key={th} className={`px-6 py-4 text-left font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((product) => (
                        <tr key={product._id} className={`border-b ${theme === "dark" ? "border-gray-600/30 hover:bg-gray-700/30" : "border-gray-200/50 hover:bg-gray-50/50"} transition-colors duration-200`}>
                          <td className={`px-6 py-4 font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{product.name}</td>
                          <td className={`px-6 py-4 font-semibold text-green-500`}>{product.price} GEL</td>
                          <td className={`px-6 py-4`}>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              theme === "dark" ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                            }`}>
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CVs Tab */}
          {activeTab === "cvs" && (
            <div
              className="rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
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
              <div className="flex items-center gap-4 mb-8">
                <FileText className="w-8 h-8 text-indigo-500" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CV Management
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full rounded-2xl overflow-hidden shadow-lg">
                  <thead className={`${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/80"} backdrop-blur-sm`}>
                    <tr>
                      {["Nationality", "Height", "Weight", "Languages", "Actions"].map((th) => (
                        <th key={th} className={`px-6 py-4 text-left font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cvs.map((cv) => (
                      <tr key={cv._id} className={`border-b ${theme === "dark" ? "border-gray-600/30 hover:bg-gray-700/30" : "border-gray-200/50 hover:bg-gray-50/50"} transition-colors duration-200`}>
                        <td className={`px-6 py-4 font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>{cv.nationality}</td>
                        <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{cv.height} cm</td>
                        <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{cv.weight} kg</td>
                        <td className={`px-6 py-4`}>
                          <div className="flex flex-wrap gap-1">
                            {cv.languages.slice(0, 2).map((lang, index) => (
                              <span key={index} className={`px-2 py-1 rounded text-xs font-medium ${
                                theme === "dark" ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
                              }`}>
                                {lang}
                              </span>
                            ))}
                            {cv.languages.length > 2 && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                theme === "dark" ? "bg-gray-500/20 text-gray-300" : "bg-gray-100 text-gray-700"
                              }`}>
                                +{cv.languages.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteCv(cv._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
