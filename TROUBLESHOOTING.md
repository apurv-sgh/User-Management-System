# 🔧 Troubleshooting Guide

Comprehensive solutions for common issues with the User Management System.

## Backend Issues

### 1. MongoDB Connection Failed

**Error Message:**
```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Causes & Solutions:**

**MongoDB not running:**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
# Windows: mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Wrong connection string:**
```bash
# Verify MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/user-management-system

# For MongoDB Atlas, use:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

**Firewall blocking:**
```bash
# Windows: Add MongoDB to firewall
# Mac: Allow mongod in System Preferences > Security & Privacy
```

---

### 2. Port Already in Use

**Error Message:**
```
EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Change port in .env:**
```env
PORT=5001
```

**Find and kill process using port (Windows):**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID 1234 /F
```

**Find and kill process using port (Mac/Linux):**
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

### 3. JWT Token Invalid

**Error Message:**
```
JsonWebTokenError: invalid signature
InvalidTokenError: jwt expired
```

**Causes & Solutions:**

**JWT_SECRET changed:**
```bash
# Ensure JWT_SECRET in .env matches what tokens were signed with
# All previous tokens will become invalid if secret changes
JWT_SECRET=your-super-secret-key-min-32-chars
```

**Token expired:**
```bash
# Check JWT_EXPIRE_IN
JWT_EXPIRE_IN=1h

# Tokens last 1 hour by default
# Request new token using refresh token
```

**Missing or malformed token:**
```bash
# Token in Authorization header must be:
Authorization: Bearer {token}

# NOT:
Authorization: {token}
Authorization: Token {token}
```

---

### 4. Password Hashing Issues

**Error Message:**
```
Error: rounds should be between 4 and 31
```

**Solution:**

```env
# Set BCRYPT_ROUNDS between 4 and 31
# Recommended: 10 (balance between security and speed)
BCRYPT_ROUNDS=10
```

---

### 5. CORS Error

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

**Solution:**

**Update CORS_ORIGIN in backend .env:**
```env
# For local development
CORS_ORIGIN=http://localhost:3000

# For production
CORS_ORIGIN=https://yourdomain.com

# Allow multiple origins (requires code change)
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

**Restart backend after changing .env**

---

### 6. Database Validation Errors

**Error Message:**
```
ValidationError: User validation failed: email: path `email` is required
```

**Solutions:**

**Missing required fields:**
```bash
# Ensure request includes:
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Invalid email format:**
```bash
# Email must be valid format
# ✓ user@example.com
# ✗ userexample.com
# ✗ user@.com
```

**Duplicate email:**
```bash
# Email must be unique in database
# Use different email for new users
# Check existing users: db.users.find({email: "..."})
```

---

### 7. Middleware Errors

**Error Message:**
```
ReferenceError: req.user is undefined
```

**Solution:**

**Check route has authenticate middleware:**
```javascript
// ✓ Correct
router.get('/users', authenticate, userController.getAllUsers);

// ✗ Wrong
router.get('/users', userController.getAllUsers);
```

---

### 8. Duplicate Key Error

**Error Message:**
```
MongoError: E11000 duplicate key error
```

**Solution:**

**Email already exists:**
```bash
# Check if email exists
db.users.findOne({email: "existing@example.com"})

# Delete duplicate if needed
db.users.deleteOne({email: "duplicate@example.com"})

# Drop index and recreate
db.users.collection.dropIndex("email_1")
```

---

### 9. Seed Script Issues

**Error Message:**
```
npm ERR! code ENOENT
npm ERR! enoent ENOENT: no such file or directory
```

**Solution:**

**Script path incorrect:**
```bash
# Verify seed.js exists
ls backend/scripts/seed.js

# Run from correct directory
cd backend
npm run seed

# Check package.json has script
"seed": "node scripts/seed.js"
```

**Database not connected:**
```bash
# Ensure MongoDB is running
# Set MONGODB_URI in .env
# Check connection before seeding
```

---

