# User Management System

A full-stack web application for managing users with role-based access control, authentication, and dashboard analytics.

## 🎯 Project Overview

The **User Management System** is a comprehensive web application designed to manage users efficiently with:

- **Authentication System**: Secure JWT-based authentication with access and refresh tokens
- **Role-Based Access Control (RBAC)**: Three user roles with different permission levels
- **User Management**: CRUD operations for managing user accounts
- **Dashboard Analytics**: Statistics, role distribution, and recent activity tracking
- **Profile Management**: Users can view and update their own profiles
- **Audit Logging**: Track all user actions for security and compliance

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js ^4.21.2
- **Database**: MongoDB ^6.3.0
- **Authentication**: 
  - JWT (jsonwebtoken ^9.0.2)
  - Password Hashing (bcryptjs ^3.0.2)
- **Middleware**: CORS ^2.8.5
- **Environment Management**: dotenv ^16.4.5

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.7
- **Routing**: React Router DOM 6.28.1
- **HTTP Client**: Axios 1.7.9
- **Styling**: Tailwind CSS 4.0.0
- **UI Icons**: Lucide React 0.469.0
- **Utilities**: date-fns 3.6.0

### Development Tools
- **Frontend Build**: Vite with React plugin
- **Styling**: Tailwind CSS with Vite integration
- **TypeScript Configuration**: ES2022 target

---


## ✨ Features

### Authentication & Security
- ✅ User registration with email validation
- ✅ Secure login with bcryptjs password hashing
- ✅ JWT-based token authentication
- ✅ Access and refresh token mechanism
- ✅ Token expiration and refresh
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and endpoints
- ✅ Audit logging for all user actions

### User Management
- ✅ Create new users (admin only)
- ✅ View all users with pagination (admin/manager)
- ✅ View individual user details
- ✅ Update user information
- ✅ Delete users (admin/manager)
- ✅ User status management (active/inactive)
- ✅ Track user creation and modification

### Dashboard & Analytics
- ✅ User statistics (total, active, inactive, by role)
- ✅ Role distribution visualization
- ✅ Recent activity tracking
- ✅ Comprehensive audit logs

### Profile Management
- ✅ View current user profile
- ✅ Update personal information
- ✅ Email change with uniqueness validation
- ✅ Profile update history

### Frontend
- ✅ Responsive design with Tailwind CSS
- ✅ Modern React 18 with hooks
- ✅ React Router for navigation
- ✅ Global auth state management with Context API
- ✅ Axios interceptors for API calls
- ✅ Error handling and user feedback
- ✅ Loading states and spinners
- ✅ Date formatting with date-fns
- ✅ Icons with Lucide React

---


## ⚙️ Requirements

### System Requirements
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: v5.0 or higher (local or cloud instance)

### Browser Support
- Modern browsers supporting ES2022
- Chrome, Firefox, Safari, Edge (latest versions)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd User-Management-System
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

---

## 🔐 Environment Variables

### Backend (.env file)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/user-management
# or for MongoDB Atlas
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/user-management

# Server
PORT=8080

# JWT/Security
SESSION_SECRET=your-secret-key-here-change-in-production
```

### Frontend (.env file)

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
```

**Note**: The frontend is configured to proxy `/api` requests to `http://localhost:8080` via Vite's proxy settings.

---


## 👥 User Roles & Permissions

The system supports three user roles with different permission levels:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features including user management, dashboard, and profile management. Can create, read, update, and delete users. Can view dashboard analytics. |
| **Manager** | Can view all users and dashboard analytics. Can update and delete users. Cannot create new users. Can manage their own profile. |
| **User** | Can only view and update their own profile. Cannot access dashboard or user management features. |

### Permission Matrix

| Endpoint | Admin | Manager | User |
|----------|-------|---------|------|
| `GET /api/users` | ✅ | ✅ | ❌ |
| `GET /api/users/:id` | ✅ | ✅ | ✅* |
| `POST /api/users` | ✅ | ❌ | ❌ |
| `PUT /api/users/:id` | ✅ | ✅ | ✅* |
| `DELETE /api/users/:id` | ✅ | ✅ | ❌ |
| `GET /api/dashboard/stats` | ✅ | ✅ | ❌ |
| `GET /api/dashboard/role-distribution` | ✅ | ✅ | ❌ |
| `GET /api/dashboard/recent-activity` | ✅ | ✅ | ❌ |
| `GET /api/profile` | ✅ | ✅ | ✅ |
| `PUT /api/profile` | ✅ | ✅ | ✅ |

