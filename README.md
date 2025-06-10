
# Expense Tracker 💸

![expense-tracker](public/photos/expense-tracker.gif)

**Expense Tracker** is a full-featured RESTful web application built with **Node.js**, **Express**, and **MongoDB** that helps users manage their daily expenses and income.



## ✨ Features

- User registration with email/password
- Social login with Facebook/Google
- Expense & revenue management
- Category-wise and monthly breakdowns via charts
- Budget tracking with visual feedback
- Edit profile info (name, avatar)
- Fully responsive UI

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js (Local, Facebook, Google)
- **Frontend**: HTML, CSS, Bootstrap, Chart.js

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js (v14.15.1+)](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### 📥 Installation

```bash
git clone https://github.com/sagarbj3245/expense-tracker.git
cd expense-tracker
npm install
````

### 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
FACEBOOK_ID=<your_facebook_app_id>
FACEBOOK_SECRET=<your_facebook_app_secret>
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK=http://localhost:3000/auth/google/callback

SESSION_SECRET=your_session_secret
MONGODB_URI=mongodb://localhost:27017/expense-tracker
PORT=3000
```

> 💡 You can get your Facebook/Google credentials from [Facebook Developers](https://developers.facebook.com/) and [Google Developer Console](https://console.developers.google.com/).

---

## 🌱 Seed the Database

To insert default users, categories, and records:

```bash
npm run seed
```

---

## ▶️ Run the App

For development (with auto-reload via [nodemon](https://www.npmjs.com/package/nodemon)):

```bash
npm run dev
```

Or for basic startup:

```bash
node app.js
```

App will run on: [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment

Make sure to:

* Set production values in `.env`
* Use a production database (e.g., MongoDB Atlas)
* Add environment variables on your hosting platform (e.g., Heroku)

---