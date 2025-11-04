# React Node Auth

Full-featured authentication and e-commerce application with **Next.js 15**, React, Node.js, MySQL, and JWT tokens. Includes product catalog with 100 sample products, shopping cart, pagination, and server-side sorting. Built with TypeScript, Redux Toolkit, Turborepo, and modern best practices.

## Project Structure

```
react-node-auth/
├── apps/
│   ├── backend/          # Node.js API server
│   ├── frontend/         # React application (original)
│   └── frontend-next/    # Next.js 14+ application (App Router)
├── packages/             # Shared packages (if needed)
├── package.json          # Root package.json for turborepo
└── turbo.json           # Turborepo configuration
```

## Frontend Options

The project includes **two frontend implementations** that you can run independently:

1. **`apps/frontend`** - Original React (Create React App)
   - Traditional SPA with React Router
   - Client-side rendering only
   - Run with: `npm run dev:react`

2. **`apps/frontend-next`** - Next.js 15 (✅ Recommended)
   - App Router with Server Components
   - TypeScript for type safety
   - Redux Toolkit for state management
   - Shopping cart with persistence
   - Product catalog with pagination
   - Server-side sorting
   - Better SEO and performance
   - Modern architecture
   - Run with: `npm run dev:next`

**Note:** Both frontends cannot run simultaneously on port 3000. Use Turborepo commands to select which one to run.

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

### Frontend (React - Original)
- **React 18** with hooks
- **React Router** for navigation
- **Bootstrap 5** for UI
- **Axios** for HTTP requests
- **Redux Toolkit** for state management
- Custom hooks (`useAuth`) for reusable logic

### Frontend (Next.js - Recommended)
- **Next.js 15** with App Router (upgraded from 14.2.33)
- **TypeScript** for type safety
- **Server Components** and Client Components
- **Bootstrap 5** for responsive UI and **Bootstrap Icons**
- **Axios** for HTTP requests
- **Redux Toolkit** with SSR support and localStorage persistence
- **BrowserSync** for live reloading (optional)
- **Jest** and **React Testing Library** (94 tests, 8 test suites)
- Custom hooks: `useAuth`, `useProductSort`
- Path aliases (`@/*`) for clean imports
- **Reusable components**: ProductCard, MiniCart, Pagination, ProductSort, Alert (Error/Success/Warning/Info), Navbar, Footer
- URL-based pagination with SEO-friendly links
- Server-side sorting for optimal performance

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

**Run Backend + Next.js (Recommended):**
```bash
npm run dev:next
```

**Run Backend + React:**
```bash
npm run dev:react
```

**Run All (Backend + Both Frontends):**
```bash
npm run dev
```

- **Frontend**: http://localhost:3000 (⚠️ use HTTP, not HTTPS in development)
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **BrowserSync**: http://localhost:3002 (optional, when using `dev:sync`)

#### Available Turborepo Commands

| Command | Description |
|---------|-------------|
| `npm run dev:next` | ✅ Run Backend + Next.js Frontend (Recommended) |
| `npm run dev:react` | Run Backend + React Frontend |
| `npm run dev` | Run Backend + Both Frontends |
| `npm run build:next` | Build Backend + Next.js for production |
| `npm run build:react` | Build Backend + React for production |
| `npm run build` | Build All Applications |
| `npm test` | Run Backend Tests (Jest + Supertest) |

#### Option 1: Using Turborepo (Recommended)

**Run Backend + React Frontend:**
```bash
npm run dev:react
```

**Run Backend + Next.js Frontend:**
```bash
npm run dev:next
```

**Run All (Backend + Both Frontends):**
```bash
npm run dev
```

#### Option 2: Running applications separately

**Backend (port 3001):**
```bash
cd apps/backend
npm run dev

# Generate 100 sample products (run once, optional)
npm run seed:products
```

**Frontend - React (port 3000):**
```bash
cd apps/frontend
npm start
```

**Frontend - Next.js (port 3000):**
```bash
cd apps/frontend-next
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/profile` - Delete user profile

