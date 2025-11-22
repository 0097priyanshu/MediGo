# 🚀 MediGo — Instant Medicine Delivery Platform  
Real-time medicine availability • Fast ordering • Secure payments • Live delivery tracking • AI chatbot

MediGo is a full-stack web application built to solve a real-world problem:  
**“Finding & receiving medicines instantly when local shops don’t have stock.”**

It provides real-time medicine availability, nearest pharmacy sorting, instant ordering, secure Razorpay payments, and live order tracking with a smart delivery workflow.

---

## 🌟 Features

### 👤 User Features
- 🔐 **Authentication**: Sign up, Login (JWT-based)
- 🔍 **Search Medicines**: By name, brand, or salt
- 🏥 **Nearby Pharmacies**: Sorted by distance using geolocation
- 📦 **Real-time Availability**: Inventory updated instantly
- 🧾 **Upload Prescription** (for restricted drugs)
- 💳 **Razorpay Payment Integration**
- 📍 **Live Delivery Tracking**
- 🤖 **AI Chatbot (Gemini API)** for queries & recommendations

---

## 🏪 Vendor Features (Pharmacy Dashboard)
- Login / authentication  
- Add / update inventory  
- Accept or reject orders  
- Real-time order status  
- Stock management  

---

## 🚚 Delivery System
- Auto assignment to nearest delivery agent  
- Live GPS movement simulation  
- Status:  
  - `created`  
  - `paid`  
  - `out_for_delivery`  
  - `delivered`  

---

## 🧱 Tech Stack

### Frontend
- React + TypeScript  
- Vite  
- TailwindCSS / shadcn UI  
- Razorpay Checkout  
- REST API integration  

### Backend
- Node.js  
- Express.js  
- TypeScript  
- MongoDB (Atlas)  
- JWT Authentication  
- Razorpay Server SDK  
- Google Gemini AI SDK  
- CORS, dotenv
