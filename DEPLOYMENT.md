# Deployment Guide

This guide provides step-by-step instructions for deploying the User Management System to various cloud platforms.

## Prerequisites

- Git repository with code pushed to GitHub/GitLab
- Cloud platform accounts (Render, Vercel, Railway, etc.)
- MongoDB Atlas account (or local MongoDB)

## Deployment Options

## Option 1: Render + Vercel (Recommended)

### Backend Deployment on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Deploy Backend**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: `user-management-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `cd backend && npm start`
     - **Root Directory**: `backend`

3. **Set Environment Variables**
   In Render dashboard, add to "Environment":
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-management-system
   JWT_SECRET=your-very-secure-jwt-secret-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
   JWT_EXPIRE_IN=1h
   JWT_REFRESH_EXPIRE_IN=7d
   BCRYPT_ROUNDS=10
   CORS_ORIGIN=https://your-vercel-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the provided URL (e.g., `https://user-management-backend.onrender.com`)

### Frontend Deployment on Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Deploy Frontend**
   - Click "New Project"
   - Select GitHub repository
   - Configure:
     - **Framework Preset**: React
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Set Environment Variables**
   In Vercel, add to "Environment Variables":
   ```
   REACT_APP_API_URL=https://user-management-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your frontend URL

### Update Backend CORS

After frontend deployment, update backend CORS:
1. In Render dashboard
2. Go to Environment
3. Update `CORS_ORIGIN` with Vercel frontend URL
4. Deployment will automatically restart

---

## Option 2: Railway + Netlify

### Backend on Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New"
   - Select "GitHub Repo"
   - Connect your repository

3. **Add MongoDB Plugin**
   - Click "Add"
   - Select "MongoDB"

4. **Configure Backend Service**
   - Set Root Directory: `backend`
   - Environment Variables:
     ```
     NODE_ENV=production
     MONGODB_URI=${{MONGO.DATABASE_URL}}
     JWT_SECRET=your-secret-key
     JWT_REFRESH_SECRET=your-refresh-secret
     BCRYPT_ROUNDS=10
     ```

5. **Deploy**
   - Railway auto-deploys on push
   - Get your backend URL from "Generate Domain"

### Frontend on Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Create New Site**
   - Click "Add new site"
   - Import existing project from Git
   - Select repository

3. **Configure Build**
   - Base Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `build`

4. **Set Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   ```
   REACT_APP_API_URL=https://your-railway-backend.railway.app/api
   ```

5. **Deploy**
   - Netlify auto-deploys on push

---

## Option 3: Docker Deployment

### Prerequisites
- Docker installed
- Docker Hub account

### Build and Push Docker Images

```bash
# Build backend image
docker build -t your-docker-username/user-management-backend:latest ./backend
docker push your-docker-username/user-management-backend:latest

# Build frontend image
docker build -t your-docker-username/user-management-frontend:latest ./frontend
docker push your-docker-username/user-management-frontend:latest
```

### Deploy on Docker Hub or Registry

```bash
docker pull your-docker-username/user-management-backend:latest
docker pull your-docker-username/user-management-frontend:latest

docker-compose up -d
```

### Deploy on Heroku Alternative (Render)

1. Go to Render
2. Create new Web Service
3. Select "Docker" as runtime
4. Connect repository
5. Render will use your Dockerfile
6. Deploy

---

## Option 4: Traditional VPS Deployment

### Prerequisites
- VPS with Ubuntu 20.04+
- Domain name
- SSH access

### Setup VPS

```bash
# SSH into VPS
ssh root@your_vps_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd User-Management-System

# Install backend dependencies
cd backend
npm install
pm2 start src/server.js --name "user-management-backend"

# Install frontend dependencies
cd ../frontend
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

### Nginx Configuration

```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Restart Nginx and PM2

```bash
sudo systemctl restart nginx
pm2 save
pm2 startup
```

---

## Environment Variables for Production

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/user-management-system
JWT_SECRET=<generate-secure-random-string-min-32-chars>
JWT_REFRESH_SECRET=<generate-another-secure-random-string>
JWT_EXPIRE_IN=1h
JWT_REFRESH_EXPIRE_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Generate Secure Secrets

```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Monitoring & Logging

### Backend Logs
```bash
pm2 logs user-management-backend
pm2 monit
```

### Monitor with PM2
```bash
pm2 web  # Opens dashboard at http://localhost:9615
```

### Cloud Platform Monitoring
- Render: Dashboard → Logs
- Vercel: Analytics → Performance
- Railway: Logs tab
- Netlify: Analytics → Functions

## Health Checks

```bash
# Backend
curl https://your-backend.com/api/health

# Frontend
curl https://your-frontend.com

# Check API
curl -X GET https://your-backend.com/api/users \
  -H "Authorization: Bearer <token>"
```

## Database Backups

### MongoDB Atlas
- Automatic backups every 12 hours
- Manual backups available
- Point-in-time recovery

### Local MongoDB
```bash
# Backup
mongodump --uri "mongodb://localhost:27017" -o backup

# Restore
mongorestore --uri "mongodb://localhost:27017" backup
```

## Scaling Considerations

1. **Database**: Use MongoDB Atlas with connection pooling
2. **Backend**: Use load balancing (Render, Railway provide this)
3. **Frontend**: CDN (Vercel, Netlify provide this)
4. **Caching**: Implement Redis for sessions
5. **Database Indexes**: Already configured in schema

## Troubleshooting Deployments

### Backend won't start
- Check logs: `pm2 logs` or cloud platform logs
- Verify environment variables
- Check MongoDB connection
- Ensure all npm packages installed

### Frontend won't load
- Check build output
- Verify API_URL is correct
- Check browser console for errors
- Verify CORS settings

### API calls fail
- Check network tab in browser
- Verify backend is running
- Check CORS_ORIGIN setting
- Verify JWT tokens

### Database connection fails
- Check MongoDB URI
- Verify IP whitelist (MongoDB Atlas)
- Check username/password
- Ensure database exists

## Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable database authentication
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Set up error tracking (Sentry)

## Post-Deployment

1. Test all features
2. Run load testing
3. Set up monitoring
4. Configure backups
5. Set up error tracking
6. Document deployment process
7. Create runbooks for common issues
8. Schedule regular maintenance

---

For detailed platform-specific documentation, visit:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