### Products
- `GET /api/products` - Get all products with pagination, filters, and sorting
  - Query params: `page`, `limit`, `category`, `inStock`, `minPrice`, `maxPrice`, `search`, `sortBy`
  - Sort options: `price-asc`, `price-desc`, `name-asc`, `name-desc`, `default`
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/categories` - Get all product categories

### Health
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

**Get Products:**
```bash
# Get all products (first page)
curl -X GET http://localhost:3001/api/products

# Get products with pagination
curl -X GET "http://localhost:3001/api/products?page=2&limit=12"

# Filter by category
curl -X GET "http://localhost:3001/api/products?category=Electronics"

# Search products
curl -X GET "http://localhost:3001/api/products?search=laptop"

# Filter by price range
curl -X GET "http://localhost:3001/api/products?minPrice=50&maxPrice=500"

# Sort products (server-side)
curl -X GET "http://localhost:3001/api/products?sortBy=price-asc"
curl -X GET "http://localhost:3001/api/products?sortBy=name-desc"

# Combined: pagination + sorting
curl -X GET "http://localhost:3001/api/products?page=3&sortBy=price-asc"
```

**Get Product by ID:**
```bash
curl -X GET http://localhost:3001/api/products/1
```

**Get Categories:**
```bash
curl -X GET http://localhost:3001/api/products/categories
```

## Features

### Frontend Pages (React & Next.js):
1. **Home Page** (`/`) - Welcome page with authentication status
2. **Login Page** (`/login`) - Login form with email validation
3. **Register Page** (`/register`) - Registration with strong password requirements
4. **Profile Page** (`/profile`) - Edit user profile (name, email), delete account
5. **Product List** (`/productlist`) - Product catalog with 100 items from database
   - URL navigation: `/productlist?page=N`
   - Server-side pagination (12 products per page)
   - Server-side sorting (5 options)
   - Responsive grid layout

### E-commerce Features (Next.js):
- 🛒 **Shopping Cart** - Mini cart with icon and item counter in navbar
- 📦 **Product Catalog** - 100 products in 8 categories from MySQL database
- 📄 **Pagination** - Navigate through 9 pages (12 products each)
  - SEO-friendly `<Link>` components
  - URL-based navigation (`?page=N`)
  - Ellipsis for large page counts
  - First/Last page quick access
- 🔀 **Sorting** - 5 server-side sort options:
  - Default (newest first)
  - Name (A-Z / Z-A)
  - Price (Low to High / High to Low)
  - Works across all 100 products
  - State persists during session
- ➕ **Add to Cart** - One-click add products from catalog
- 🔢 **Quantity Management** - Increase/decrease in cart modal
- 🗑️ **Remove Items** - Delete individual items or clear cart
- 💾 **Cart Persistence** - localStorage, survives page refresh
- 💰 **Price Calculations** - Auto-calculated totals (handles string/number types)
- 🎨 **Responsive Design** - Mobile, tablet, desktop optimized
- 🎯 **Reusable Components** - Modular architecture for easy extension

### Security:
- **Password Security**: Hashed with bcryptjs, strong password requirements (uppercase, lowercase, numbers, special characters, min 6 chars)
- **JWT Authentication**: Tokens with 30 minutes expiration
- **Input Validation & Sanitization**: Server-side validation with express-validator, XSS protection
- **Rate Limiting**: Scoped rate limiters
  - General API: 600 req/15min
  - Auth endpoints: 5 req/15min (credential stuffing protection)
  - Products API: 100 req/min (allows browsing and pagination)
- **Security Headers**: Helmet middleware with Content Security Policy (CSP)
- **NoSQL Injection Protection**: express-mongo-sanitize
- **Centralized Error Handling**: Custom error handler middleware
- **Protected Routes**: Token verification middleware

### UI/UX:
- **Responsive Design** - Bootstrap 5 with mobile-first approach
- **Dynamic Navbar** - User name, cart counter, conditional auth buttons
- **Mini Cart** - Modal with full cart management (add/update/remove)
- **Product Grid** - Responsive cards with images, prices, stock status
- **Pagination** - SEO-friendly links, ellipsis, smooth scrolling
- **Sorting Dropdown** - Visual feedback, active state indicators
- **Alert System** - Error/Success/Warning/Info with icons and dismiss
- **Loading States** - Spinners for async operations
- **System Messages** - Redux state management
- **Auto Redirect** - After auth actions
- **Email Validation** - Client and server-side
- **Profile Management** - Edit/Delete with confirmation
- **Custom Branding** - Favicon and "Created by Serhii Soloviov" footer
- **Protected Routes** - Login redirect for authenticated pages

## Database Structure

The application uses **Sequelize ORM** for database management. Tables are automatically created and synchronized on application startup.

### User Model
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  email: STRING(255) (Unique, Not Null, Email Validation),
  password: STRING(255) (Not Null, Hashed with bcryptjs),
  name: STRING(255) (Optional, Length: 2-255),
  created_at: TIMESTAMP (Auto-generated),
  updated_at: TIMESTAMP (Auto-generated)
}
```

