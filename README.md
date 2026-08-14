# A7 SATTA - Web Portal & Admin Management System

A high-performance, real-time Satta Result & Record Chart web platform with an interactive inline Admin Panel and Firebase Realtime Database synchronization.

---

## 🌟 Key Features

1. **Live Game Results Display**
   - Live clock and automatic game status tracking (`WAIT` indicator for upcoming games, red bold result numbers for declared games).
   - Featured Game Spotlight (DISAWAR) with animated transition arrows (`➜`).
   - Primary & Secondary Game Result Tables with historical "Yesterday" and "Today" result columns.

2. **Interactive Khaiwal Advertisement Box**
   - Flexible advertisement schedule editor with game timings, dotted leaders (`.....`), custom rate lists, and animated WhatsApp CTAs (`wa.me`).
   - Dual-mode Admin Editor: **Easy Schedule Editor Form** & **Raw HTML Editor**.

3. **Record Charts & Archives**
   - Monthly homepage color-coded charts (Green, Blue, Orange).
   - Full monthly result charts (August 2026 & July 2026).
   - Multi-year archive charts (**2026**, **2025**, **2024**, **2023**) supporting custom record game additions and deletion.

4. **Realtime Firebase Cloud Database Sync**
   - Instant bi-directional synchronization between Admin changes and public client visitors using Firebase Realtime Database (`a7satta/` node).
   - Automatic local storage fallback (`a7_*` keys) for offline resilience.

5. **Security & Access Control**
   - Session-based Admin Login authentication.
   - Passkey-protected **Settings Gate** to protect cloud database keys and credential updates.

---

## 📁 Repository Structure

```
Satta-3/
├── index.html            # Main Public Portal Page
├── chart.html            # Full Monthly & Yearly Satta Record Charts
├── contact.html          # Contact & WhatsApp Game Booking Page
├── login.html            # Admin Authentication Page
├── admin.html            # Full Interactive Administrative Dashboard
├── css/
│   └── style.css         # Complete Responsive Light Theme Stylesheet & Admin Styling
├── js/
│   ├── env.js            # Environment Configuration (Admin Credentials & Firebase Config)
│   ├── env.template.js   # Configuration Template for Environment Setup
│   ├── data.js           # Core Data Access Layer, Default Schema, & Auto-Rollover Logic
│   ├── firebase-data.js  # Firebase Realtime Database Synchronization Module
│   ├── app.js            # Public Pages Render Logic, Live Clock, & Layout Transformers
│   └── admin.js          # Admin Dashboard Inline Table Editors, Tabs, & Toast Notifications
├── .env.example          # Environment Key Reference File
├── .gitignore            # Git Exclusion Rules
└── README.md             # Project Documentation
```

---

## ⚙️ Environment Configuration (`js/env.js`)

Central configuration is stored in `js/env.js` and loaded globally into `window.ENV_CONFIG`:

```javascript
const ENV_CONFIG = {
    // Admin Credentials
    ADMIN_USERNAME: "Adminx285",
    ADMIN_PASSWORD: "Admin@2805",
    SETTINGS_PASSKEY: "SecurityxAdmin2026",

    // Site & Contact Config
    SITE_NAME: "A7 SATTA",
    WHATSAPP_PHONE: "+917082097131",
    WHATSAPP_URL: "https://wa.me/917082097131",

    // Firebase Database Credentials
    FIREBASE_API_KEY: "AIzaSyDD7yZexkPwHHPmt8KaFMdaTkfnpwOVpuQ",
    FIREBASE_DATABASE_URL: "https://satta-3-default-rtdb.asia-southeast1.firebasedatabase.app/",
    FIREBASE_PROJECT_ID: "satta-3",
    FIREBASE_AUTH_DOMAIN: "satta-3.firebaseapp.com",

## 🛠️ Local Development & Deployment

1. Clone or download the repository into your web server directory (Apache, Nginx, Live Server, GitHub Pages, or Netlify).
2. Ensure `js/env.js` is present in the `js/` directory.
3. Open `index.html` in your web browser.
4. Navigate to `login.html` to access the Admin Panel.

---

## 📜 License & Disclaimer

This software is for demonstration and administrative management purposes. Please adhere to local laws regarding online gaming and gambling.
