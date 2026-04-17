# User Management System - Backend

## Overview

Backend API for the MERN User Management System with JWT authentication and Role-Based Access Control (RBAC).

## Features

- User authentication with JWT tokens
- Refresh token support for long-lived sessions
- Role-based access control (Admin, Manager, User)
- User CRUD operations with soft delete
- Password hashing with bcrypt
- Input validation with express-validator
- Comprehensive error handling
- MongoDB integration with Mongoose
- Audit tracking (createdBy, updatedBy)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Steps

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/user_management_system?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_change_this
   JWT_REFRESH_EXPIRE=30d
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or start the production server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { ... },
      "tokens": {
        "accessToken": "jwt_token",
        "refreshToken": "refresh_token"
      }
    }
  }
  ```

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Request Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "new_jwt_token",
      "refreshToken": "refresh_token"
    }
  }
  ```

#### Logout
- **POST** `/api/auth/logout`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

### User Routes (`/api/users`)

#### Get All Users (Admin, Manager)
- **GET** `/api/users?page=1&limit=10&search=john&role=user&status=active`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": {
      "users": [ ... ],
      "pagination": {
        "total": 50,
        "page": 1,
        "limit": 10,
        "pages": 5
      }
    }
  }
  ```

#### Get User by ID
- **GET** `/api/users/:id`
- **Headers**: `Authorization: Bearer {accessToken}`

#### Create User (Admin)
- **POST** `/api/users`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "status": "active"
  }
  ```

#### Update User (Admin, Manager)
- **PUT** `/api/users/:id`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**: (partial update)
  ```json
  {
    "firstName": "Jane",
    "status": "inactive",
    "role": "manager"
  }
  ```

#### Delete User (Admin)
- **DELETE** `/api/users/:id`
- **Headers**: `Authorization: Bearer {accessToken}`

#### Get Own Profile
- **GET** `/api/users/profile`
- **Headers**: `Authorization: Bearer {accessToken}`

#### Update Own Profile
- **PUT** `/api/users/profile`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith"
  }
  ```

#### Change Password
- **PUT** `/api/users/change-password`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Request Body**:
  ```json
  {
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }
  ```

## Role-Based Access Control

### Admin
- Create users
- View all users
- Update any user
- Delete users
- Assign roles
- View audit information

### Manager
- View all users
- Update non-admin users
- Cannot delete users
- Cannot modify admins
- View audit information

### User
- View own profile
- Update own profile only
- Change own password

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt (10 salt rounds)
3. User logs in with email and password
4. Server generates access token (7-day expiry) and refresh token (30-day expiry)
5. Client stores tokens in localStorage or cookies
6. Client includes access token in Authorization header: `Bearer {token}`
7. When token expires, use refresh token to get new access token

## Security Considerations

- Passwords are never stored in plain text (hashed with bcrypt)
- JWT secret should be strong and stored in environment variables
- CORS is configured to allow requests from frontend domain
- All inputs are validated before processing
- Errors don't leak sensitive information
- Soft delete ensures data is not permanently lost

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ { "field": "email", "message": "Invalid email" } ]
}
```

## Deployment

### Environment Variables for Production

```
NODE_ENV=production
MONGO_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/user_management_system
JWT_SECRET=your_production_secret_key_at_least_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_production_refresh_secret_key
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Platforms

#### Render
1. Push code to GitHub
2. Connect Render to GitHub repository
3. Set environment variables in Render dashboard
4. Deploy

#### Railway
1. Push code to GitHub
2. Connect Railway to GitHub
3. Railway auto-detects Node.js project
4. Set environment variables
5. Deploy

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Users (with token)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer your_access_token"
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── utils/            # Utility functions
│   ├── validations/      # Input validations
│   ├── constants/        # Constants and enums
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md           # Documentation
```

## Future Enhancements

- Add email verification on registration
- Implement password reset functionality
- Add two-factor authentication (2FA)
- Implement user activity logging
- Add API rate limiting
- Implement caching with Redis
- Add API documentation with Swagger
- Write comprehensive unit and integration tests
