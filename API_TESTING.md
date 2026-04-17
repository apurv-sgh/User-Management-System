# API Testing Guide

## Using Postman or cURL to Test APIs

This guide shows how to test all API endpoints with real examples.

## 1. Authentication Endpoints

### Register a New User

**Endpoint:** `POST /api/auth/register`

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "passwordConfirm": "SecurePass123!"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "status": "active"
    }
  }
}
```

### Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Change Password

**Endpoint:** `PUT /api/auth/change-password`

**Headers Required:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "NewPassword456!",
    "passwordConfirm": "NewPassword456!"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Refresh Tokens

**Endpoint:** `POST /api/auth/refresh-tokens`

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh-tokens \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Logout

**Endpoint:** `POST /api/auth/logout`

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 2. User Management Endpoints

### Get All Users (Paginated)

**Endpoint:** `GET /api/users`

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
```
?page=1                    # Page number (default: 1)
&limit=10                  # Items per page (default: 10)
&role=Admin                # Filter by role (optional)
&status=active             # Filter by status (optional)
&search=john               # Search by name or email (optional)
```

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=10&role=Admin" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439010",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "Admin",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "createdBy": {
          "_id": "507f1f77bcf86cd799439000",
          "name": "System",
          "email": "system@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalDocuments": 45
    }
  }
}
```

### Get User by ID

**Endpoint:** `GET /api/users/{userId}`

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/users/507f1f77bcf86cd799439010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439000",
        "name": "System",
        "email": "system@example.com"
      },
      "updatedBy": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
}
```

### Create User (Admin Only)

**Endpoint:** `POST /api/users`

**Headers Required:**
```
Authorization: Bearer {accessToken}  (must be Admin)
Content-Type: application/json
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "role": "Manager",
    "status": "active"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "New User",
      "email": "newuser@example.com",
      "role": "Manager",
      "status": "active",
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    },
    "credentials": {
      "email": "newuser@example.com",
      "temporaryPassword": "TmpPass123!@#"
    }
  }
}
```

### Update User

**Endpoint:** `PUT /api/users/{userId}`

**Headers Required:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Notes:**
- Admin can update any user
- Manager can update non-admin users
- Users can only update their own profile

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/users/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updatedemail@example.com",
    "status": "inactive"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Updated Name",
      "email": "updatedemail@example.com",
      "role": "Manager",
      "status": "inactive",
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:30:00Z",
      "updatedBy": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
}
```

### Delete User (Admin Only - Soft Delete)

**Endpoint:** `DELETE /api/users/{userId}`

**Headers Required:**
```
Authorization: Bearer {accessToken}  (must be Admin)
```

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/users/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Get User Statistics (Admin Only)

**Endpoint:** `GET /api/users/stats`

**Headers Required:**
```
Authorization: Bearer {accessToken}  (must be Admin)
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 45,
      "activeUsers": 40,
      "inactiveUsers": 5,
      "byRole": {
        "Admin": 2,
        "Manager": 8,
        "User": 35
      },
      "byStatus": {
        "active": 40,
        "inactive": 5
      }
    }
  }
}
```

### Update Profile (Any Authenticated User)

**Endpoint:** `PUT /api/auth/profile`

**Headers Required:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "email": "newemail@example.com"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "New Name",
      "email": "newemail@example.com",
      "role": "Admin",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    }
  }
}
```

---

## 3. Health Check

### Check API Health

**Endpoint:** `GET /api/health`

**cURL:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  },
  "statusCode": 400
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token",
  "statusCode": 401
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden - You don't have permission to access this resource",
  "statusCode": 403
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "Email already registered",
  "statusCode": 409
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## Testing Workflow

### 1. Test Registration
1. POST /api/auth/register with new user
2. Verify response contains tokens and user data

### 2. Test Login
1. POST /api/auth/login with registered user
2. Copy access token from response

### 3. Test Protected Route
1. GET /api/auth/me with access token
2. Verify you get current user data

### 4. Test User Management (Admin)
1. GET /api/users (list users)
2. POST /api/users (create user)
3. PUT /api/users/{id} (update user)
4. DELETE /api/users/{id} (delete user)

### 5. Test Token Refresh
1. POST /api/auth/refresh-tokens with refresh token
2. Get new access token

### 6. Test Unauthorized Access
1. Try to access /api/users without token (should fail with 401)
2. Try to create user as non-admin (should fail with 403)

---

## Using Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Paste this collection:

```json
{
  "info": {
    "name": "User Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"passwordConfirm\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api",
      "type": "string"
    },
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    }
  ]
}
```

### Set Variables
1. Set `baseUrl` to your API URL
2. After login, copy `accessToken` and paste in variable
3. Use `{{accessToken}}` in Authorization header

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test login endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -p data.json -T application/json http://localhost:5000/api/auth/login

# Test get users endpoint
ab -n 100 -c 10 -H "Authorization: Bearer {token}" http://localhost:5000/api/users
```

### cURL with Timing

```bash
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health
```

---

**Happy Testing!** 🚀

For more details, see the full [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
