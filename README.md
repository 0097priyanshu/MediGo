# MediGo — Modern Medicine Delivery & Inventory Platform

MediGo is a full-stack medicine delivery and pharmacy inventory management platform designed to connect customers with local pharmacies. It features a complete JWT authentication flow, a dynamic shopping cart, a secure Razorpay payment gateway integration, real-time delivery order tracking, and a comprehensive analytics control panel for administrators.

This project is built using a clean, scalable, and modular **CommonJS architecture** on the backend and **React (Vite) + Tailwind CSS** on the frontend.

---

## 🚀 Features

### 1. User Authentication & Security
- **JWT Session Security:** Secure token-based session verification with protected profile endpoints.
- **Bcrypt Password Hashing:** Salted password hashing in the database.
- **Role-Based Guards:** Separation between customers and administrators (`admin` vs `user` roles).

### 2. Pharmacy & Inventory Management
- **Pharmacy CRUD:** Maintain local pharmacies with properties for ratings, phone contacts, locations, and opening status.
- **Medicine Catalog:** Manage stock availability, prices, categories, and direct linkage to specific pharmacies.
- **Stock Enforcements:** Intelligent stock checks that automatically prevent checkout of out-of-stock items and decrement inventory upon purchase.

### 3. Shopping Cart & Checkout
- **React Context API:** Persistent cart items using `localStorage`.
- **Checkout Calculations:** Automatic discount (5% promo) and delivery charge evaluations (free delivery on orders above ₹500).
- **Delivery Address validation:** Integrates a physical address entry modal before enabling checkout payments.

### 4. Secure Payment Gateway (Razorpay)
- **Dynamic Order Creation:** Converts subtotals to paise dynamically and initializes Razorpay orders securely.
- **HMAC Verification:** Validates signatures via HMAC-SHA256 to protect against payment tampering.
- **Database Status Sync:** Automatically flags orders as `paid` and `Confirmed` on database collection logs.

### 5. Live Order Tracking
- **Auto-polling Status updates:** Periodically queries the database every 5 seconds for status changes.
- **Dynamic Progress Stepper:** Vertical step indicators showing visual timeline updates: `Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Out For Delivery` ➔ `Delivered`.
- **Simulated Route Coordinates:** Live coordinates updates with maps coordinates compatibility.

### 6. Admin Control Center (Dashboard)
- **Analytics Cards:** Aggregate statistics for total orders, total revenue, medicines count, and pharmacies count.
- **Recent Orders Panel:** Live feed of recent orders with status-changing dropdown capabilities.
- **Catalog Management:** Integrated modal popup form to Add, Edit, or Delete medicines, with active stock level controls.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Routing:** React Router v6
- **Styling:** CSS (Tailwind CSS)
- **Icons:** Lucide React
- **State Management:** React Context API

### Backend
- **Server:** Node.js + Express.js v5
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) & bcryptjs
- **Payment Gateway:** Razorpay SDK

---

## 📂 Architecture & Folder Structure

The project separates concerns using a modular design:

```
MediGo/
├── backend/
│   ├── config/             # DB Connection setups
│   ├── controllers/        # Business logic controllers
│   ├── middleware/         # Auth token & role checking guards
│   ├── models/             # Mongoose schemas (User, Pharmacy, Medicine, Order)
│   ├── routes/             # Express routes split by domain
│   ├── services/           # Payment logic & simulated trackers
│   ├── index.js            # Express server initialization
│   └── node-build.js       # Production server start script
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI widgets
    │   ├── context/        # Cart Context state managers
    │   ├── pages/          # Page components (Home, Cart, AdminDashboard, TrackOrder)
    │   ├── App.jsx         # App router mounting
    │   └── global.css      # Core styles
```

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/medigo
JWT_SECRET=8sdf67df78df7dfsd98f7dsa9
RAZORPAY_key_id=rzp_test_yourkeyid
RAZORPAY_live_key_secret=yourkeysecret
```

---

## 🚀 Installation & Setup

Follow these steps to run the project locally:

### Prerequisites
- Node.js installed locally.
- MongoDB server running locally on `127.0.0.1:27017` or a MongoDB Atlas URI.

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔧 API Endpoints Sheet

### Authentication
* `POST /api/auth/register` — Register a new user account.
* `POST /api/auth/login` — Login to receive a JWT access token.
* `GET /api/auth/profile` — Fetch details of the logged-in profile (Requires Token).

### Pharmacies
* `GET /api/pharmacies` — Fetch all registered pharmacies.
* `GET /api/pharmacies/:id` — Fetch specific pharmacy by ID.
* `POST /api/pharmacies` — Register a new pharmacy.
* `PUT /api/pharmacies/:id` — Update pharmacy details.
* `DELETE /api/pharmacies/:id` — Remove pharmacy from list.

### Medicines Catalog
* `GET /api/medicines` — Fetch all medicines.
* `GET /api/medicines/:id` — Fetch details of a single medicine.
* `POST /api/medicines` — Add a new medicine (Requires Admin Token).
* `PUT /api/medicines/:id` — Edit medicine details/stock (Requires Admin Token).
* `DELETE /api/medicines/:id` — Remove medicine from list (Requires Admin Token).

### Orders
* `POST /api/orders` — Create a new customer order (Requires Token).
* `GET /api/orders` — List orders (Requires Token. Admins see all, users only see theirs).
* `GET /api/orders/:id` — Fetch details of an order (Requires Token).
* `PATCH /api/orders/:id/status` — Update order status (Requires Admin Token).

### Payments
* `POST /api/payments/create-order` — Initialize Razorpay order (Requires Token).
* `POST /api/payments/verify` — Cryptographically verify Razorpay signature and update database (Requires Token).
* `GET /api/order-status/:id` — Public endpoint fetching simulated live coordinate coordinates.

---

## 🔮 Future Scope
- **Live Maps Integration:** Embedding Google Maps/Leaflet to render the real-time movement of the delivery partner coordinates.
- **Email/SMS Notifications:** Automated confirmation emails and shipping text notifications via Nodemailer or Twilio.
- **Prescription Uploads:** Enable prescription uploads with OCR or admin validation before allowing checkout on scheduled medicines.
