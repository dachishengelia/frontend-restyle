# Backend Implementation Plan for Cart & Favorites

## Overview
Implement backend API endpoints for cart and favorites functionality in the existing e-commerce application. The backend will use Node.js, Express, MongoDB with Mongoose, and JWT for authentication.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend communication

## Project Structure
```
server/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Favorites.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── cart.js
│   └── favorites.js
├── config/
│   └── database.js
├── server.js
└── package.json
```

## Database Models

### User Model
- Fields: _id, name, email, password, role, etc.
- Assumes existing model with authentication

### Product Model
- Fields: _id, name, price, imageUrl, category, etc.
- Assumes existing model

### Cart Model
- userId: ObjectId (ref: User)
- items: [
  {
    productId: ObjectId (ref: Product),
    quantity: Number
  }
]

### Favorites Model
- userId: ObjectId (ref: User)
- productIds: [ObjectId] (ref: Product)

## API Endpoints

### Cart Endpoints
- `GET /api/cart` - Retrieve user's cart
- `POST /api/cart` - Add product to cart (body: { productId, quantity })
- `PATCH /api/cart/:productId` - Update product quantity (body: { quantity })
- `DELETE /api/cart/:productId` - Remove product from cart

### Favorites Endpoints
- `GET /api/favorites` - Retrieve user's favorites
- `POST /api/favorites` - Add product to favorites (body: { productId })
- `DELETE /api/favorites/:productId` - Remove product from favorites

## Authentication
- All endpoints require JWT authentication
- Middleware to verify token and attach user to req.user

## Behavior
- **Idempotent Operations**: Adding the same product multiple times won't duplicate entries
- **User-Specific**: All operations are scoped to the authenticated user
- **State Returns**: Each operation returns the updated cart/favorites state
- **HTTP Methods**: Appropriate use of GET, POST, PATCH, DELETE

## Implementation Steps
1. Set up server directory and package.json
2. Create database connection
3. Define models (User, Product, Cart, Favorites)
4. Implement auth middleware
5. Create cart routes
6. Create favorites routes
7. Set up Express server with middleware
8. Test endpoints

## Assumptions
- User and Product models already exist
- Authentication system is in place
- Frontend will handle AJAX requests without page reloads
- MongoDB connection string available in environment variables

## Notes
- Exclude like/dislike functionality as per requirements
- Focus on clean, predictable API responses
- Use appropriate error handling and status codes