### Product Model
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  name: STRING(255) (Not Null, Length: 2-255),
  description: TEXT (Optional),
  price: DECIMAL(10, 2) (Not Null, Min: 0) - Returns as string in API,
  category: STRING(100) (Optional) - 8 categories: Electronics, Accessories, etc.,
  image: STRING(500) (Optional) - Placeholder URLs,
  inStock: BOOLEAN (Default: true),
  stockQuantity: INTEGER (Default: 0, Min: 0),
  created_at: TIMESTAMP (Auto-generated),
  updated_at: TIMESTAMP (Auto-generated)
}
```

**Product Seeder:**
- Run `npm run seed:products` in backend to generate 100 sample products
- Automatically skips if products already exist
- 8 categories with randomized names, prices, descriptions
- 90% products marked as in stock

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

#### Option 1: Using Turborepo (Recommended)

**Build Backend + React Frontend:**
```bash
npm run build:react
```

**Build Backend + Next.js Frontend:**
```bash
npm run build:next
```

**Build All:**
```bash
npm run build
```

#### Option 2: Build Applications Separately
```bash
# Build React frontend
cd apps/frontend
npm run build

# Or build Next.js frontend (recommended)
cd apps/frontend-next
npm run build

# Build backend only (if needed)
cd apps/backend
npm run build
```

### Running Production Build

#### Option 1: Next.js (Recommended)

**Windows (PowerShell/CMD):**
```powershell
# Start backend server
cd apps/backend
node src/index.js

# In another terminal, start Next.js production server
cd apps/frontend-next
npm start
```

**macOS/Linux (Terminal):**
```bash
# Start backend server
cd apps/backend
node src/index.js

# In another terminal, start Next.js production server
cd apps/frontend-next
npm start
```

#### Option 2: React (Static Build)

**Windows (PowerShell/CMD):**
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

**macOS/Linux (Terminal):**
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
- Runs ALL tests (backend + frontend) before allowing commit
- Backend: 18 tests (auth, health, middleware)
- Frontend: 94 tests (components, hooks, Redux slices)
- Total: 112 tests run automatically
- Blocks commit if ANY test fails
- Ensures code quality across full stack

#### Commit Message Hook
- Validates commit message format
- Requires non-empty message with minimum 10 characters

```bash
# Pre-commit hook automatically runs:
🧪 Running backend tests...  (18 tests)
🧪 Running frontend-next tests... (94 tests)

# If any test fails, commit is blocked
# All 112 tests must pass before committing ✅
```

### Code Quality Tools:
- **Jest**: Unit and integration testing (Node.js + jsdom)
- **Supertest**: HTTP endpoint testing
- **React Testing Library**: Component testing
- **@swc/jest**: Fast TypeScript/JSX transformation
- **Husky**: Git hooks automation
- **ESLint**: Code linting (optional)

### Test Commands:
```bash
# Run all tests (backend + frontend via Turborepo)
npm test

# Backend tests only
npm run test:backend
cd apps/backend && npm test

# Frontend tests only
npm run test:frontend
cd apps/frontend-next && npm test

# Watch mode (frontend)
cd apps/frontend-next && npm run test:watch