*: Can only access/update own profile

---

## 🔌 API Endpoints

### Health Check
```
GET /api/healthz
```
Returns server status and timestamp.

### Authentication Endpoints (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"  // optional, defaults to "user"
}
```


#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Refresh Access Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Status Codes:**
- `201 Created` - User registered successfully
- `200 OK` - Login/Refresh/Logout successful
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid credentials
- `409 Conflict` - Email already in use

---

### User Management Endpoints (`/api/users`)

*All endpoints require authentication. See [Authorization](#authentication--authorization) for details.*

#### Get All Users
```http
GET /api/users
Authorization: Bearer <accessToken>
```
**Required Role:** `admin`, `manager`


#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <accessToken>
```
**Required Role:** All authenticated users


#### Create User
```http
POST /api/users
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword456",
  "role": "user"
}
```
**Required Role:** `admin`

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "manager",
  "status": "inactive"
}
```
**Required Role:** `admin`, `manager`, `user` (user can only update own profile)


#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <accessToken>
```
**Required Role:** `admin`, `manager`


**Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - User not found
- `409 Conflict` - Email already exists

---

### Dashboard Endpoints (`/api/dashboard`)

*All endpoints require authentication and `admin` or `manager` role.*

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <accessToken>
```
**Required Role:** `admin`, `manager`


#### Get Role Distribution
```http
GET /api/dashboard/role-distribution
Authorization: Bearer <accessToken>
```
**Required Role:** `admin`, `manager`


#### Get Recent Activity
```http
GET /api/dashboard/recent-activity
Authorization: Bearer <accessToken>
```
**Required Role:** `admin`, `manager`

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions

---

### Profile Endpoints (`/api/profile`)

*All endpoints require authentication.*

#### Get Current User Profile
```http
GET /api/profile
Authorization: Bearer <accessToken>
```
**Required Role:** All authenticated users


#### Update Current User Profile
```http
PUT /api/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.new@example.com"
}
```
**Required Role:** All authenticated users (can only update own profile)

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Missing or invalid token
- `400 Bad Request` - Invalid request data
- `409 Conflict` - Email already in use

---

## 🔐 Authentication & Authorization

### JWT Token Structure

The system uses two types of tokens:

1. **Access Token** (Short-lived)
   - Expiry: 15 minutes
   - Used for API requests in the `Authorization: Bearer <token>` header

2. **Refresh Token** (Long-lived)
   - Expiry: 7 days
   - Used to obtain new access tokens when they expire

### Token Format

Both tokens are **JSON Web Tokens (JWT)** with the following payload:

```json
{
  "id": "60d5ec49c1234567890abcd",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "iat": 1705402200,
  "exp": 1705403100
}
```

---


## 💾 Database Schema

### Collections

#### users
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "passwordHash": String,
  "role": String (enum: "admin", "manager", "user"),
  "status": String (enum: "active", "inactive"),
  "createdAt": Date,
  "updatedAt": Date,
  "createdBy": ObjectId | null,
  "updatedBy": ObjectId | null
}
```

#### refreshTokens
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "token": String,
  "expiresAt": Date,
  "createdAt": Date
}
```

#### auditLogs
```json
{
  "_id": ObjectId,
  "action": String (e.g., "USER_LOGIN", "USER_REGISTERED", "USER_UPDATED"),
  "targetUserId": ObjectId,
  "targetUserName": String,
  "performedById": ObjectId,
  "performedByName": String,
  "details": Object | null,
  "createdAt": Date
}
```

### Indexes (Recommended)

Create these indexes for optimal performance:

```javascript
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "createdAt": -1 });

// Refresh tokens collection
db.refreshTokens.createIndex({ "userId": 1 });
db.refreshTokens.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

// Audit logs collection
db.auditLogs.createIndex({ "targetUserId": 1 });
db.auditLogs.createIndex({ "performedById": 1 });
db.auditLogs.createIndex({ "createdAt": -1 });
```

---
