# Migration from React to Next.js

This document explains the differences between the React and Next.js implementations.

## Why Next.js?

The Next.js implementation offers several advantages over the traditional React (CRA) approach:

1. **TypeScript Support** - Full type safety across the application
2. **Better Performance** - Server-side rendering and automatic code splitting
3. **Improved SEO** - Server components and metadata management
4. **Modern Architecture** - App Router with React Server Components
5. **Built-in Optimizations** - Image optimization, font optimization, and more
6. **Better Developer Experience** - Fast refresh, built-in routing, and more

## Key Differences

### Project Structure

**React (CRA):**
```
apps/frontend/src/
├── pages/           # React components
├── components/      # Reusable components
├── store/           # Redux store
├── services/        # API services
├── hooks/           # Custom hooks
└── App.js           # Root component
```

**Next.js:**
```
apps/frontend-next/src/
├── app/             # App Router pages (with layout.tsx)
│   ├── login/       # Login page route
│   ├── register/    # Register page route
│   └── profile/     # Profile page route
├── components/      # Reusable components
├── lib/             # Redux store and API
│   ├── store.ts
│   ├── api.ts
│   └── features/    # Redux slices
├── hooks/           # Custom hooks
└── types/           # TypeScript types
```

### Routing

**React (CRA):**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
</Routes>
```

**Next.js (App Router):**
- File-based routing
- Each folder in `app/` creates a route
- `page.tsx` defines the page component
- `layout.tsx` wraps multiple pages

### Navigation

**React (CRA):**
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/login');
```

**Next.js:**
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/login');
```

### Redux with SSR

**React (CRA):**
```jsx
// Simple Redux setup
const store = configureStore({
  reducer: { auth: authReducer }
});
```

**Next.js:**
```tsx
// Need to handle client-side initialization
'use client'; // Mark as client component

export function Providers({ children }) {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);
  
  return <Provider store={store}>{children}</Provider>;
}
```

### Environment Variables

**React (CRA):**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Next.js:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Note:** In Next.js, variables must be prefixed with `NEXT_PUBLIC_` to be exposed to the browser.

### Client vs Server Components

Next.js App Router uses React Server Components by default. Components that use hooks, event handlers, or browser APIs must be marked as client components:

```tsx
'use client'; // Add this directive at the top

import { useState } from 'react';
// Now you can use hooks and browser APIs
```

### LocalStorage Access

**React (CRA):**
```jsx
const token = localStorage.getItem('token');
```

**Next.js:**
```tsx
// Need to check if running on client
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
}
```

## Migration Checklist

If you want to migrate existing code from React to Next.js:

- [ ] Convert `.js` files to `.tsx` (TypeScript)
- [ ] Add type definitions for props and state
- [ ] Move pages from `src/pages` to `src/app/[route]/page.tsx`
- [ ] Replace `useNavigate()` with `useRouter()` from 'next/navigation'
- [ ] Replace `<Link>` from react-router with `<Link>` from 'next/link'
- [ ] Add `'use client'` to components using hooks or browser APIs
- [ ] Update environment variables to use `NEXT_PUBLIC_` prefix
- [ ] Wrap localStorage/sessionStorage access with SSR checks
- [ ] Update imports to use `@/*` path aliases
- [ ] Configure `layout.tsx` for shared layout
- [ ] Test all routes and functionality

## Running Both Versions

You can run both React and Next.js versions simultaneously:

**React (port 3000):**
```bash
cd apps/frontend
npm start
```

**Next.js (port 3000):**
```bash
cd apps/frontend-next
npm run dev
```

**Note:** Only one can use port 3000 at a time. Change the port in one of them if needed.

## Performance Comparison

| Feature | React (CRA) | Next.js 14+ |
|---------|-------------|-------------|
| Initial Load | Slower (full bundle) | Faster (code splitting) |
| Navigation | Fast (client-side) | Fast (optimized routing) |
| SEO | Limited | Excellent |
| Bundle Size | Larger | Smaller (automatic optimization) |
| Build Time | Fast | Moderate |
| Type Safety | Optional (JS/TS) | Built-in TypeScript |

## Recommendations

**Use React (CRA) if:**
- You need a simple SPA
- SEO is not important
- You don't need TypeScript
- You want simpler deployment

**Use Next.js if:**
- You want better performance
- SEO matters
- You prefer TypeScript
- You want modern best practices
- You're building for production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/react/use-server)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Created by Serhii Soloviov

