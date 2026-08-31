# Umujyi Rwanda — Premium Fast Food Delivery & Restaurant Platform

<div align="center">
  <h3>🍗 Fast, Fresh, and Chef-Prepared Meals Delivered Across Kigali</h3>
  <p>Modern full-stack food delivery application with instant ordering, live order tracking, MTN/Airtel Mobile Money checkout, and a comprehensive Staff & Admin Operations Portal.</p>
</div>

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Interactive Menu & Customization**: Browse categories (Fried Chicken, Gourmet Burgers, Loaded Combos, Peri-Peri Sides, Desserts, and Drinks) with customizable meal options and add-ons.
- **Instant Guest Checkout & Cart**: Smooth sliding cart drawer with instant promo code redemption (`FIRSTUMUJYI`, `WEEKENDUMUJYI`), delivery vs. branch pickup selection, and live fee calculation.
- **Rwandan Mobile Money & Payment Methods**:
  - **MTN Mobile Money (MoMo)** & **Airtel Money** with USSD prompt simulation (*182#) and instant confirmation.
  - **Debit / Credit Card** (Visa & Mastercard).
  - **Cash on Delivery / Pickup**.
- **Real-Time Live Order Tracking**:
  - Visual status timeline (*Received* ➔ *Kitchen Prep* ➔ *Out for Delivery / Ready for Pickup* ➔ *Delivered*).
  - Interactive Kigali radar dispatch map with dynamic rider ETA and driver contact.
  - SMS & WhatsApp status notification updates.

### 💼 Admin & Operations Management Portal
- **Secure Staff Check-In**: Role-based access for kitchen staff, branch managers, and store administrators (`admin@umujyi.rw`).
- **Live Order Dispatch Board**: Filter orders by status (*Pending, Preparing, Out for Delivery, Delivered*), update statuses in real time, view customer notes and delivery sectors.
- **Menu & Inventory Manager**: Create, edit, toggle availability, and adjust pricing across all products and categories.
- **Promotions & Discount Engine**: Manage coupon codes, percentage discounts, minimum spend thresholds, and promotional banners.
- **Branch & Delivery Zone Settings**: Configure delivery sectors across Kigali (Kimihurura, Nyarutarama, Gacuriro, Kiyovu, Kacyiru, Remera, etc.) with custom delivery fees and estimated arrival times.
- **Analytics & Revenue Reporting**: Visual sales trends, top-selling items, order volume metrics, and payment method distribution using Recharts.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Motion & UI Transitions**: Motion (`motion/react`)
- **Charts & Visualizations**: Recharts
- **State Management & Persistence**: React Context with LocalStorage & SessionStorage schema synchronization

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yvan008/umujyi.git
   cd umijyi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Production Build

To build the static production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🔐 Demo Staff / Admin Credentials

To access the Admin Operations Portal (click **"Staff Portal"** in the footer):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@umujyi.rw` | `admin123` |
| **Kitchen Staff** | `staff@umujyi.rw` | `staff123` |
| **Branch Manager** | `manager@umujyi.rw` | `kigali2026` |

*Note: Quick-fill buttons are provided on the login screen for testing.*

---

## 📍 Delivery Sectors (Kigali, Rwanda)

- Kimihurura (Flagship Kitchen)
- Nyarutarama
- Gacuriro
- Kiyovu
- Kacyiru
- Remera
- Downtown / CBD
- Gisozi
- Kibagabaga
- Kanombe

---

## 📄 License

This project is licensed under the MIT License.
