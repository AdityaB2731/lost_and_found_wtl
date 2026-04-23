# 🔍 Lost & Found Hub

A modern, full-stack community recovery platform designed to reconnect people with their lost items faster. Built with React, Node.js, Express, and MongoDB.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed.
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on `localhost:27017`.

### Setup Instructions

1. **Clone the project**
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will run on http://localhost:5000*

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

---

## 🛠 Features & How to Use

### 1. 📂 Browsing Items
- Navigate to the **"Browse"** page.
- Toggle between **"Available"** (Active) and **"Claimed"** items.
- Use the search bar to filter by item name.

### 2. ➕ Reporting a Found Item
- Sign in to your account.
- Click **"Post an Item"**.
- Fill in the details (Title, Category, Location, Date, and Description) and upload an image.

### 3. ✅ Claiming an Item (Legitimacy First)
- Navigate to an item detail page.
- Log in and fill out the **Detailed Claim Form**.
- Provide a valid **Contact Number** and a **crucial piece of proof** that only you would know.

### 4. 🔔 Real-time Notifications
- Users receive instant alerts when their claims are approved or rejected.
- A notification bell in the header shows the unread alert count.

---

## 👑 Administrator Features (Testing Guide)

To test the full administrative workflow, you can use the default admin credentials:

- **Email**: `admin@lostfound.com`
- **Password**: `123`

*Note: If testing for the first time on a fresh database, please **Sign Up** with this email first to register it as an admin.*

### Admin Dashboard Capabilities:
- **Global Overview**: View every single claim made across the entire system.
- **Detailed Audit**: Inspect the "Proof of Ownership" provided by users to ensure legitimacy.
- **Approve**: Marking a claim as approved automatically hides the item from the active list and notifies the owner.
- **Reject**: Rejecting a claim notifies the user and automatically puts the item back into the "Active" listings for others to find.

---

## 🏗 Tech Stack
- **Frontend**: React, TailwindCSS, Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **Security**: JWT for sessions, Bcrypt for password hashing.
