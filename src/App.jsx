import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Favorites from "./pages/Favorites.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import CompleteGoogleProfile from "./pages/CompleteGoogleProfile.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import AddProduct from "./components/AddProduct.jsx";
import AddCVForm from "./components/AddCVForm.jsx";
import CartPage from "./pages/CartPage.jsx";
import YourProducts from "./pages/YourProducts.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import ProfileLayout from "./pages/ProfileLayout.jsx";
import ProfileOverview from "./pages/ProfileOverview.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
import MyProducts from "./pages/MyProducts.jsx";
import MyCVs from "./pages/MyCVs.jsx";
import Newsletter from "./pages/Newsletter.jsx";
import CVMarketplace from "./pages/CVMarketplace.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Contact from "./pages/Contact.jsx";

function getCookie(name, suffix = '') {
  const fullName = name + suffix;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${fullName}=`);
  if (parts.length === 2) return JSON.parse(decodeURIComponent(parts.pop().split(";").shift()));
  return [];
}

function setCookie(name, value, days, suffix = '') {
  const fullName = name + suffix;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = fullName + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

export default function App() {
   // 🔥 ADDED: products state
   const [products, setProducts] = React.useState([]);

  // 🔥 ADDED: fetch products from backend
  React.useEffect(() => {
    fetch("https://restyle-backend123.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);


  const AppContent = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    const userSuffix = user ? `_${user._id}` : '';

    const [favorites, setFavorites] = useState(() => getCookie("ecom_favs", userSuffix));
    React.useEffect(() => {
      setCookie("ecom_favs", favorites, 7, userSuffix);
    }, [favorites, userSuffix]);

    const [cart, setCart] = useState(() => getCookie("ecom_cart", userSuffix) || []);
    React.useEffect(() => {
      setCookie("ecom_cart", cart, 7, userSuffix);
    }, [cart, userSuffix]);

    // Load data when user changes
    React.useEffect(() => {
      setFavorites(getCookie("ecom_favs", userSuffix));
      setCart(getCookie("ecom_cart", userSuffix) || []);
    }, [user]);

    const toggleFav = (id) => {
      setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
    };

    const addToCart = (id) => {
      setCart((prev) => {
        const existing = prev.find(item => item.id === id);
        if (existing) {
          return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
          return [...prev, { id, quantity: 1 }];
        }
      });
    };

    const removeFromCart = (id) => {
      setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateCart = (id, quantity) => {
      if (quantity <= 0) {
        removeFromCart(id);
      } else {
        setCart((prev) => prev.map(item => item.id === id ? { ...item, quantity } : item));
      }
    };

    const clearCart = () => {
      setCart([]);
    };

    return (
      <CartProvider>
        <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <Navbar favoritesCount={favorites.length} />
        <main className="flex-1 w-full">
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Home />
                  </ErrorBoundary>
                }
              />

              <Route
                path="/explore"
                element={
                  <ErrorBoundary>
                    <Explore
                      products={products}
                      favorites={favorites}
                      toggleFav={toggleFav}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </ErrorBoundary>
                }
              />

              <Route
                path="/favorites"
                element={
                  <Favorites
                    products={products} // 🔥 ADDED
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />

              <Route path="/auth" element={<LogIn />} />
              <Route path="/log-in" element={<LogIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/complete-profile" element={<CompleteGoogleProfile />} />

              {/* <Route
                path="/discounts"
                element={
                  <DiscountFeed
                    products={products} // 🔥 ADDED
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              /> */}

              <Route path="/cart" element={<CartPage products={products} cart={cart} updateCart={updateCart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
              <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
              <Route path="/add-product" element={<RequireSeller><AddProduct /></RequireSeller>} />
              <Route path="/edit-product/:id" element={<RequireSeller><AddProduct /></RequireSeller>} />

              <Route
                path="/your-products"
                element={
                  <RequireSeller>
                    <YourProducts
                      toggleFav={toggleFav}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </RequireSeller>
                }
              />

              <Route path="/profile" element={<RequireAuth><ProfileLayout /></RequireAuth>}>
                <Route index element={<ProfileOverview />} />
                <Route path="settings" element={<AccountSettings />} />
                <Route path="products" element={<MyProducts />} />
                <Route path="cvs" element={<MyCVs />} />
                <Route path="newsletter" element={<Newsletter />} />
              </Route>
              <Route path="/add-cv" element={<RequireAuth><AddCVForm /></RequireAuth>} />
              <Route path="/cv-marketplace" element={<CVMarketplace />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />

              <Route
                path="/product/:productId"
                element={
                  <ProductDetails
                    products={products} // 🔥 ADDED
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />

              <Route
                path="/user/:userId"
                element={
                  <UserProfile
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={theme}
            />
          </main>
          <Footer />
        </div>
        </CartProvider>
    );
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RequireAdmin({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") return <Navigate to="/auth" />;
  return children;
}

function RequireSeller({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/auth" />;
  return children;
}

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  return children;
}
