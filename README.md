# User Management System - MERN Stack

A production-ready User Management System built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, Role-Based Access Control (RBAC), and comprehensive user management capabilities.

## 🎯 Features

### Authentication & Authorization
- ✅ User registration and login with email/password
- ✅ JWT-based authentication (Access & Refresh tokens)
- ✅ Secure password hashing with bcrypt
- ✅ Role-Based Access Control (Admin, Manager, User)
- ✅ Protected routes and endpoints
- ✅ Automatic token refresh mechanism

### User Management
- ✅ Admin can create, read, update, and delete users
- ✅ Manager can view and manage non-admin users
- ✅ Users can manage their own profiles
- ✅ User filtering by role and status
- ✅ Search functionality
- ✅ Pagination
- ✅ Soft delete (deactivate users)

### Audit Trail
- ✅ Track creation and update timestamps
- ✅ Track who created/updated each user (createdBy, updatedBy)
- ✅ View audit information on user detail pages

### UI/UX
- ✅ Clean, intuitive interface
- ✅ Responsive design for mobile and desktop
- ✅ Role-based navigation
- ✅ Alert notifications
- ✅ Confirmation modals
- ✅ Loading states

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- CORS enabled
- Environment configuration with dotenv

### Frontend
- React 18
- React Router v6
- Axios for HTTP requests
- Context API for state management
- CSS Modules for styling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd User-Management-System
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables in .env
# MONGODB_URI=mongodb://localhost:27017/user-management-system
# JWT_SECRET=your-secret-key
# JWT_REFRESH_SECRET=your-refresh-secret-key
# PORT=5000

# Start the backend server
npm start

# For development with auto-reload
npm run dev
```

### 3. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure API endpoint (usually http://localhost:5000/api)

# Start the frontend development server
npm start
```

The application should now be accessible at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass",
  "passwordConfirm": "newpass"
}
```

#### Refresh Tokens
```
POST /api/auth/refresh-tokens
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### User Management Endpoints

#### Get All Users (Admin/Manager only)
```
GET /api/users?page=1&limit=10&role=Admin&status=active&search=john
Authorization: Bearer <access_token>
```

#### Get User by ID
```
GET /api/users/:userId
Authorization: Bearer <access_token>
```

#### Create User (Admin only)
```
POST /api/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "User",
  "status": "active"
}
```

#### Update User
```
PUT /api/users/:userId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.new@example.com",
  "role": "Manager",
  "status": "active"
}
```

#### Delete User (Soft delete)
```
DELETE /api/users/:userId
Authorization: Bearer <access_token>
```

#### Get User Statistics (Admin only)
```
GET /api/users/stats
Authorization: Bearer <access_token>
```

## 👥 User Roles & Permissions

### Admin
- ✅ Full access to user management
- ✅ Create, read, update, delete users
- ✅ Assign and change user roles
- ✅ View user statistics
- ✅ Manage all users

### Manager
- ✅ View all users
- ✅ View non-admin user details
- ✅ Update non-admin users
- ✅ Cannot create or delete users
- ✅ Cannot modify admin users

