# Environment Variables Setup for Next.js

Create a `.env.local` file in the `apps/frontend-next/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Environment Variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001/api)

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

