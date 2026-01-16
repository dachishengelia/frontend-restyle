// import React, { useEffect } from 'react';

// export default function PhotoModal({ images, initialIndex, isOpen, onClose }) {
//   const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

//   useEffect(() => {
//     setCurrentIndex(initialIndex);
//   }, [initialIndex]);

//   if (!isOpen || !images || images.length === 0) return null;

//   const currentImage = images[currentIndex];

//   const goToPrevious = () => {
//     setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const goToNext = () => {
//     setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'ArrowLeft') goToPrevious();
//     if (e.key === 'ArrowRight') goToNext();
//     if (e.key === 'Escape') onClose();
//   };

//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'hidden'; // Prevent background scroll
//     } else {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
//       onClick={onClose}
//     >
//       <div className="relative max-w-4xl max-h-full p-4">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300 z-10"
//         >
//           ×
//         </button>

//         {/* Main Image */}
//         <img
//           src={currentImage.url}
//           alt={`Product photo ${currentIndex + 1}`}
//           className="max-w-full max-h-full object-contain"
//           onClick={(e) => e.stopPropagation()}
//         />

//         {/* Navigation Arrows */}
//         {images.length > 1 && (
//           <>
//             <button
//               onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
//               className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300"
//             >
//               ‹
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); goToNext(); }}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300"
//             >
//               ›
//             </button>
//           </>
//         )}

//         {/* Image Counter */}
//         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
//           {currentIndex + 1} / {images.length}
//         </div>
//       </div>
//     </div>
//   );
// }

// # Backend Implementation Prompt for Multiple Product Photos Feature

// ## Overview
// The frontend has been updated to support multiple product photos with one designated as the main photo. The backend needs to be modified to handle this new structure while maintaining backward compatibility.

// ## Data Structure Changes

// ### Product Schema Update
// Update the Product model to replace the single `imageUrl` field with an `images` array:

// ```javascript
// // Old structure
// {
//   // ... other fields
//   imageUrl: String
// }

// // New structure
// {
//   // ... other fields
//   images: [{
//     url: { type: String, required: true },
//     isMain: { type: Boolean, default: false }
//   }],
//   // Keep imageUrl for backward compatibility (optional)
//   imageUrl: String // deprecated, but keep for existing products
// }
// ```

// ### Validation Rules
// - `images` array must contain at least one image
// - Exactly one image in the array must have `isMain: true`
// - Each image object must have a valid `url`

// ## API Changes

// ### 1. Product Creation (POST /api/products)
// **Request Body Changes:**
// ```javascript
// // Old request
// {
//   name: "Product Name",
//   price: 100,
//   description: "Description",
//   category: "Category",
//   imageUrl: "https://example.com/image.jpg",
//   sizes: ["S", "M"],
//   colors: ["Red", "Blue"]
// }

// // New request
// {
//   name: "Product Name",
//   price: 100,
//   description: "Description",
//   category: "Category",
//   images: [
//     { url: "https://example.com/image1.jpg", isMain: true },
//     { url: "https://example.com/image2.jpg", isMain: false },
//     { url: "https://example.com/image3.jpg", isMain: false }
//   ],
//   sizes: ["S", "M"],
//   colors: ["Red", "Blue"]
// }
// ```

// **Implementation Steps:**
// 1. Accept both `imageUrl` (for backward compatibility) and `images` array
// 2. If `images` is provided:
//    - Validate array is not empty
//    - Validate exactly one image has `isMain: true`
//    - Save the `images` array
// 3. If only `imageUrl` is provided (legacy support):
//    - Create `images` array with single item: `[{ url: imageUrl, isMain: true }]`
// 4. Remove or deprecate `imageUrl` field in new products

// ### 2. Product Fetch (GET /api/products/:id)
// **Response Changes:**
// ```javascript
// // Old response
// {
//   _id: "productId",
//   name: "Product Name",
//   // ... other fields
//   imageUrl: "https://example.com/image.jpg"
// }

// // New response
// {
//   _id: "productId",
//   name: "Product Name",
//   // ... other fields
//   images: [
//     { url: "https://example.com/image1.jpg", isMain: true },
//     { url: "https://example.com/image2.jpg", isMain: false }
//   ],
//   imageUrl: "https://example.com/image.jpg" // keep for backward compatibility
// }
// ```

// **Implementation Steps:**
// 1. Always return `images` array in response
// 2. For existing products with only `imageUrl`:
//    - Generate `images` array: `[{ url: imageUrl, isMain: true }]`
// 3. Keep `imageUrl` field for backward compatibility (populate with main image URL)

// ### 3. Product Update (PUT /api/products/:id)
// **Request Body Changes:**
// Same as creation - accept `images` array with validation.

// ### 4. Image Upload Endpoint (POST /api/products/upload)
// **No changes required** - the frontend handles multiple uploads sequentially and collects URLs.

// ## Migration Strategy

// ### Database Migration
// 1. For existing products with `imageUrl`:
//    - Create `images` array: `[{ url: imageUrl, isMain: true }]`
//    - Keep `imageUrl` field for backward compatibility
// 2. Update all product queries to populate `images` field
// 3. Add database indexes if needed for images array queries

// ### Backward Compatibility
// - Frontend will check for `images` array first, fall back to `imageUrl`
// - API should accept both formats during transition period
// - Existing mobile apps or third-party integrations should continue working

// ## Error Handling
// - Return 400 Bad Request if `images` array is empty
// - Return 400 Bad Request if no image has `isMain: true`
// - Return 400 Bad Request if multiple images have `isMain: true`
// - Return 400 Bad Request if any image object is missing `url`

// ## Testing Checklist
// - [ ] Create product with multiple images (one main)
// - [ ] Create product with single image (should set as main)
// - [ ] Fetch product returns correct `images` array
// - [ ] Update product images
// - [ ] Validation prevents invalid image configurations
// - [ ] Existing products with `imageUrl` still work
// - [ ] Backward compatibility maintained

// ## Additional Considerations
// - Consider adding image optimization/resizing on upload
// - Add image deletion functionality if needed
// - Update any admin panels to handle multiple images
// - Consider adding image alt text or captions in future iterations