## Frontend Issues

### 1. Blank Page or White Screen

**Causes & Solutions:**

**React not mounting:**
```bash
# Check browser console (F12)
# Look for JavaScript errors
# Verify index.html exists
# Restart dev server: npm start
```

**Missing dependencies:**
```bash
# Reinstall packages
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
npm install
```

**API URL incorrect:**
```env
# Check .env file
REACT_APP_API_URL=http://localhost:5000/api

# Restart frontend after changing .env
```

---

### 2. Login Always Fails

**Error Message:**
```
Invalid email or password
```

**Solutions:**

**User doesn't exist:**
```bash
# Seed database with demo users
cd backend
npm run seed

# Check MongoDB
db.users.find().pretty()
```

**Wrong password:**
```bash
# Demo credentials:
# admin@example.com / password123
# manager@example.com / password123
# user@example.com / password123

# Password is case-sensitive
```

**API not responding:**
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check terminal output for errors
# Verify CORS_ORIGIN allows localhost:3000
```

---

### 3. Token Not Persisting

**Issue:** Logged out after page refresh

**Solutions:**

**localStorage blocked:**
```bash
# Check browser privacy settings
# Allow localStorage for localhost
# Disable privacy mode
```

**localStorage cleared:**
```bash
# Check if something is clearing storage
# Browser extensions might clear storage
# Private/Incognito mode doesn't persist
```

**Token expired:**
```bash
# Default token expiry is 1 hour
# Check browser console for error
# Automatic refresh should get new token
```

---

### 4. CORS Error in Frontend

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

**Backend CORS_ORIGIN wrong:**
```bash
# Backend .env must have:
CORS_ORIGIN=http://localhost:3000

# Restart backend
npm run dev
```

**Frontend API URL wrong:**
```bash
# Frontend .env must have:
REACT_APP_API_URL=http://localhost:5000/api

# Check no trailing slash
# REACT_APP_API_URL=http://localhost:5000/api ✓
# REACT_APP_API_URL=http://localhost:5000/api/ ✗
```

**Browser cache:**
```bash
# Clear browser cache
# Or use incognito mode
```

---

### 5. Forms Won't Submit

**Issue:** Form submission does nothing

**Solutions:**

**Network request failing:**
```bash
# Check Network tab (F12 > Network)
# Look for failed requests
# Check browser console for errors
```

**API endpoint wrong:**
```bash
# Verify API URL in .env
REACT_APP_API_URL=http://localhost:5000/api

# Verify endpoint exists in backend
# POST /api/auth/register
# POST /api/auth/login
```

**Form validation preventing submission:**
```bash
# Check browser console for validation errors
# Verify required fields filled:
# Name (2-100 chars)
# Email (valid format)
# Password (min 8 chars)
# Passwords must match
```

---

### 6. Authorization Errors

**Error Message:**
```
You don't have permission to access this resource
```

**Solutions:**

**Wrong user role:**
```bash
# Admin only features:
# - Create users
# - Delete users
# - View all user stats

# Manager can:
# - View users
# - Edit non-admin users

# Users can:
# - View own profile
# - Edit own profile
```

**Login with correct user:**
```bash
# Logout first
# Login with admin user
# admin@example.com / password123
```

---

### 7. Components Not Rendering

**Issue:** UI elements missing

**Solutions:**

**CSS Modules not loaded:**
```bash
# Check Network tab (F12)
# Verify .css files loading
# Clear browser cache

# Restart dev server
npm start
```

**Component not imported:**
```bash
# Check import statement in App.js
import DashboardPage from './pages/DashboardPage';

# Path must be correct
# Case-sensitive on Linux/Mac
```

**Conditional rendering issue:**
```bash
# Check authentication context
# Verify user role in DevTools
# Component might be hidden by permission check
```

---

### 8. Navigation Not Working

**Issue:** Links don't work or redirect fails

**Solutions:**

**Router not set up:**
```bash
# Check App.js has routes
# Verify React Router imported
# Check BrowserRouter wrapping app
```

**Wrong route path:**
```bash
# Route path: /users
# Navigate to: /users (not /user)
# Case-sensitive

