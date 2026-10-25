# Deploy this frontend to Vercel

1. Deploy the backend to Render and copy its public HTTPS URL, for example `https://gpm-api.onrender.com`.
2. Replace `your-render-service.onrender.com` in `vercel.json` with the Render hostname. Keep the `/api/:path*` suffix in the destination.
3. Import the repository into Vercel and set **Root Directory** to `frontend`.
4. Use the Vite build command `npm run build` and output directory `dist` (Vercel normally detects these automatically).
5. Leave `VITE_API_BASE_URL` unset in Vercel. The frontend uses the same-origin `/api` path and Vercel forwards it to Render. Setting it to the Render URL directly bypasses this proxy and can fail because the backend currently only permits localhost through CORS.
6. Deploy. The SPA rewrite serves `index.html` for direct visits and reloads on routes such as `/login`, `/admin`, `/super-admin`, and `/gpbuddy`.

For local development, the existing Vite `/api` proxy continues to target `http://localhost:3000`.
