# 🏗️ System Architecture Guide

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER MANAGEMENT SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│   Frontend (React)   │          │  Backend (Node.js)   │          │   Database (MongoDB) │
│   - React 18         │◄────────►│   - Express.js       │◄────────►│   - Collections      │
│   - Router v6        │  HTTP    │   - JWT Auth         │  CRUD    │   - Indexes          │
│   - Context API      │  (REST)  │   - RBAC             │          │   - Validation       │
│   - Axios            │          │   - Services         │          │                      │
└──────────────────────┘          └──────────────────────┘          └──────────────────────┘
      Port 3000                         Port 5000                     Port 27017
   localhost:3000              localhost:5000/api
                               /auth, /users, /health
```

## Data Flow Diagram

### Authentication Flow
```
┌─────────────────┐
│  User Registers │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────────────┐
    │  1. Frontend sends email + password      │
    │  2. Backend validates input             │
    │  3. Check if email exists               │
    │  4. Hash password (bcrypt)              │
    │  5. Save user to MongoDB                │
    │  6. Return access + refresh tokens      │
    └──────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  Tokens Generated   │
         │  Access: 1h         │
         │  Refresh: 7d        │
         └──────────┬──────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │ Store in localStorage    │
         │ (Frontend)               │
         └──────────────────────────┘
```

### Authorization Flow
```
┌──────────────────────────────────┐
│ User Makes API Request           │
│ + Authorization: Bearer TOKEN    │
└────────────┬─────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Backend Middleware Chain       │
    │ 1. Verify JWT token           │
    │ 2. Extract user data          │
    │ 3. Check role                 │
    │ 4. Check permissions          │
    └────────────┬───────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐       ┌──────────┐
   │ Allowed │       │ Forbidden│
   │ (200)   │       │ (403)    │
   └─────────┘       └──────────┘
```

## Request/Response Cycle

### Successful Request
```
Client Request (Frontend)
    │
    ├─ Header: Authorization: Bearer {token}
    ├─ Method: GET /api/users
    └─ Data: (if POST/PUT)
         │
         ▼
Server (Backend)
    │
    ├─ Step 1: Receive Request
    ├─ Step 2: Parse Headers
    ├─ Step 3: Verify JWT Token
    ├─ Step 4: Authenticate User
    ├─ Step 5: Check Authorization
    ├─ Step 6: Validate Input
    ├─ Step 7: Process Business Logic
    ├─ Step 8: Query Database
    ├─ Step 9: Format Response
    └─ Step 10: Send Response
         │
         ▼
Client Response (Frontend)
    │
    ├─ Status: 200 OK
    ├─ Headers: Content-Type: application/json
    └─ Body: { data: [...], message: "Success" }
         │
         ▼
Frontend Processing
    │
    ├─ Check Status Code
    ├─ Parse JSON
    ├─ Update State
    ├─ Show Success Message
    └─ Redirect if needed
```

### Error Request
```
Client Request
    │
    ▼
Server Error Handling
    │
    ├─ Catch Error
    ├─ Determine Error Type
    │   ├─ Validation Error
    │   ├─ Authentication Error
    │   ├─ Authorization Error
    │   ├─ Not Found Error
    │   └─ Server Error
    │
    ├─ Format Error Response
    └─ Send HTTP Status Code
         │
         ▼
Client Response
    │
    ├─ Status: 400/401/403/404/500
    └─ Body: { message: "Error description" }
```

## Component Architecture

### Backend Services

```
Express Server
    │
    ├─ Routes Layer
    │   ├─ authRoutes.js (public + protected)
    │   └─ userRoutes.js (protected with RBAC)
    │
    ├─ Middleware Layer
    │   ├─ authenticate() - JWT verification
    │   ├─ authorize() - Role checking
    │   └─ errorHandler() - Error responses
    │
    ├─ Controllers Layer
    │   ├─ authController.js
    │   │   ├─ register()
    │   │   ├─ login()
    │   │   ├─ refreshTokens()
    │   │   ├─ changePassword()
    │   │   ├─ getMe()
    │   │   └─ logout()
    │   │
    │   └─ userController.js
    │       ├─ getAllUsers()
    │       ├─ getUserById()
    │       ├─ createUser()
    │       ├─ updateUser()
    │       ├─ deleteUser()
    │       ├─ getUserStats()
    │       └─ updateProfile()
    │
    ├─ Services Layer
    │   ├─ authService.js
    │   │   ├─ register()
    │   │   ├─ login()
    │   │   └─ changePassword()
    │   │
    │   └─ userService.js
    │       ├─ getAllUsers()
    │       ├─ getUserById()
    │       ├─ createUser()
    │       └─ updateUser()
    │
    ├─ Models Layer
    │   └─ User.js (Mongoose Schema)
    │       ├─ Validation
    │       ├─ Pre-save hooks
    │       └─ Methods
    │
    └─ Utilities
        ├─ jwt.js (Token generation/verification)
        ├─ validators.js (Input validation)
        └─ errorHandler.js (Error formatting)