# useNavigate vs useHistory
# React Router v6 uses useNavigate
```

**Protected route not working:**
```bash
# Check ProtectedRoute component
# Verify user is authenticated
# Check localStorage has tokens
```

---

## Database Issues

### 1. Collections Not Found

**Error Message:**
```
ns does not exist
```

**Solution:**

**Collections need to be created:**
```bash
# Connect to MongoDB
mongosh

# Use database
use user-management-system

# Create users collection
db.createCollection('users')

# Or let Mongoose create automatically
# Just save first document
```

---

### 2. Indexes Not Working

**Issue:** Queries slow even with indexes

**Solution:**

**Recreate indexes:**
```bash
# Connect to MongoDB
mongosh
use user-management-system

# Drop old indexes
db.users.dropIndex('email_1')
db.users.dropIndex('role_1')

# Create new indexes
db.users.createIndex({email: 1}, {unique: true})
db.users.createIndex({role: 1})
db.users.createIndex({status: 1})
db.users.createIndex({createdAt: 1})
```

---

### 3. Data Not Persisting

**Issue:** Data saved but disappears

**Solution:**

**Check connection string:**
```env
# Must be correct MongoDB URI
MONGODB_URI=mongodb://localhost:27017/user-management-system

# For Docker:
MONGODB_URI=mongodb://mongo:27017/user-management-system
```

**Verify database write:**
```bash
# Check MongoDB directly
mongosh
db.users.countDocuments()
db.users.find().pretty()
```

---

### 4. Cannot Connect to MongoDB Atlas

**Error Message:**
```
MongoNetworkError: Authentication failed
```

**Solutions:**

**Wrong credentials:**
```bash
# Verify username and password in URI
# Check for special characters (encode if needed)
# @ symbol in password: encode as %40

# mongodb+srv://username:password@cluster.mongodb.net
```

**IP whitelist:**
```bash
# MongoDB Atlas requires IP whitelist
# Add your IP: https://www.whatismyipaddress.com/
# Or allow all: 0.0.0.0/0 (development only)
```

**Wrong database name:**
```bash
# Database name in URI
# mongodb+srv://user:pass@cluster.mongodb.net/db-name

# Must match database you created
```

---

## Docker Issues

### 1. Containers Won't Start

**Error Message:**
```
docker: command not found
```

**Solution:**

**Install Docker:**
```bash
# Windows: https://www.docker.com/products/docker-desktop
# Mac: https://www.docker.com/products/docker-desktop
# Linux: sudo apt-get install docker.io
```

---

### 2. Port Already in Use

**Error Message:**
```
Bind for 0.0.0.0:5000 failed
```

**Solution:**

**Use different port:**
```bash
# Edit docker-compose.yml
ports:
  - "5001:5000"  # Map host:container
```

**Or kill container using port:**
```bash
docker ps
docker kill <container-id>
```

---

### 3. Database Connection in Docker

**Error Message:**
```
Cannot connect to MongoDB
```

**Solution:**

**Use correct hostname:**
```bash
# In Docker network, use service name
# NOT localhost:27017
# Use: mongo:27017

# MONGODB_URI=mongodb://mongo:27017/user-management-system
```

---

### 4. Volumes Not Persisting

**Issue:** Data lost after container stops

**Solution:**

**Check docker-compose.yml:**
```yaml
services:
  mongo:
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

**Verify volume created:**
```bash
docker volume ls
docker volume inspect <volume-name>
```

---

## Development Environment

### 1. npm Install Issues

**Error Message:**
```
npm ERR! code ERESOLVE
```

**Solution:**

**Use legacy peer deps:**
```bash
npm install --legacy-peer-deps
```

**Or use npm 8+:**
```bash
npm install -g npm@latest
npm install
```

---

### 2. Node Version Issues

**Error Message:**
```
Node version does not support feature X
```

