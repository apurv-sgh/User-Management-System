# User Management System - Frontend

## Overview

A modern React-based frontend for the User Management System with JWT authentication, role-based access control, and a beautiful UI.

## Features

- **Authentication**: Secure login and registration
- **Role-Based Access Control**: Different UI and access based on user roles (Admin, Manager, User)
- **User Management**: Create, read, update, and delete users
- **Profile Management**: Users can manage their own profiles
- **Token Management**: Automatic token refresh and expiration handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive, and visually appealing interface

## Tech Stack

- **React** 18.2.0
- **React Router** 6.14.2
- **Axios** 1.4.0
- **Vite** 4.3.0

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will open at `http://localhost:5173`

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with interceptors
│   │
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.css
│   │   │
│   │   └── users/                # User-related components
│   │       ├── UserTable.jsx
│   │       └── UserForm.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Users.jsx             # User list page
│   │   ├── UserDetail.jsx        # User detail page
│   │   └── Profile.jsx           # User profile page
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # Auth state management
│   │   └── UserContext.jsx       # User state management
│   │
│   ├── hooks/
│   │   └── useAuth.js            # Custom hook for auth
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx         # Route configuration
│   │   └── PrivateRoute.jsx      # Protected route component
│   │
│   ├── utils/
│   │   └── roleUtils.js          # Role and permission utilities
│   │
│   ├── styles/
│   │   └── global.css            # Global styles
│   │
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
│
├── public/
│   └── index.html
│
├── .env                          # Environment variables
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

## Authentication Flow

1. **Login**: User enters email and password
2. **Token Generation**: Backend generates access and refresh tokens
3. **Token Storage**: Tokens stored in localStorage
4. **Auto-Refresh**: When access token expires, refresh token is used to get a new one
5. **Logout**: Tokens are cleared from localStorage

## API Integration

### Request Interceptor
- Automatically attaches access token to all requests
- Adds `Authorization: Bearer {token}` header

### Response Interceptor
- Handles 401 errors by refreshing the access token
- Retries failed requests with new token
- Redirects to login if refresh fails

## Pages

### Login Page
- Email and password input
- Form validation
- Error handling
- Demo credentials display

### Dashboard
- Welcome message
- Statistics cards
- Quick action links
- Role-based feature display
- User permissions listing

### Users Page (Admin/Manager Only)
- User list with pagination
- Search and filter functionality
- Create new user button
- User detail links
- Delete user action

### User Detail Page
- View user information
- Edit user profile
- Audit information
- Role and status badge

### Profile Page
- View own profile
- Edit profile information
- Security options
- Change password link

## State Management

### AuthContext
- `user`: Current logged-in user
- `loading`: Loading state
- `error`: Error messages
- `register()`: Register new user
- `login()`: Login user
- `logout()`: Logout user
- `clearError()`: Clear error messages

### UserContext
- `users`: List of users
- `currentUser`: Currently viewed user
- `loading`: Loading state
- `error`: Error messages
- `pagination`: Pagination info
- `fetchUsers()`: Get all users
- `getUserById()`: Get specific user
- `createUser()`: Create new user
- `updateUser()`: Update user
- `deleteUser()`: Delete user
- `updateProfile()`: Update own profile

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Change this to your production API URL when deploying.

## Component Examples

### Using useAuth Hook

```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.name}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Route

```jsx
<Route
  path="/admin"
  element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

### Form with Validation

```jsx
import { Input } from '../components/common/Input';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

## Styling

Global styles are defined in `src/styles/global.css`. The system uses CSS custom properties (variables) for colors and spacing:

- `--primary-color`: #3b82f6
- `--danger-color`: #dc2626
- `--success-color`: #10b981
- `--warning-color`: #f59e0b

## Deployment

### Vercel

1. Push code to GitHub
2. Connect Vercel to GitHub
3. Set environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push code to GitHub
2. Connect Netlify to GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables in Netlify UI
6. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React Router
- Lazy loading of components
- Optimized CSS delivery
- Minified bundle in production

## Security

- JWT token stored in localStorage
- CORS configured
- Input validation on all forms
- XSS protection with React
- CSRF protection through API design

## Troubleshooting

### Token Expires Frequently
- Check JWT_EXPIRE value in backend
- Verify system time is synchronized

### CORS Errors
- Ensure CORS_ORIGIN in backend matches frontend URL
- Check browser console for specific errors

### Login Fails
- Verify backend is running
- Check API_BASE_URL is correct
- Verify credentials

## Future Enhancements

- Add email verification
- Implement password reset flow
- Add 2FA support
- Implement activity logging
- Add user avatar upload
- Implement real-time notifications
- Add dark mode
- Add advanced search filters

## Contributing

Please follow the existing code style and structure when contributing.

## License

ISC
