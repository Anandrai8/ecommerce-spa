# E‑Commerce SPA (Assignment)

A single‑page e‑commerce app with:

**Backend**
- Node.js + Express + MongoDB + Mongoose
- JWT Authentication (`/api/auth/register`, `/api/auth/login`)
- Items CRUD with filters (`/api/items?category=...&minPrice=...&maxPrice=...&q=...`)
- Cart APIs (`/api/cart`) — persists server‑side, so your cart survives logout

**Frontend**
- React + Vite
- Tailwind for clean, professional UI
- Pages: Signup, Login, Listing with filters, Cart (add/remove/update)
- JWT stored in localStorage
- Guest cart via localStorage with server merge on login

---

## Quick Start (Local)

### 1) MongoDB
Create a MongoDB Atlas database, then copy the connection string.

### 2) Backend
```bash
cd backend
cp .env.example .env  # then edit values
npm install
npm run dev           # or: npm start
```
Seed sample items (optional):
```bash
curl -X POST http://localhost:4000/api/items/seed
```

### 3) Frontend
```bash
cd ../frontend
cp .env.example .env  # set VITE_API_BASE_URL (e.g. http://localhost:4000/api)
npm install
npm run dev
```

---

## Deployment (Suggested)

**Backend (Render):**
- Create a new Web Service from your GitHub repo’s `backend` folder.
- Environment:
  - `MONGO_URI` = `<your MongoDB connection string>`
  - `JWT_SECRET` = `<a long random string>`
  - `PORT` = `4000` (Render sets it; use `process.env.PORT` in code)
  - `CLIENT_ORIGIN` = `<your deployed frontend origin>` (e.g. `https://yourapp.vercel.app`)
- Build Command: `npm install`
- Start Command: `npm start`

**Frontend (Vercel/Netlify):**
- Environment:
  - `VITE_API_BASE_URL` = `https://<your-backend-host>/api`
- Build Command: `npm run build`
- Output Directory: `dist`

> Submission requires a **live link** and **GitHub link**. Push both folders to GitHub (e.g. a mono‑repo), deploy backend (Render) and frontend (Vercel/Netlify), then share those URLs.

---

## Test Users
After registration you’ll be a normal `user`. To try admin CRUD, update your user’s `role` to `admin` in MongoDB.

---

## API Summary

### Auth
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`

### Items
- `GET /api/items?category=&minPrice=&maxPrice=&q=&page=&limit=&sort=&order=`
- `POST /api/items` (admin)
- `PUT /api/items/:id` (admin)
- `DELETE /api/items/:id` (admin)
- `POST /api/items/seed` (dev only)

### Cart (requires `Authorization: Bearer <token>`)
- `GET /api/cart` → `{ cart: [ { item, quantity } ] }`
- `POST /api/cart/add` `{ itemId, quantity }`
- `PATCH /api/cart/update` `{ itemId, quantity }` (quantity 0 removes)
- `POST /api/cart/sync` `{ items: [{ itemId, quantity }] }` (merge guest cart)
- `DELETE /api/cart/clear`

---

## Project Structure
```
/backend  — Express API
/frontend — React SPA (Vite + Tailwind)
```

Good luck!


## Making a user an admin (to use the Admin UI)

After you register a user, make them an admin by updating the user document in MongoDB.

If using MongoDB Atlas -> Collections -> `your-db -> users` -> Edit the user document and change:
```json
{ "role": "admin" }
```

Or via mongo shell:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Once a user has `role: "admin"`, they can visit `/admin` in the frontend and create/update/delete items.