**Solution:**

**Check Node version:**
```bash
node --version

# Should be 14+
# Recommended: 16 or 18
```

**Update Node:**
```bash
# Windows/Mac: https://nodejs.org/
# Linux: 
sudo apt-get install nodejs
```

---

### 3. env File Not Loading

**Issue:** Environment variables undefined

**Solution:**

**Create .env file:**
```bash
# Copy template
cp .env.example .env

# Edit .env with values
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

**Restart server after .env change:**
```bash
npm run dev
```

**Check .env is in right directory:**
```bash
# Backend .env
backend/.env

# Frontend .env
frontend/.env
```

---

### 4. Hot Reload Not Working

**Issue:** Changes not reflected

**Solution:**

**Restart dev server:**
```bash
# Stop: Ctrl+C
# Start: npm start
```

**Check file saved:**
```bash
# Ensure file actually saved
# Look for dot after filename in editor
```

**Clear cache:**
```bash
rm -rf node_modules/.cache
npm start
```

---

## Performance Issues

### 1. Slow API Responses

**Solutions:**

**Add database indexes:**
```bash
db.users.createIndex({email: 1})
db.users.createIndex({role: 1})
db.users.createIndex({status: 1})
```

**Check query performance:**
```bash
# Use explain()
db.users.find({role: 'Admin'}).explain('executionStats')
```

**Optimize queries:**
```bash
# Use lean() for read-only
db.users.find().lean()

# Limit fields
db.users.find({}, {password: 0})
```

---

### 2. Frontend Loading Slow

**Solutions:**

**Check network waterfall:**
```bash
# F12 > Network tab
# Identify slow requests
```

**Enable gzip compression:**
```bash
# In backend Express app
app.use(compression())
```

**Optimize images:**
```bash
# Compress images
# Use modern formats (WebP)
```

---

## Security Issues

### 1. Password Stored in Plain Text

**Issue:** Passwords visible in database

**Solution:**

**Verify pre-save hook:**
```javascript
// User model pre-save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
```

---

### 2. Tokens Exposed in Logs

**Issue:** JWT tokens visible in console

**Solution:**

**Never log sensitive data:**
```javascript
// ✗ Don't do this
console.log(token)
console.log(user)

// ✓ Do this
console.log('User authenticated')
console.log('Token generated')
```

---

### 3. SQL/Injection Attacks

**Issue:** Potential security vulnerability

**Solution:**

**Mongoose validates automatically:**
```javascript
// Mongoose prevents injection
User.find({email: userInput})

// Even if userInput contains malicious code
// Mongoose treats it as data, not code
```

---

## Getting Help

### Check Logs

```bash
# Backend logs
# Terminal output from npm run dev

# Frontend logs
# F12 > Console tab

# Docker logs
docker-compose logs -f

# Database logs
# MongoDB logs location varies by OS
```

### Common Log Messages

**"User not found"**
- Email doesn't exist in database
- Check spelling
- Run seed script

**"Invalid email or password"**
- Wrong credentials
- User doesn't exist
- Check case-sensitivity

**"Token expired"**
- Access token is old
- Use refresh token to get new one
- System will do this automatically

**"Cannot POST /api/users"**
- Endpoint doesn't exist
- Check backend routes
- Verify method is POST not GET

---

## Quick Fixes Checklist

- [ ] MongoDB running
- [ ] Ports available (3000, 5000, 27017)
- [ ] .env files exist with correct values
- [ ] Dependencies installed (npm install)
- [ ] Seed script ran (npm run seed)
- [ ] Backend started (npm run dev)
- [ ] Frontend started (npm start)
- [ ] Using correct demo credentials
- [ ] Browser cache cleared
- [ ] CORS_ORIGIN set correctly

---

**Still Having Issues?**

1. Check the documentation
2. Review error message carefully
3. Check browser console (F12)
4. Check backend logs
5. Try the steps above
6. Clear everything and start fresh

**Good luck!** 🚀
