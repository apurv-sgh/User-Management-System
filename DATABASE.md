# Database Initialization

This guide provides instructions for setting up the MongoDB database with initial data.

## Automated Setup (Recommended)

### Using Docker Compose
```bash
docker-compose up
```

The database will be automatically initialized with MongoDB running in a container.

## Manual Setup

### 1. Local MongoDB Setup

#### Windows
```bash
# Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Add MongoDB to PATH, then start:
mongod
```

#### Mac (Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
curl -fsSL https://www.mongodb.com/docs/manual/includes/steps-install-mongodb-on-ubuntu.sh | bash
sudo systemctl start mongod
```

### 2. Create Database and Collections

```bash
# Connect to MongoDB
mongosh

# Use the database
use user-management-system

# Create collections
db.createCollection("users")

# Create indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "status": 1 })
db.users.createIndex({ "createdAt": -1 })
```

### 3. Insert Initial Data (Optional)

```bash
# Insert demo users (passwords need to be hashed properly)
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hashed "password123"
  role: "Admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note**: In production, always hash passwords using bcrypt. Never store plain text passwords.

## MongoDB URI Examples

### Local Development
```
mongodb://localhost:27017/user-management-system
```

### Docker Compose
```
mongodb://admin:password@mongo:27017/user-management-system?authSource=admin
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/user-management-system
```

## Backup & Restore

### Backup Database
```bash
mongodump --db user-management-system --out ./backup
```

### Restore Database
```bash
mongorestore --db user-management-system ./backup/user-management-system
```

## Verification

```bash
# Connect to MongoDB
mongosh

# Check database exists
show dbs

# Use database
use user-management-system

# Check collections
show collections

# Count users
db.users.countDocuments()

# View all users
db.users.find().pretty()
```

## Troubleshooting

### MongoDB won't start
- Check if port 27017 is already in use
- Ensure MongoDB is properly installed
- Check MongoDB logs for errors

### Connection refused
- Verify MongoDB is running
- Check MONGODB_URI in .env
- Ensure correct host and port

### Authentication failed
- Check username and password
- Verify authSource parameter
- For Atlas, check IP whitelist

## Production Considerations

1. Use MongoDB Atlas or managed MongoDB service
2. Enable authentication with strong passwords
3. Enable encryption in transit (TLS)
4. Regular backups
5. Monitor database performance
6. Set appropriate indexes
7. Use connection pooling
8. Implement data retention policies

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