# Coverage report
cd apps/frontend-next && npm run test:coverage
```

### Test Breakdown:

**Backend (18 tests):**
- Authentication API (10 tests)
- Health check (1 test)
- Middleware (3 tests)
- Simple utilities (4 tests)

**Frontend (94 tests):**
- Alert component (17 tests)
- Pagination component (13 tests)
- ProductSort component (12 tests)
- ProductCard component (10 tests)
- MiniCart component (8 tests)
- useProductSort hook (10 tests)
- CartSlice Redux (16 tests)
- Simple utilities (15 tests)

**Total: 112 tests across full stack ✅**

## Architecture

### Backend Structure:
```
apps/backend/src/
├── config/           # Database and app configuration
├── controllers/      # Business logic
│   ├── authController.js       # Authentication logic
│   ├── healthController.js     # Health check
│   └── productController.js    # Product CRUD + sorting + filtering
├── middleware/       # Auth, error handling
│   ├── auth.js                 # JWT verification
│   └── errorHandler.js         # Centralized error handling
├── models/           # Sequelize models
│   ├── User.js                 # User model
│   ├── Product.js              # Product model
│   └── index.js                # Models initialization
├── routes/           # API routes
│   ├── auth.js                 # Auth endpoints
│   └── products.js             # Product endpoints
├── seeders/          # Database seeders
│   └── productSeeder.js        # Generate 100 products
├── tests/            # Jest test suites (18 tests)
│   ├── auth.test.js
│   ├── health.test.js
│   ├── middleware.test.js
│   └── simple.test.js
├── utils/            # Helpers
│   └── asyncHandler.js         # Async error wrapper
└── index.js          # Main server file
```

### Frontend Structure (Next.js):
```
apps/frontend-next/src/
├── app/                    # App Router pages (file-based routing)
│   ├── layout.tsx          # Root layout with Providers
│   ├── providers.tsx       # Redux Provider wrapper
│   ├── page.tsx            # Home page (/)
│   ├── login/page.tsx      # Login route
│   ├── register/page.tsx   # Register route
│   ├── profile/page.tsx    # Profile route
│   └── productlist/page.tsx # Product catalog with pagination & sorting
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Nav with auth state + MiniCart
│   ├── Footer.tsx          # Footer with creator info
│   ├── ProductCard.tsx     # Product display card
│   ├── MiniCart.tsx        # Shopping cart modal
│   ├── Pagination.tsx      # Universal pagination with SEO links
│   ├── ProductSort.tsx     # Sort dropdown component
│   ├── Alert.tsx           # Alert system (Error/Success/Warning/Info)
│   └── __tests__/          # Component tests (94 tests total)
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useProductSort.ts   # Sorting logic hook
│   └── __tests__/          # Hook tests
├── lib/                    # Redux and API
│   ├── store.ts            # Redux store (auth + cart reducers)
│   ├── api.ts              # Axios client with interceptors
│   └── features/
│       ├── authSlice.ts    # Auth state + localStorage sync
│       ├── cartSlice.ts    # Cart state + localStorage sync
│       └── __tests__/      # Redux slice tests
├── types/                  # TypeScript type definitions
│   └── product.ts          # Product interfaces
└── __tests__/              # Utility tests
```

**Key Architecture Principles:**
- 🎯 **File-based routing** - Each folder in `app/` is a route
- 🧩 **Component separation** - Reusable, testable components
- 🪝 **Custom hooks** - Business logic extraction (useAuth, useProductSort)
- 🔄 **Redux Toolkit** - Centralized state with middleware for persistence
- 📘 **TypeScript** - Full type safety with interfaces and types
- 🧪 **Test Coverage** - 94 frontend + 18 backend tests (112 total)
- 🔗 **API Integration** - Axios with interceptors and error handling
- 💾 **State Persistence** - localStorage for auth and cart
- 🎨 **Shared Components** - DRY principle with reusable UI elements

### Module Aliases:

**Backend aliases** for clean imports:
- `@config` → `apps/backend/src/config`
- `@controllers` → `apps/backend/src/controllers`
- `@routes` → `apps/backend/src/routes`
- `@models` → `apps/backend/src/models`
- `@middleware` → `apps/backend/src/middleware`

**Next.js aliases** (TypeScript path mapping):
- `@/*` → `apps/frontend-next/src/*`
Example usage:
```javascript
// Backend (Node.js)
const { sequelize } = require('@config/database');

// Next.js (TypeScript)
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
```

## Reusable Components (Next.js)

The frontend includes a library of production-ready, tested components:

### UI Components:

**1. ProductCard** - Product display card
- Props: `product`, `onViewDetails`
- Features: Image, price, stock status, add to cart
- Handles string/number price types from API

**2. MiniCart** - Shopping cart modal
- Redux integration
- Real-time cart updates
- Quantity controls, remove items, clear cart
- Total calculations with mixed price types
- Modal with backdrop

**3. Pagination** - Universal pagination
- Props: `currentPage`, `totalPages`, `buildUrl`, `onPageChange`
- SEO-friendly `<Link>` components
- Smart ellipsis for large page counts
- First/Last page quick access
- Configurable visible page range

**4. ProductSort** - Sort dropdown
- Props: `sortBy`, `onSortChange`
- 5 sort options with icons
- Visual feedback when active
- Type-safe SortOption enum

**5. Alert** - Notification system
- Variants: Error, Success, Warning, Info
- Props: `message`, `title`, `dismissible`, `onDismiss`
- Bootstrap Icons integration
- Custom icon support

**6. Navbar** - Navigation with auth
- Conditional rendering based on auth state
- MiniCart integration
- Responsive mobile menu

**7. Footer** - Site footer
- Creator attribution
- Responsive design

### Custom Hooks:

**useAuth()** - Authentication state
```typescript
const { user, isAuthenticated, handleLogout } = useAuth();
```

**useProductSort()** - Client-side sorting (for reference)
```typescript
const sortedProducts = useProductSort(products, sortBy);
```

## BrowserSync (Optional)

BrowserSync provides live reloading and browser synchronization across multiple devices.

### React Frontend with BrowserSync:
```bash
cd apps/frontend
npm run dev:sync
```

### Next.js Frontend with BrowserSync:
```bash
cd apps/frontend-next
npm run dev:sync
```

Access via BrowserSync at: http://localhost:3002

**Features:**
- Live reload on file changes
- Synchronize scrolling and clicks across devices
- Network-accessible URL for mobile testing
- Browser console error notifications

## Troubleshooting

### ERR_SSL_PROTOCOL_ERROR in Browser

If you see an SSL error when opening `localhost:3000`:

1. **Use HTTP (not HTTPS)**: Open `http://localhost:3000` explicitly
2. **Clear HSTS settings in Chrome**:
   - Go to: `chrome://net-internals/#hsts`
   - Under "Delete domain security policies", enter `localhost`
   - Click "Delete"
3. **Use Incognito/Private mode** for testing
4. **Alternatively, use BrowserSync**: `npm run dev:sync` and open `http://localhost:3002`

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

## Tech Stack Summary

### Backend
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- Jest + Supertest for testing
- Rate limiting & Security headers

### Frontend
- **Next.js 14+** with App Router ✨
- TypeScript for type safety
- Redux Toolkit (SSR compatible)
- Bootstrap 5 for UI
- BrowserSync for live reload

### DevOps
- Turborepo for monorepo management
- Husky for Git hooks
- ESLint for code quality
- Module aliases for clean imports

## What's Included

✅ Complete authentication system (register, login, profile management)  
✅ Two frontend implementations (React & Next.js)  
✅ Shopping cart functionality with Redux (Next.js)  
✅ Product catalog with reusable components  
✅ RESTful API with validation  
✅ Database integration with Sequelize ORM  
✅ Comprehensive testing suite (18 tests)  
✅ Production-ready security measures  
✅ BrowserSync integration  
✅ Component-based architecture  
✅ TypeScript support  
✅ Git hooks for quality control  
✅ LocalStorage persistence for cart and auth  

## Documentation

- 📖 [Quick Start Guide](./QUICK_START.md) - Fast setup instructions
- 🚀 [Migration Guide](./MIGRATION_TO_NEXTJS.md) - React to Next.js migration
- 🔧 [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- ⚙️ [Environment Setup](./ENV_SETUP.md) - Environment configuration

## License

MIT

## Credits

Created by **Serhii Soloviov**

---

⭐ If you find this project helpful, please consider giving it a star on GitHub!
