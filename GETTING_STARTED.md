# 🚀 Getting Started with User Management System

## Installation & Running Locally

### Step 1: Prerequisites

Install on your machine:
- **Node.js** (v14+): https://nodejs.org/
- **MongoDB** (local or Atlas): https://mongodb.com/

### Step 2: Clone & Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your MongoDB connection
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

**.env Configuration:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/user-management-system
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE_IN=1h
JWT_REFRESH_EXPIRE_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

**Start Backend:**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Seed demo data (optional)
npm run seed
```

✅ Backend runs on `http://localhost:5000`

### Step 3: Setup Frontend

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env (optional, default is localhost:5000)
```

**.env Configuration:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm start
```

✅ Frontend runs on `http://localhost:3000`

### Step 4: Login

Use one of the demo accounts:

| Role    | Email                   | Password   |
|---------|-------------------------|------------|
| Admin   | admin@example.com       | password123|
| Manager | manager@example.com     | password123|
| User    | user@example.com        | password123|

## 📁 Project File Structure

```
User-Management-System/
│
├── 📄 README.md                      # Full documentation
├── 📄 QUICKSTART.md                  # Quick setup guide
├── 📄 DEPLOYMENT.md                  # Deployment instructions
├── 📄 DATABASE.md                    # Database setup
├── 📄 PROJECT_SUMMARY.md             # Project overview
├── 📄 CONTRIBUTING.md                # Contributing guidelines
├── 📄 docker-compose.yml             # Docker configuration
├── 📄 .gitignore                     # Git ignore rules
│
├── 📁 backend/
│   ├── 📄 package.json               # Dependencies & scripts
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 Dockerfile                 # Docker image
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   └── userController.js     # User management logic
│   │   ├── 📁 middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── 📁 models/
│   │   │   └── User.js               # Database schema
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── userRoutes.js         # User endpoints
│   │   ├── 📁 services/
│   │   │   ├── authService.js        # Auth business logic
│   │   │   └── userService.js        # User business logic
│   │   ├── 📁 utils/
│   │   │   ├── errorHandler.js       # Error utilities
│   │   │   ├── jwt.js                # JWT utilities
│   │   │   └── validators.js         # Input validators
│   │   └── server.js                 # Entry point
│   └── 📁 scripts/
│       └── seed.js                   # Database seeding
│
├── 📁 frontend/
│   ├── 📄 package.json               # Dependencies & scripts
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 Dockerfile                 # Docker image
│   ├── 📁 public/
│   │   └── index.html                # HTML template
│   └── 📁 src/
│       ├── 📄 App.js                 # Main app component
│       ├── 📄 index.js               # Entry point
│       ├── 📁 components/
│       │   ├── Alert.js              # Notification component
│       │   ├── Modal.js              # Confirmation modal
│       │   ├── Navbar.js             # Navigation bar
│       │   ├── Pagination.js         # Page navigation
│       │   ├── ProtectedRoute.js     # Route protection
│       │   ├── UserForm.js           # User form
│       │   ├── UserTable.js          # User table
│       │   └── ...
│       ├── 📁 pages/
│       │   ├── LoginPage.js          # Login
│       │   ├── RegisterPage.js       # Registration
│       │   ├── DashboardPage.js      # Dashboard
│       │   ├── ProfilePage.js        # User profile
│       │   ├── UsersPage.js          # Users list
│       │   ├── UserDetailPage.js     # User details
│       │   ├── CreateUserPage.js     # Create user
│       │   ├── EditUserPage.js       # Edit user
│       │   ├── ChangePasswordPage.js # Password change
│       │   └── ErrorPages.js         # Error pages
│       ├── 📁 context/
│       │   └── AuthContext.js        # Authentication state
│       ├── 📁 services/
│       │   └── api.js                # API calls
│       └── 📁 styles/
│           ├── index.css             # Global styles
│           ├── Alert.module.css
│           ├── Modal.module.css
│           ├── Navbar.module.css
│           ├── Pages.module.css
│           ├── Pagination.module.css
│           ├── UserForm.module.css
│           ├── UserTable.module.css
│           └── Pagination.module.css
│
└── 📁 .github/
    └── 📁 workflows/
        └── ci.yml                   # GitHub Actions
```

## 🔑 Key Credentials

**Database Users (Demo):**
| User Type | Email | Password |
|-----------|-------|----------|
| Admin | admin@example.com | password123 |
| Manager | manager@example.com | password123 |
| Regular User | user@example.com | password123 |

## 🎯 Testing the System

### Test Admin Capabilities
1. Login as `admin@example.com`
2. Go to Users → Create User
3. Create a new user with email and role
4. Edit the user's details
5. View user statistics on Dashboard

### Test Manager Capabilities
1. Login as `manager@example.com`
2. View all users (Users page)
3. View user details
4. Try to edit a non-admin user (should work)
5. Try to edit an admin user (should be blocked)

