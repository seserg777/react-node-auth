# React Node Auth

Full-featured authentication application using React, Node.js, MySQL and JWT tokens.

## Project Structure

```
react-node-auth/
├── apps/
│   ├── backend/          # Node.js API server
│   └── frontend/         # React application
├── packages/             # Shared packages (if needed)
├── package.json          # Root package.json for turborepo
└── turbo.json           # Turborepo configuration
```

## Technologies

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** tokens (30 minutes lifetime)
- **bcryptjs** for password hashing
- **express-validator** for validation

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **Bootstrap 5** for UI
- **Axios** for HTTP requests
- **Redux Toolkit** for state management

## Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- MySQL server
- npm or yarn

### 1. Install Dependencies

```bash
# Install dependencies for the entire project
npm install

# Or install for each application separately
cd apps/backend && npm install
cd ../frontend && npm install
```

### 2. Database Setup

Create MySQL database:
```sql
CREATE DATABASE reactnode;
```

Configure connection in `apps/backend/config.js`:
```javascript
database: {
  host: 'mysql-5.7.local',  // your MySQL host
  user: 'root',             // your user
  password: '',             // your password
  database: 'reactnode'     // database name
}
```

### 3. Running Applications

#### Running via turborepo (recommended):
```bash
# Run all applications in development mode
npm run dev

# Build all applications
npm run build
```

#### Running applications separately:

**Backend (port 3001):**
```bash
cd apps/backend
npm run dev
```

**Frontend (port 3000):**
```bash
cd apps/frontend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/profile` - Delete user profile
- `GET /api/health` - Server health check

### Request Examples

**Registration:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!","name":"John Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

**Update Profile:**
```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

**Delete Profile:**
```bash
curl -X DELETE http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Health Check:**
```bash
curl -X GET http://localhost:3001/api/health
```

## Features

### Frontend Pages:
1. **Home Page** (`/`) - Hello World with authentication status information
2. **Login Page** (`/login`) - Login form
3. **Register Page** (`/register`) - Registration form for new account
4. **Profile Page** (`/profile`) - Edit user profile (name and email)

### Security:
- Passwords hashed with bcryptjs
- Strong password requirements (uppercase, lowercase, numbers, special characters)
- JWT tokens with 30 minutes expiration
- Server-side input validation
- Protected routes with token verification

### UI/UX:
- Responsive design with Bootstrap 5
- Dynamic navigation bar with user name display
- Error and success notifications
- Automatic redirect after authentication
- Profile editing functionality
- Profile deletion with confirmation modal

## Database Structure

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

Create `.env` file in `apps/backend/` folder:
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=mysql-5.7.local
DB_USER=root
DB_PASSWORD=
DB_NAME=reactnode
```

## Development

### Useful Commands:
```bash
# Code linting
npm run lint

# Clean build
npm run clean

# Run only backend
cd apps/backend && npm run dev

# Run only frontend
cd apps/frontend && npm start
```

## License

MIT