```

### Frontend Components

```
React App
    │
    ├─ Providers
    │   └─ AuthProvider (Context API)
    │
    ├─ Routes
    │   ├─ Public Routes
    │   │   ├─ /login → LoginPage
    │   │   └─ /register → RegisterPage
    │   │
    │   ├─ Protected Routes (Auth Required)
    │   │   ├─ /dashboard → DashboardPage
    │   │   ├─ /profile → ProfilePage
    │   │   ├─ /change-password → ChangePasswordPage
    │   │   │
    │   │   ├─ Admin Only
    │   │   │   ├─ /users → UsersPage
    │   │   │   ├─ /users/:id → UserDetailPage
    │   │   │   ├─ /users/create → CreateUserPage
    │   │   │   └─ /users/:id/edit → EditUserPage
    │   │   │
    │   │   └─ Manager Only
    │   │       └─ /users → UsersPage
    │   │
    │   └─ Error Routes
    │       ├─ /404 → NotFoundPage
    │       ├─ /403 → UnauthorizedPage
    │       └─ /* → NotFoundPage (catch-all)
    │
    ├─ Components
    │   ├─ Navbar.js (Navigation)
    │   ├─ ProtectedRoute.js (Route protection)
    │   ├─ UserForm.js (Reusable form)
    │   ├─ UserTable.js (User list)
    │   ├─ Pagination.js (Page navigation)
    │   ├─ Alert.js (Notifications)
    │   └─ Modal.js (Confirmations)
    │
    ├─ Context
    │   └─ AuthContext.js
    │       ├─ user state
    │       ├─ loading state
    │       ├─ error state
    │       ├─ register()
    │       ├─ login()
    │       ├─ logout()
    │       └─ changePassword()
    │
    ├─ Services
    │   └─ api.js
    │       ├─ axios instance
    │       ├─ Request interceptor (add token)
    │       ├─ Response interceptor (token refresh)
    │       ├─ AuthService
    │       └─ UserService
    │
    └─ Styles (CSS Modules)
        ├─ Navbar.module.css
        ├─ Pages.module.css
        ├─ UserForm.module.css
        ├─ UserTable.module.css
        ├─ Pagination.module.css
        ├─ Alert.module.css
        ├─ Modal.module.css
        └─ index.css (globals)
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,          // 2-100 characters
  email: String,         // unique, indexed
  password: String,      // hashed, never returned
  role: String,          // Admin, Manager, User
  status: String,        // active, inactive
  createdAt: Date,       // auto-generated
  updatedAt: Date,       // auto-updated
  createdBy: ObjectId,   // reference to User
  updatedBy: ObjectId,   // reference to User
}
```

**Indexes:**
```
- email (unique)
- role (for filtering)
- status (for filtering)
- createdAt (for sorting)
```

## Authentication & Authorization

### JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

├─ Header: Algorithm and token type
├─ Payload: User data
│   ├─ sub: User ID
│   ├─ email: User email
│   ├─ role: User role
│   └─ iat: Issue time
└─ Signature: Encrypted verification
```

### Role-Based Access Control

```
Admin (Full Access)
├─ Create users
├─ Read all users
├─ Update any user
├─ Delete users
├─ View statistics
└─ View audit trail

Manager (Limited Access)
├─ Can't create users (unless super manager)
├─ Read all users except admins
├─ Update non-admin users
├─ Can't delete users
└─ View some statistics

User (Own Data Only)
├─ Can't create users
├─ Can't read other users
├─ Update own profile only
├─ Can't delete users
└─ View own data only
```

## API Endpoints Map

### Authentication Endpoints

```
POST   /api/auth/register
       ├─ Public
       ├─ Body: { name, email, password, passwordConfirm }
       └─ Response: { tokens, user }

POST   /api/auth/login
       ├─ Public
       ├─ Body: { email, password }
       └─ Response: { tokens, user }

POST   /api/auth/refresh-tokens
       ├─ Public
       ├─ Body: { refreshToken }
       └─ Response: { tokens }

GET    /api/auth/me
       ├─ Protected
       ├─ Response: { user }
       └─ Headers: Authorization: Bearer {token}

PUT    /api/auth/change-password
       ├─ Protected
       ├─ Body: { currentPassword, newPassword, passwordConfirm }
       └─ Response: { message }

POST   /api/auth/logout
       ├─ Protected
       └─ Response: { message }
```

### User Management Endpoints

```
GET    /api/users
       ├─ Protected (Admin/Manager)
       ├─ Query: ?page=1&limit=10&role=&status=&search=
       └─ Response: { users, pagination, stats }

GET    /api/users/:userId
       ├─ Protected (Admin/Manager/Owner)
       └─ Response: { user }

POST   /api/users
       ├─ Protected (Admin)
       ├─ Body: { name, email, password, role, status }
       └─ Response: { user, credentials }

PUT    /api/users/:userId
       ├─ Protected (Admin/Manager/Owner)
       ├─ Body: { name, email, role, status, password }
       └─ Response: { user }

DELETE /api/users/:userId
       ├─ Protected (Admin)
       └─ Response: { message }

GET    /api/users/stats
       ├─ Protected (Admin)
       └─ Response: { totalUsers, activeUsers, byRole }

PUT    /api/auth/profile
       ├─ Protected (Any user)
       ├─ Body: { name, email }
       └─ Response: { user }
```

### Health Check

```
GET    /api/health
       ├─ Public
       ├─ Used for monitoring
       └─ Response: { status: "healthy" }
```

## Middleware Stack

### Request Processing Order

```
Incoming Request
    │
    ▼
1. Body Parser (express.json())
   └─ Parse JSON body
    │
    ▼
2. CORS Middleware
   └─ Check origin, allow cross-origin
    │
    ▼
3. Authentication Middleware (if protected route)
   ├─ Extract token from header
   ├─ Verify signature
   ├─ Check expiration
   └─ Attach user to request
    │
    ▼
4. Authorization Middleware (if role-protected)
   ├─ Check user role
   ├─ Check required permissions
   └─ Allow/Deny access
    │
    ▼
5. Route Handler (Controller)
   ├─ Validate input
   ├─ Call service
   ├─ Return response
   └─ Catch errors
    │
    ▼
6. Error Middleware
   ├─ Catch all errors
   ├─ Format error
   └─ Send response
    │
    ▼
Response to Client
```

## Error Handling Flow

```
Request Processing
    │
    ├─ If Error Caught
    │   │
    │   ├─ TypeError → 400 Bad Request
    │   ├─ ValidationError → 422 Unprocessable
    │   ├─ JWTError → 401 Unauthorized
    │   ├─ ForbiddenError → 403 Forbidden
    │   ├─ NotFoundError → 404 Not Found
    │   ├─ ConflictError → 409 Conflict
    │   └─ ServerError → 500 Internal Server Error
    │
    └─ Response Format
        {
          success: false,
          message: "Error description",
          statusCode: 400,
          stack: "..." (dev only)
        }
```

## Security Layers

```
Layer 1: Network
├─ HTTPS/SSL
├─ Firewall rules
└─ CORS configuration

Layer 2: Authentication
├─ Strong password requirements
├─ bcrypt hashing
├─ JWT tokens
└─ Token expiration

Layer 3: Authorization
├─ Role checking
├─ Permission verification
└─ User ownership checks

Layer 4: Input Validation
├─ Email format
├─ Password strength
├─ Length checks
└─ Type validation

Layer 5: Output Sanitization
├─ Never expose passwords
├─ Never expose secrets
└─ Error message safety

Layer 6: Database
├─ Mongoose validation
├─ Indexes for performance
└─ Connection pooling
```

## Deployment Architecture

### Local Development
```
Your Machine
    ├─ Frontend (React) :3000
    ├─ Backend (Node) :5000
    └─ MongoDB :27017
```

### Docker Development
```
Docker Network
    ├─ Frontend Container
    ├─ Backend Container
    └─ MongoDB Container
```

### Production Deployment (Example)

```
User → CDN/Domain
    │
    ├─ Static Assets (Frontend)
    │   └─ Vercel, Netlify, or S3 + CloudFront
    │
    └─ API Requests
        └─ Backend Server
            └─ Render, Railway, or AWS
                │
                └─ MongoDB Atlas (Cloud)
```

## Performance Considerations

### Frontend
- React.memo for component optimization
- Lazy loading of routes
- Code splitting
- Image optimization

### Backend
- Database indexes on frequently queried fields
- Connection pooling
- Pagination to limit data size
- Lean queries for read operations

### Database
- Indexes: email, role, status, createdAt
- Connection pooling (default in Node driver)
- Query optimization
- Regular backups

## Monitoring & Logging

### Backend Logs
```
Development: All logs to console
Production: Structured logging recommended
- Request/response logging
- Error logging
- Performance metrics
- Access logs
```

### Frontend Monitoring
```
- Console errors
- API error tracking
- User interaction logging
- Performance metrics
```

### Database Monitoring
```
- Query performance
- Connection pool status
- Disk usage
- Backup status
```

## Scalability Plan

### Horizontal Scaling
1. **Frontend**: CDN + multiple edge servers
2. **Backend**: Load balancer + multiple instances
3. **Database**: Replication + sharding

### Vertical Scaling
1. Upgrade server resources
2. Database optimization
3. Caching layer (Redis)

### Future Improvements
- Caching (Redis)
- Message queue (RabbitMQ)
- Microservices
- Kubernetes orchestration

---

This architecture provides a solid foundation for a scalable, secure user management system!