### Test User Capabilities
1. Login as `user@example.com`
2. View My Profile
3. Update profile (name, email)
4. Try to access Users page (should be blocked)
5. Change password

### Test Authentication
1. Try to access protected pages without login (redirects to login)
2. Try to access admin pages as regular user (shows error)
3. Test token refresh by waiting for token expiry
4. Test logout functionality

## 🐛 Common Issues & Solutions

### MongoDB Connection Failed
```
❌ Error: connect ECONNREFUSED 127.0.0.1:27017

✅ Solutions:
1. Ensure MongoDB is running
   - Windows: mongod
   - Mac: brew services start mongodb-community
2. Check MONGODB_URI in .env
3. For Atlas, whitelist your IP
```

### Port Already in Use
```
❌ Error: listen EADDRINUSE :::5000

✅ Solutions:
1. Change port in .env: PORT=5001
2. Kill process using port (Windows): netstat -ano | findstr :5000
3. Use different port for each service
```

### CORS Error in Browser
```
❌ Error: No 'Access-Control-Allow-Origin' header

✅ Solutions:
1. Check CORS_ORIGIN in backend .env
2. Ensure it matches frontend URL
3. Restart backend server
```

### Login Always Fails
```
❌ Error: Invalid email or password

✅ Solutions:
1. Check user exists in database
2. Run seed script: npm run seed
3. Verify password in database
4. Check email format
```

### Token Expires Too Quick
```
❌ Not staying logged in

✅ Solutions:
1. Check JWT_EXPIRE_IN in .env
2. Default is 1h, change if needed
3. Frontend should handle token refresh
4. Check localStorage for tokens
```

## 💾 Database Commands

### MongoDB CLI
```bash
# Connect to MongoDB
mongosh

# Use database
use user-management-system

# Check collections
show collections

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: 'admin@example.com' })

# Delete all users
db.users.deleteMany({})
```

## 📊 API Testing with cURL

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Get user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get all users (replace TOKEN)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer TOKEN"
```

## 🐳 Docker Quick Start

```bash
# Start all services with Docker
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - MongoDB: localhost:27017

# Stop all services
docker-compose down
```

## 📈 Performance Tips

### Frontend
- Clear browser cache for updates
- Use React DevTools extension
- Check network tab for API issues
- Optimize images for production

### Backend
- Monitor logs: `npm run dev`
- Check database indexes
- Use Postman for API testing
- Monitor performance in production

## 🔒 Security Checklist

Before production:
- [ ] Change JWT_SECRET to random string
- [ ] Change JWT_REFRESH_SECRET
- [ ] Update CORS_ORIGIN for your domain
- [ ] Use HTTPS/SSL in production
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB authentication
- [ ] Regular backups enabled
- [ ] Monitor access logs

## 📝 Useful Commands

```bash
# Backend
npm install               # Install dependencies
npm start                 # Start production server
npm run dev              # Start dev server with auto-reload
npm test                 # Run tests (when implemented)
npm run seed             # Seed database with demo data

# Frontend
npm install              # Install dependencies
npm start                # Start dev server
npm run build            # Build for production
npm test                 # Run tests

# Git
git status               # Check changes
git add .                # Stage all changes
git commit -m "message"  # Create commit
git push                 # Push to remote
git log                  # View commit history

# Docker
docker-compose up        # Start all services
docker-compose down      # Stop all services
docker-compose logs      # View logs
```

## 📞 Need Help?

1. **Check Documentation**
   - README.md - Full documentation
   - QUICKSTART.md - Quick setup
   - DEPLOYMENT.md - Deployment guide

2. **Check Browser Console**
   - F12 → Console tab
   - Look for error messages
   - Check Network tab for API errors

3. **Check Backend Logs**
   - Terminal output while running npm run dev
   - Look for error messages
   - Check MongoDB connection messages

4. **Verify Environment**
   - Check .env file exists
   - Verify variables are set correctly
   - Ensure MongoDB is running
   - Ensure ports are available

## 🎓 Learning Resources

- **MongoDB**: https://docs.mongodb.com/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Node.js**: https://nodejs.org/docs/

## ✅ What's Included

✅ Complete backend with authentication  
✅ Complete frontend with all features  
✅ Database schema and indexes  
✅ Docker support  
✅ Comprehensive documentation  
✅ API endpoints  
✅ Role-based access control  
✅ Audit trail  
✅ Error handling  
✅ Input validation  

## 🚀 Next Steps

1. **Local Testing**: Get it running locally first
2. **Database Setup**: Use MongoDB Atlas for cloud
3. **Customization**: Add your features
4. **Deployment**: Follow DEPLOYMENT.md
5. **Monitoring**: Set up logging and alerts

---

**Happy coding!** 🎉

For more detailed information, see the complete [README.md](./README.md)
