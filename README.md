# Arajut Marketplace

Responsive React marketplace demo for Arajut, an Indonesian handmade crochet UMKM. The storefront includes product discovery, product detail, persistent cart, customer accounts, and a browser-based admin panel.

## Technology

React 19, Vite, JavaScript, Tailwind CSS 4, React Router, localStorage/sessionStorage, and IndexedDB for uploaded-image storage support.

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

Open the Vite URL (normally `http://localhost:5173`), not a Live Server port.

## Routes

Public: `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`.

Customer: `/signup`, `/login`, `/account`.

Admin: `/admin/login`, `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit`, `/admin/categories`, `/admin/site-settings`.

## Demo admin

- Email: `admin@arajut.local`
- Password: `Arajut123!`

**Security warning:** this is a frontend-only demo account. Browser-based authentication and plain browser storage are not secure for production. Replace this implementation with server-side Laravel Sanctum authentication, authorization, validation, and database persistence before production use.

Customer accounts are created locally through the sign-up page. “Remember me” uses persistent browser storage; otherwise the session lasts for the browser tab session.

## Browser data

Seed products, categories, settings, and customer metadata live under the versioned `arajut-demo-v2` localStorage key. Cart compatibility remains under `arajut-cart`. The image service uses the `arajut-images` IndexedDB database for file blobs.

To reset the demo, clear site data in browser developer tools (Application → Storage → Clear site data), then refresh. Default data is seeded only when missing or incompatible.

Product image URLs can be replaced from the product editor. Hero text and image URL can be changed from **Admin → Konten Website**. The source defaults are centralized in `src/data/products.js` and `src/services/storage.js`.

## Planned backend integration

The context/service boundary is intended to be replaced by a Laravel REST API using Sanctum. Production work must move credentials, password hashing, sessions, CRUD authorization, uploads, and validation to that backend.

## Deployment architecture

```text
Vercel (React + Vite) → Railway (Laravel REST API + Sanctum) → Supabase (PostgreSQL + Storage)
```

The browser communicates only with Laravel. Supabase database credentials and the Storage secret belong only in Railway's Laravel environment; the database is not hosted in Vercel. The frontend accepts only `VITE_API_BASE_URL`.

### Vercel deployment

1. Import the frontend GitHub repository into Vercel.
2. Select the Vite framework preset.
3. Use `npm install`, `npm run build`, and output directory `dist`.
4. Set `VITE_API_BASE_URL` for Production, Preview, and Development as appropriate.
5. Redeploy after changing environment variables.
6. Confirm direct React Router URLs load. `vercel.json` rewrites all routes to `index.html`.

Local API example (put it in an uncommitted `.env.local`):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Production should point to the Railway Laravel domain ending in `/api`; do not hardcode it in source.

### Deployment checklist

- Frontend: `npm install`, `npm run lint`, `npm run build`, configure `VITE_API_BASE_URL`, deploy on Vercel, and test direct routes.
- Backend: configure Railway variables, run `php artisan config:clear`, `php artisan cache:clear`, migrate or verify the Supabase schema, verify CORS and Sanctum, then test Storage uploads.
- Supabase: use PostgreSQL plus the existing `product-images` and `site-assets` buckets only.
