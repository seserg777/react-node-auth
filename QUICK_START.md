# Quick Start Guide

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-node-auth

# Install all dependencies
npm install
```

## Configuration

1. **Create `.env` file in `apps/backend/`:**
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=mysql-5.7.local
DB_USER=root
DB_PASSWORD=
DB_NAME=reactnode
```

2. **Create `.env.local` file in `apps/frontend-next/`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Running the Application

### Quick Commands

**Development (Backend + Next.js - Recommended):**
```bash
npm run dev:next
```

**Development (Backend + React):**
```bash
npm run dev:react
```

**Development (All):**
```bash
npm run dev
```

### URLs

- **Frontend**: http://localhost:3000 (⚠️ use HTTP, not HTTPS)
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **BrowserSync (React)**: http://localhost:3002 (if using `dev:sync`)
- **BrowserSync (Next.js)**: http://localhost:3002 (if using `dev:sync`)

## Testing

```bash
# Run backend tests
npm test
```

## Production Build

**Build Next.js version:**
```bash
npm run build:next
```

**Build React version:**
```bash
npm run build:react
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev:next` | Run Backend + Next.js (Recommended) |
| `npm run dev:react` | Run Backend + React |
| `npm run dev` | Run Backend + Both Frontends |
| `npm run build:next` | Build Backend + Next.js |
| `npm run build:react` | Build Backend + React |
| `npm run build` | Build All |
| `npm test` | Run Backend Tests |

## Features to Try

1. **Register a new account** at http://localhost:3000/register
   - Strong password required (uppercase, lowercase, number, special char)
   
2. **Login** at http://localhost:3000/login

3. **View Profile** at http://localhost:3000/profile
   - Update your name and email
   - Delete your account

4. **Check Health** - Visit http://localhost:3001/api/health

## BrowserSync (Optional)

BrowserSync позволяет синхронизировать браузеры на нескольких устройствах и автоматически обновлять страницу.

**React с BrowserSync:**
```bash
cd apps/frontend
npm run dev:sync
```

**Next.js с BrowserSync:**
```bash
cd apps/frontend-next
npm run dev:sync
```

Откройте http://localhost:3002 для доступа через BrowserSync.

## Troubleshooting

### ERR_SSL_PROTOCOL_ERROR в браузере

Если браузер показывает ошибку SSL при открытии `localhost:3000`:

1. **Используйте HTTP** (не HTTPS): `http://localhost:3000`
2. **Очистите HSTS в Chrome**:
   - Откройте: `chrome://net-internals/#hsts`
   - В "Delete domain security policies" введите `localhost`
   - Нажмите "Delete"
3. **Используйте режим инкогнито** для тестирования

### Port Already in Use

**Windows:**
```powershell
netstat -ano | findstr ":3000 :3001"
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3000 -i :3001
kill -9 <PID>
```

### Database Connection Error

1. Make sure MySQL is running
2. Check `.env` file has correct database credentials
3. Create the database: `CREATE DATABASE reactnode;`

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for Windows
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [MIGRATION_TO_NEXTJS.md](./MIGRATION_TO_NEXTJS.md) to understand React vs Next.js
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

---

Created by Serhii Soloviov

