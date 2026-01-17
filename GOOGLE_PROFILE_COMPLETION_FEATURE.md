# Google Registration Profile Completion Feature

## Overview
Added functionality to allow users who register via Google OAuth to complete their profile by:
1. Entering their display name
2. Choosing their role (Buyer or Seller)

## Changes Made

### Frontend Changes

#### 1. New Component: `CompleteGoogleProfile.jsx`
**Location:** `/src/pages/CompleteGoogleProfile.jsx`

A new page that appears after Google OAuth callback. It provides:
- Name input field
- Role selection (Buyer or Seller) with icons and descriptions
- Beautiful, themed UI matching your design system
- Form validation
- Error handling

**Features:**
- Checks for valid token from OAuth redirect
- Redirects to login if no token is present
- Auto-focuses on the name input
- Shows helpful descriptions for each role
- Displays helpful footer message about changing role later

#### 2. Updated: `LogIn.jsx`
**Location:** `/src/pages/LogIn.jsx`

Modified the OAuth redirect handling:
- Checks for `newUser=true` query parameter
- If new user: redirects to `/complete-profile?token={token}`
- If existing user: follows original flow (fetch user and redirect)

**Key changes:**
```javascript
// New flow detects first-time Google users
const isNewUser = searchParams.get('newUser') === 'true';
if (isNewUser) {
    navigate(`/complete-profile?token=${token}`);
}
```

#### 3. Updated: `App.jsx`
**Location:** `/src/App.jsx`

- Added import for `CompleteGoogleProfile` component
- Added new route: `/complete-profile` → `<CompleteGoogleProfile />`

---

## Backend Requirements

You'll need to make these changes on your backend:

### 1. Create New API Endpoint: `POST /api/auth/complete-profile`

This endpoint should:
- Accept authenticated requests (token from cookie or header)
- Accept JSON body with:
  ```json
  {
    "username": "User's Display Name",
    "role": "buyer" or "seller"
  }
  ```
- Update the user's profile with the provided name and role
- Return the updated user object

**Example:**
```javascript
POST /api/auth/complete-profile
Cookie: token=<jwt_token>
Body: {
  "username": "John Doe",
  "role": "seller"
}

Response (200/201):
{
  "user": {
    "_id": "user_id",
    "email": "user@google.com",
    "username": "John Doe",
    "role": "seller",
    ...
  }
}
```

### 2. Update Google OAuth Callback

When a new user signs up via Google, your OAuth callback should:
- Create the user with their Google info
- Redirect to: `/log-in?token={jwt_token}&newUser=true`

This tells the frontend that it's a new user and needs profile completion.

**Example redirect:**
```
/log-in?token=eyJhbGciOiJIUzI1NiIs...&newUser=true
```

### 3. Optional: Add a check endpoint

You might want to verify if a user's profile is complete:
```javascript
GET /api/auth/profile-status
Response: { "isComplete": true/false }
```

---

## User Flow Diagram

```
1. User clicks "Continue with Google"
   ↓
2. Google OAuth callback
   ↓
3. Backend redirects: /log-in?token=xxx&newUser=true
   ↓
4. Frontend detects newUser=true
   ↓
5. Redirects to /complete-profile?token=xxx
   ↓
6. User enters name and selects role
   ↓
7. Form submitted to POST /api/auth/complete-profile
   ↓
8. Backend updates user profile
   ↓
9. Frontend redirects to home (buyer) or /your-products (seller)
```

---

## Styling & Design

The component uses your existing theme system:
- Respects dark/light mode from `ThemeContext`
- Uses Tailwind CSS for responsive design
- Matches your gradient purple/indigo color scheme
- Includes hover effects and smooth transitions
- Uses lucide-react icons for visual appeal

---

## Testing

To test this flow:

1. Ensure your Google OAuth endpoint works and returns a token
2. Test the query parameter parsing with: 
   - `/log-in?token=test&newUser=true`
3. Fill in the form and submit
4. Verify API call succeeds and user is updated
5. Check that redirects work correctly based on role

---

## Future Enhancements

You could add:
- Profile picture upload during completion
- Phone number input
- Address/location selection
- Email verification step
- Terms & conditions checkbox
- Onboarding tutorial for sellers
