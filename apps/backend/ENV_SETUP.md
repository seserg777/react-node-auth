# Environment Variables Setup

Create a `.env` file in the `apps/backend/` directory with the following variables:

```env
# Database Configuration
DB_HOST=mysql-5.7.local
DB_PORT=3306
DB_NAME=reactnode
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Required Environment Variables:

- `DB_HOST` - MySQL host (default: mysql-5.7.local)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_NAME` - Database name (default: reactnode)
- `DB_USER` - Database username (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Security Notes:

1. **Never commit `.env` files to version control**
2. **Use strong JWT secrets in production**
3. **Use environment-specific database credentials**
4. **The `.env` file is already in `.gitignore`**
