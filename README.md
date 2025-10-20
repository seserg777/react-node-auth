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
- **MySQL** database with **Sequelize ORM**
- **JWT** tokens (30 minutes lifetime)
- **bcryptjs** for password hashing
- **express-validator** for validation and sanitization
- **Helmet** for security headers
- **Rate limiting** for DDoS protection
- **Jest** and **Supertest** for automated testing
- **Module aliases** for clean imports

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **Bootstrap 5** for UI
- **Axios** for HTTP requests
- **Redux Toolkit** for state management
- Custom hooks (`useAuth`) for reusable logic

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

Configure connection in `apps/backend/.env`:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=mysql-5.7.local
DB_USER=root
DB_PASSWORD=
DB_NAME=reactnode
```

### 3. Running Applications

#### Quick Start (Development)
```bash
# Run all applications in development mode
npm run dev
```
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

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
- **Password Security**: Hashed with bcryptjs, strong password requirements (uppercase, lowercase, numbers, special characters, min 6 chars)
- **JWT Authentication**: Tokens with 30 minutes expiration
- **Input Validation & Sanitization**: Server-side validation with express-validator, XSS protection
- **Rate Limiting**: Scoped rate limiters (100 req/15min general, 5 req/15min for auth endpoints)
- **Security Headers**: Helmet middleware with Content Security Policy (CSP)
- **NoSQL Injection Protection**: express-mongo-sanitize
- **Centralized Error Handling**: Custom error handler middleware
- **Protected Routes**: Token verification middleware

### UI/UX:
- Responsive design with Bootstrap 5
- Dynamic navigation bar with user name display
- System messages stored in Redux state
- Automatic redirect after authentication
- Email validation (client-side and server-side)
- Profile editing functionality
- Profile deletion with confirmation modal
- Custom favicon and footer
- Protected routes with login redirect

## Database Structure

The application uses **Sequelize ORM** for database management. Tables are automatically created and synchronized on application startup.

### User Model
```javascript
// Sequelize model definition
{
  id: INTEGER (Primary Key, Auto Increment),
  email: STRING(255) (Unique, Not Null, Email Validation),
  password: STRING(255) (Not Null, Hashed with bcryptjs),
  name: STRING(255) (Optional, Length: 2-255),
  created_at: TIMESTAMP (Auto-generated),
  updated_at: TIMESTAMP (Auto-generated)
}
```

### Manual SQL (if needed)
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

## Production Build and Deployment

### Building the Application

#### Option 1: Build All Applications (Recommended)
```bash
# Build both frontend and backend
npm run build
```

#### Option 2: Build Applications Separately
```bash
# Build frontend only
cd apps/frontend
npm run build

# Build backend only (if needed)
cd apps/backend
npm run build
```

### Running Production Build

#### Windows (PowerShell/CMD)
```powershell
# Start backend server
cd apps/backend
node src/index.js

# In another terminal, serve frontend build
cd apps/frontend/build
# Using Python (if installed)
python -m http.server 8080
# Or using Node.js serve package
npx serve -s . -l 8080
```

#### macOS/Linux (Terminal)
```bash
# Start backend server
cd apps/backend
node src/index.js

# In another terminal, serve frontend build
cd apps/frontend/build
# Using Python
python3 -m http.server 8080
# Or using Node.js serve package
npx serve -s . -l 8080
```

#### Using PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd apps/backend
pm2 start src/index.js --name "react-node-auth-backend"

# Start frontend with PM2 (if using serve)
cd apps/frontend/build
pm2 start "npx serve -s . -l 8080" --name "react-node-auth-frontend"

# View running processes
pm2 list

# Stop processes
pm2 stop react-node-auth-backend
pm2 stop react-node-auth-frontend
```

#### Using Docker (Optional)
```bash
# Build Docker image for backend
cd apps/backend
docker build -t react-node-auth-backend .

# Run backend container
docker run -p 3001:3001 --env-file .env react-node-auth-backend

# For frontend, use nginx or serve the build folder
cd apps/frontend/build
docker run -p 8080:80 -v $(pwd):/usr/share/nginx/html nginx:alpine
```

### Web Server Configuration

#### Apache
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/react-node-auth/apps/frontend/build
    
    <Directory /path/to/react-node-auth/apps/frontend/build>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Proxy API requests to backend
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:3001/api/
    ProxyPassReverse /api/ http://localhost:3001/api/
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/react-node-auth/apps/frontend/build;
    index index.html;
    
    # Serve React app
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
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

## Testing

### Backend Testing with Jest

The project includes comprehensive test coverage for the backend:

```bash
# Run all tests
cd apps/backend
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Suites:
- **Authentication API Tests** (`auth.test.js`): Registration, login, profile management
- **Health Check Tests** (`health.test.js`): Server status endpoint
- **Middleware Tests** (`middleware.test.js`): Error handling, async wrapper
- **Simple Tests** (`simple.test.js`): Basic functionality

### Git Hooks (Husky)

The project uses **Husky** for automated quality checks:

#### Pre-commit Hook
- Runs all backend tests before allowing commit
- Blocks commit if any tests fail
- Ensures code quality

#### Commit Message Hook
- Validates commit message format
- Requires non-empty message with minimum length

```bash
# Pre-commit hook automatically runs:
cd apps/backend && npm test

# If tests fail, commit is blocked
# Fix failing tests before committing
```

### Code Quality Tools:
- **Jest**: Unit and integration testing
- **Supertest**: HTTP endpoint testing
- **Husky**: Git hooks automation
- **ESLint**: Code linting (optional)

## Architecture

### Backend Structure:
```
apps/backend/src/
├── config/           # Database and app configuration
├── controllers/      # Business logic (AuthController, HealthController)
├── middleware/       # Auth, error handling
├── models/           # Sequelize models (User)
├── routes/           # API routes
├── tests/            # Jest test suites
├── utils/            # Helpers (asyncHandler)
└── index.js          # Main server file
```

### Module Aliases:
The backend uses path aliases for clean imports:
- `@config` → `apps/backend/src/config`
- `@controllers` → `apps/backend/src/controllers`
- `@routes` → `apps/backend/src/routes`
- `@models` → `apps/backend/src/models`
- `@middleware` → `apps/backend/src/middleware`
- `@utils` → `apps/backend/src/utils`

Example:
```javascript
// Instead of: require('../../../config/database')
const { sequelize } = require('@config/database');
```

## Troubleshooting

### Common Issues:

1. **"Too many keys specified" error**
   - Sequelize duplicate indexes issue
   - Solution: Check `SHOW INDEX FROM users;` and remove duplicates

2. **Port already in use (EADDRINUSE)**
   - Kill process using the port:
     ```bash
     # Windows
     netstat -ano | findstr :3001
     taskkill /PID <PID> /F
     
     # macOS/Linux
     lsof -i :3001
     kill -9 <PID>
     ```

3. **Module not found errors**
   - Ensure `module-alias` is registered in `index.js`
   - Check `_moduleAliases` in `package.json`

4. **Tests failing**
   - Check database connection
   - Ensure mocks are properly configured
   - Run `npm install` in `apps/backend`

## License

MIT

## Credits

Created by **Serhii Soloviov**
