import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios.js";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Upload, Package, DollarSign, FileText, Tag, Palette, Ruler, Loader, Percent } from "lucide-react";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    discount: "",
    secondhand: false,
    sizes: [],
    colors: [],
  });

  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const { theme } = useContext(ThemeContext);

  // Fetch product data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`/api/products/${id}`);
          const product = res.data;
          setForm({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            category: product.category || "",
            discount: product.discount || "",
            secondhand: product.secondhand || false,
            sizes: product.sizes || [],
            colors: product.colors || [],
          });
          setImageUrl(product.imageUrl || "");
        } catch (err) {
          console.error("Failed to fetch product:", err);
          setError("Failed to load product data");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleMultiChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setForm({ ...form, [name]: selectedValues });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  };


  // ----------- IMAGE UPLOAD ------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_PROD}/api/products/upload`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(uploadResponse.data.message);
      setImageUrl(uploadResponse.data.imageUrl);
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
   

  // ---------- SUBMIT PRODUCT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.patch(
          `/api/products/${id}`,
          {
            ...form,
            imageUrl: imageUrl || null,
          },
          { withCredentials: true }
        );
        setMessage("Product updated successfully!");
        // Navigate back to your products
        setTimeout(() => navigate("/your-products"), 2000);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_PROD}/api/products`,
          {
            ...form,
            imageUrl: imageUrl || null,
          },
          { withCredentials: true }
        );
        setMessage("Product added successfully!");
        // Reset form
        setForm({ name: "", price: "", description: "", category: "", discount: "", secondhand: false, sizes: [], colors: [] });
        setImageUrl("");
      }
      setError("");
    } catch (err) {
      setError(isEdit ? "Failed to update product." : "Failed to add product.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
      }`}>
        <div className={`px-8 py-6 ${theme === "dark" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}>
          <h2 className="text-3xl font-bold text-white text-center">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <p className="text-blue-100 text-center mt-2">{isEdit ? "Update your product details" : "Fill in the details to list your product"}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* IMAGE UPLOAD SECTION */}
          <div
            className={`p-6 rounded-xl border-2 border-dashed transition-all duration-200 ${
              isDragOver
                ? theme === "dark"
                  ? "border-blue-400 bg-blue-900/20"
                  : "border-blue-400 bg-blue-50"
                : theme === "dark"
                ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className={`mx-auto h-12 w-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              <div className="mt-4">
                <label htmlFor="image-upload" className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                  uploading
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                }`}>
                  {uploading ? (
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 mr-2" />
                  )}
                  {uploading ? "Uploading..." : "Choose Product Image"}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                  disabled={uploading}
                />
              </div>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                PNG, JPG, GIF up to 10MB
              </p>
            </div>

            {/* SHOW PREVIEW */}
            {imageUrl && (
              <div className="mt-6 flex justify-center">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg shadow-lg border-4 border-white"
                />
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Package className="inline h-4 w-4 mr-2" />
                Product Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            {/* Price */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <DollarSign className="inline h-4 w-4 mr-2" />
                Price (GEL)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            {/* Category */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Tag className="inline h-4 w-4 mr-2" />
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g., Clothing, Electronics"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            {/* Discount */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Percent className="inline h-4 w-4 mr-2" />
                Discount (%)
              </label>
              <input
                name="discount"
                type="number"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Secondhand */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Secondhand
              </label>
              <input
                name="secondhand"
                type="checkbox"
                checked={form.secondhand}
                onChange={(e) => setForm({ ...form, secondhand: e.target.checked })}
                className="mr-2"
              />
              <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Mark as secondhand</span>
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2 relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <FileText className="inline h-4 w-4 mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* VARIANTS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sizes */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Ruler className="inline h-4 w-4 mr-2" />
                Available Sizes
              </label>
              <select
                name="sizes"
                multiple
                value={form.sizes}
                onChange={handleMultiChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
              </select>
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>

            {/* Colors */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Palette className="inline h-4 w-4 mr-2" />
                Available Colors
              </label>
              <select
                name="colors"
                multiple
                value={form.colors}
                onChange={handleMultiChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="Pink">Pink</option>
                <option value="Purple">Purple</option>
                <option value="Orange">Orange</option>
                <option value="Gray">Gray</option>
                <option value="Brown">Brown</option>
                <option value="Beige">Beige</option>
                <option value="Navy">Navy</option>
                <option value="Burgundy">Burgundy</option>
              </select>
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
            >
              <Package className="inline h-5 w-5 mr-2" />
              {isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>

          {/* MESSAGES */}
          {error && (
            <div className="text-center">
              <p className="text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </p>
            </div>
          )}
          {message && (
            <div className="text-center">
              <p className="text-green-500 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
                {message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


