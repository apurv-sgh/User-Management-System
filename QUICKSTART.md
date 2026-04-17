# MERN User Management System - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
# Backend runs on http://localhost:5000
```

### Frontend Setup (new terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm start
# Frontend runs on http://localhost:3000
```

### Test the Application

Login with:
- **Email**: admin@example.com
- **Password**: password123

## 📁 Project Structure

```
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, error handling
│   │   └── services/     # Business logic
│   └── package.json
├── frontend/             # React app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # State management
│   │   └── services/     # API calls
│   └── package.json
└── README.md             # Full documentation
```

## 🔑 Key Features

✅ JWT Authentication  
✅ Role-Based Access Control (Admin, Manager, User)  
✅ User Management CRUD  
✅ Secure Password Hashing  
✅ Protected Routes  
✅ Audit Trail (createdBy, updatedBy)  
✅ Responsive Design  

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [DATABASE.md](./DATABASE.md) - Database setup
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing guidelines

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change port in backend/.env
# PORT=5001
```

**MongoDB connection failed?**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**CORS errors?**
- Update CORS_ORIGIN in backend/.env
- Match with frontend URL

## 🚀 Next Steps

1. [Deploy to Render + Vercel](./DEPLOYMENT.md)
2. [Setup MongoDB Atlas](./DATABASE.md)
3. [Run with Docker](./docker-compose.yml)
4. [Read API Documentation](./README.md#-api-documentation)

## 💡 Tips

- Use `.env.example` files as templates
- Check logs for errors: `npm start`
- Open browser console (F12) for frontend errors
- Test API with Postman or REST Client

---

For complete documentation, see [README.md](./README.md)