### User
- ✅ View own profile
- ✅ Update own profile (name, email)
- ✅ Change own password
- ✅ Cannot view other users
- ✅ Cannot modify roles

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Environment variables for sensitive data
- Input validation on both frontend and backend
- Protected API endpoints with role checks
- Secure HTTP headers
- CORS configuration
- Mongoose schema validation

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, unique, valid format),
  password: String (required, hashed),
  role: String (Admin, Manager, User),
  status: String (active, inactive),
  createdBy: ObjectId (reference to User),
  updatedBy: ObjectId (reference to User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🐳 Docker Deployment (Optional)

### Using Docker Compose

```bash
# Create a docker-compose.yml file with MongoDB and Node services
docker-compose up --build

# MongoDB will be available at mongodb://mongo:27017
# Backend will be available at http://localhost:5000
# Frontend will be available at http://localhost:3000
```

## 📦 Deployment to Cloud Platforms

### Option 1: Render

#### Backend Deployment
1. Push code to GitHub
2. Connect GitHub repository to Render
3. Create a new Web Service
4. Set environment variables
5. Deploy

#### Frontend Deployment
1. Build the React app: `npm run build`
2. Connect to Render or Vercel
3. Set `REACT_APP_API_URL` to backend URL
4. Deploy

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Backend on Railway
```bash
1. Connect GitHub to Railway
2. Deploy backend service
3. Add MongoDB connection string
4. Set environment variables
5. Copy the deployment URL
```

#### Frontend on Vercel
```bash
1. Connect GitHub to Vercel
2. Set REACT_APP_API_URL to Railway backend URL
3. Deploy
```

### Option 3: Heroku Alternative (Render)

```bash
# Deploy backend
render deploy --name user-management-backend

# Deploy frontend
vercel deploy --prod
```

## 🧪 Testing

### Test with Demo Credentials

**Admin Account:**
- Email: admin@example.com
- Password: password123

**Manager Account:**
- Email: manager@example.com
- Password: password123

**User Account:**
- Email: user@example.com
- Password: password123

### Manual Testing Flow

1. Register a new user
2. Login with credentials
3. Create users as admin
4. Test role-based access
5. Update user profiles
6. Test password change
7. Test user deactivation
8. Verify audit trails

## 📁 Project Structure

```
User-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── userService.js
│   │   ├── utils/
│   │   │   ├── errorHandler.js
│   │   │   ├── jwt.js
│   │   │   └── validators.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alert.js
│   │   │   ├── Modal.js
│   │   │   ├── Navbar.js
│   │   │   ├── Pagination.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── UserForm.js
│   │   │   └── UserTable.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── ChangePasswordPage.js
│   │   │   ├── CreateUserPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── EditUserPage.js
│   │   │   ├── ErrorPages.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── UserDetailPage.js
│   │   │   └── UsersPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── Alert.module.css
│   │   │   ├── Modal.module.css
│   │   │   ├── Navbar.module.css
│   │   │   ├── Pages.module.css
│   │   │   ├── Pagination.module.css
│   │   │   ├── UserForm.module.css
│   │   │   ├── UserTable.module.css
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Update `.env` file:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/user-management-system
JWT_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE_IN=1h
JWT_REFRESH_EXPIRE_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Update `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Ensure MongoDB is running
# On Windows: mongod
# On Mac: brew services start mongodb-community
# Check MONGODB_URI in .env file
```

### Port Already in Use
```bash
# Change port in backend/.env
# Or kill the process using the port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### CORS Errors
```bash
# Update CORS_ORIGIN in backend/.env
# Ensure frontend URL matches
```

### Token Expired
```bash
# Clear localStorage and login again
# Verify JWT_SECRET in .env
```

## 📈 Performance Considerations

- Database indexes on email, role, status fields
- Pagination for user lists
- JWT token caching on client
- Lazy loading for components
- Mongoose lean queries for read operations

## 🛡️ Security Best Practices

- Never commit .env files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Use secure cookies for token storage in production
- Implement rate limiting for login attempts
- Regular security audits
- Keep dependencies updated

## 📝 Git Workflow

```bash
# Initialize repository
git init

# Create meaningful commits
git add .
git commit -m "Initial setup: backend structure"
git commit -m "Add authentication endpoints"
git commit -m "Add frontend authentication flow"
git commit -m "Add user management features"
git commit -m "Add deployment configuration"

# Push to remote
git push origin main
```

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 👨‍💻 Author

Built as a comprehensive example of MERN stack development with production-ready features.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check component prop requirements
4. Ensure all environment variables are set correctly

## 🚀 Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] User activity logs
- [ ] Advanced filtering and exports
- [ ] API rate limiting
- [ ] WebSocket notifications
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] API documentation with Swagger

---

**Last Updated**: April 2026
**Version**: 1.0.0
