# 🔍 Lost & Found Hub

A full-stack Lost & Found web application (React + Node/Express + MongoDB) that helps users list found items, claim ownership, and let admins verify claims. This README documents the working features, what has been implemented, setup instructions, and placeholders for teammates and contact numbers.

---

## Table of contents

- Project overview
- Working features (what's implemented)
- Project structure (where things live)
- Setup & run (backend + frontend)
- Environment variables
- API endpoints (summary)
- Team & placeholders
- Contributing & next steps

---

## Project overview

Lost & Found Hub is designed for communities to report found items, let owners claim them with proof, and give admins tools to verify and resolve claims. The app includes user authentication, item listing with image uploads, a claim workflow, notifications, and admin reporting tools.

---

## Working features (implemented)

The following features are implemented and available in this repository:

- Authentication
   - Sign up / Sign in with email and password.
   - JWT-based session tokens (backend middleware enforces protected routes).
   - Password hashing (bcrypt).
- Item Listings
   - Create, edit, and delete item listings (with image upload).
   - Browse and search items.
   - Item details page with full metadata and images.
- Claims Workflow
   - Users can submit a claim against an item with a contact number and proof.
   - Admins can review claims and either approve or reject them.
   - Approved claims mark items as claimed and notify involved users.
- Notifications
   - In-app notification center (unread badge in header).
   - Notifications triggered for claim approvals/rejections and other events.
- File Uploads
   - Image uploads for item listings stored under the `backend/uploads/` folder.
- Admin Dashboard & Reports
   - Admin pages for viewing claims, approving/rejecting, and generating reports.
- User pages
   - `MyListings` and `MyClaims` pages for managing your items and claims.
- Frontend utilities
   - `UserSync` component to keep auth state in sync across the UI.

If you want to confirm any of the above by file, the code for these features lives under `backend/` and `frontend/src/` (see Project structure below).

---

## Project structure (high level)

- backend/
   - server.js — Express server entry
   - models/ — Mongoose models (`User.js`, `Item.js`, `Claim.js`, `Notification.js`)
   - routes/ — API routes (`authRoutes.js`, `itemRoutes.js`, `claimRoutes.js`, `notificationRoutes.js`)
   - middleware/ — auth middleware (JWT verification)
   - uploads/ — stored uploaded images
- frontend/
   - src/
      - pages/ — React pages (Browse, ItemDetails, AddItem, EditItem, MyClaims, MyListings, AdminDashboard, AdminReport, etc.)
      - components/ — reusable components (`Header.jsx`, `ItemCard.jsx`, `Layout.jsx`, `UserSync.jsx`)
      - context/ — `AuthContext`, `NotificationContext`
      - api/index.js — Axios API helper

---

## Setup & run

Follow these steps to run the project locally.

1) Clone the repo

2) Backend

```bash
cd backend
npm install
# create .env (see ENV section below)
npm run dev
```

Default backend port: `5000` (adjust in `server.js` or env).

3) Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend dev server: `5173` (Vite).

---

## Environment variables (placeholders)

Create a `.env` file in `backend/` with the following placeholders:

- `MONGO_URI=` (e.g. mongodb://localhost:27017/lostfound)
- `JWT_SECRET=` (a long random string)
- `PORT=5000`

You may also optionally add cloud storage credentials if you adapt uploads to S3 or similar.

---

## API summary (important endpoints)

Backend routes are mounted under `/api` (see `backend/routes`). Example endpoints:

- `POST /api/auth/signup` — register new user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/items` — list/browse items
- `GET /api/items/:id` — item details
- `POST /api/items` — create item (auth + upload)
- `PUT /api/items/:id` — edit item (auth)
- `DELETE /api/items/:id` — delete item (auth)
- `POST /api/claims` — submit a claim for an item
- `GET /api/claims` — admin: list claims
- `POST /api/claims/:id/approve` — admin: approve a claim
- `POST /api/claims/:id/reject` — admin: reject a claim
- `GET /api/notifications` — fetch user notifications

Refer to the route files in `backend/routes/` for exact request/response shapes.

---

## What I implemented (developer notes)

This project includes the following implemented pieces (good quick checklist for reviewers):

- Backend: user model, item model, claim model, notification model.
- Backend routes: authRoutes, itemRoutes, claimRoutes, notificationRoutes.
- Middleware: `auth.js` JWT verification middleware protecting private endpoints.
- File handling: image upload handling and storage under `backend/uploads`.
- Frontend: React pages for browse, details, add/edit items, my claims/my listings.
- Frontend context: `AuthContext` for user state, `NotificationContext` for notifications.
- UI components: `Header`, `ItemCard`, `Layout`, `UserSync` to keep user state consistent.
- Admin UI: `AdminDashboard` and `AdminReport` pages to review and act on claims.

---

## Team
- Aditya Bajaj:7020351226
- Jayraj Desai:7249843431

---
Thank you — open an issue or ping me in case of contribution.
