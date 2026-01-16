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
                placeholder="e.g., shirt,pants..."
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

              {/* Selected Sizes Display */}
              {form.sizes.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {form.sizes.map((size) => (
                    <span
                      key={size}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            sizes: form.sizes.filter(s => s !== size)
                          });
                        }}
                        className={`ml-2 hover:bg-opacity-80 rounded-full p-0.5 ${
                          theme === "dark" ? "hover:bg-blue-700" : "hover:bg-blue-200"
                        }`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Size Checkboxes */}
              <div className={`p-4 rounded-lg border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="grid grid-cols-3 gap-3">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              sizes: [...form.sizes, size]
                            });
                          } else {
                            setForm({
                              ...form,
                              sizes: form.sizes.filter(s => s !== size)
                            });
                          }
                        }}
                        className={`w-4 h-4 rounded border-2 transition-colors ${
                          theme === "dark"
                            ? "bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                        }`}
                      />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {size}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Shoe Sizes */}
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <p className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Shoe Sizes:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {["40", "41", "42", "43", "44", "45"].map((size) => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.sizes.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                sizes: [...form.sizes, size]
                              });
                            } else {
                              setForm({
                                ...form,
                                sizes: form.sizes.filter(s => s !== size)
                              });
                            }
                          }}
                          className={`w-4 h-4 rounded border-2 transition-colors ${
                            theme === "dark"
                              ? "bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                              : "bg-white border-gray-300 text-blue-600 focus:ring-blue-500"
                          }`}
                        />
                        <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Palette className="inline h-4 w-4 mr-2" />
                Available Colors
              </label>

              {/* Selected Colors Display */}
              {form.colors.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {form.colors.map((color) => (
                    <span
                      key={color}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        theme === "dark"
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            colors: form.colors.filter(c => c !== color)
                          });
                        }}
                        className={`ml-2 hover:bg-opacity-80 rounded-full p-0.5 ${
                          theme === "dark" ? "hover:bg-purple-700" : "hover:bg-purple-200"
                        }`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Color Checkboxes */}
              <div className={`p-4 rounded-lg border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Black", "White", "Red", "Blue", "Green", "Yellow",
                    "Pink", "Purple", "Orange", "Gray", "Brown", "Beige",
                    "Navy", "Burgundy"
                  ].map((color) => (
                    <label key={color} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.colors.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              colors: [...form.colors, color]
                            });
                          } else {
                            setForm({
                              ...form,
                              colors: form.colors.filter(c => c !== color)
                            });
                          }
                        }}
                        className={`w-4 h-4 rounded border-2 transition-colors ${
                          theme === "dark"
                            ? "bg-gray-600 border-gray-500 text-purple-500 focus:ring-purple-500"
                            : "bg-white border-gray-300 text-purple-600 focus:ring-purple-500"
                        }`}
                      />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {color}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
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


