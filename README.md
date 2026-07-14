# 🏡 StayNest – AI-Powered Homestay Management Platform

StayNest is a production-ready full-stack homestay management platform built for independent property owners to digitize bookings, payments, and guest management. It replaces manual WhatsApp-based booking workflows with a modern web platform featuring AI-assisted listing creation, secure online payments, owner analytics, and booking management.

> Built with **Node.js, Express.js, MongoDB, EJS, Passport.js, Stripe, Cloudinary, Nodemailer and Gemini AI**.

🌐 **Live Demo:** https://wanderlust-nxrg.onrender.com

---

# ✨ Features

### 🏠 Property Management
- Create, edit and delete homestay listings
- Upload property images using Cloudinary
- Interactive maps using OpenStreetMap & Leaflet
- Property reviews and ratings
- AI-assisted listing generation
- AI Listing Improver to rewrite titles and descriptions professionally

---

### 🤖 AI Listing Assistant

Generate professional property content in seconds.

- AI-generated property titles
- Professional property descriptions
- Suggested amenities
- House rules
- SEO keywords
- Pricing suggestions
- Users can edit everything before publishing

(Currently supports dummy AI endpoint and can be connected to Gemini API by updating a single service file.)

---

### 📅 Smart Booking System

- Secure booking workflow
- Real-time booking validation
- Overlap-aware booking validation
- Prevents double bookings
- Guest details management
- Booking reference generation
- Booking status tracking

---

### 💳 Online Payments

- Stripe Checkout integration
- Secure payment flow
- Pending → Paid booking lifecycle
- Automatic booking confirmation
- Booking reference generation

---

### 📧 Email Notifications

Automatic booking confirmation emails using Nodemailer.

Email includes:

- Booking ID
- Property Name
- Check-in & Check-out
- Guest Count
- Total Amount Paid

---

### 📂 Guest Dashboard

Guests can:

- View all bookings
- Filter upcoming & past trips
- Cancel pending bookings
- Download booking receipt (optional)
- View booking status

---

### 🏢 Owner Dashboard

Designed specifically for non-technical homestay owners.

Includes:

- Total Properties
- Total Revenue
- Pending Bookings
- Today's Arrivals
- Recent Bookings
- Property Management
- Business Calculator
    - GST Calculator
    - Discount Calculator
    - Final Customer Price

---

### 🔐 Authentication

- Passport.js Local Authentication
- Secure Sessions
- MongoDB Session Store
- Role-based Owner Authorization
- Protected Routes

---

### ⭐ Reviews & Ratings

- Property Reviews
- Star Ratings
- Owner Moderation
- Delete Own Reviews

---

### 🗺️ Maps

- Leaflet Maps
- OpenStreetMap Integration
- Automatic Geo Coordinates
- Property Location Pins

---

### 📱 Responsive UI

- Mobile Friendly
- Tablet Friendly
- Desktop Optimized
- Airbnb-inspired clean interface

---

### ⚙️ Error Handling

- Flash Messages
- Custom Error Pages
- Validation
- Express Error Middleware

---

# 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- EJS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Integrations

- Stripe
- Cloudinary
- Nodemailer
- Passport.js
- Connect-Mongo
- Axios
- Leaflet
- Gemini AI (Plug-and-Play)

---

# 📂 Project Structure

```
StayNest
│
├── controllers
├── models
├── routes
├── views
│   ├── listings
│   ├── owner
│   ├── user
│   └── partials
├── public
├── utils
├── middleware
├── cloudConfig.js
├── app.js
└── package.json
```

---

# 🚀 Core Workflow

```
Owner Creates Property
        │
        ▼
AI Generates Professional Content
        │
        ▼
Listing Published
        │
        ▼
Guest Books Property
        │
        ▼
Overlap Validation
        │
        ▼
Stripe Payment
        │
        ▼
Booking Confirmed
        │
        ▼
Booking Reference Generated
        │
        ▼
Confirmation Email Sent
        │
        ▼
Visible in Guest & Owner Dashboard
```

---

# ⚙️ Environment Variables

```env
ATLAS_URL=

SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

EMAIL_USER=
EMAIL_PASS=

BASE_URL=http://localhost:8080
PROD_BASE_URL=https://yourdomain.com
```

---

# 📦 Installation

```bash
git clone https://github.com/pranavrajchoudhary/StayNext.git

cd StayNext

npm install

npm start
```

Server:

```
http://localhost:8080
```

---

# 📈 Highlights

- AI-powered property listing generation
- Smart booking validation
- Stripe online payments
- Automated email confirmations
- Owner business dashboard
- Revenue analytics
- Interactive maps
- Cloud image storage
- Secure authentication
- Responsive design

---

# 🔮 Upcoming Features

- PDF Invoice Generation
- WhatsApp Notifications
- Real Gemini AI Integration
- Occupancy Analytics
- Multi-property Calendar
- Booking Reports

---

# 👨‍💻 Author

**Pranav Raj Choudhary**

GitHub: https://github.com/pranavrajchoudhary

---

## ⭐ If you found this project useful, consider giving it a Star on GitHub!
