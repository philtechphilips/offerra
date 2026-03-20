# 💎 Offerra Frontend: Next-Gen Job Tracker UI

The Offerra Frontend is a high-performance **Next.js 15 (React 19)** single-page application, meticulously designed to provide a premium, smooth dashboard experience for job seekers.

![Frontend Overview](https://via.placeholder.com/1200x500?text=Next.js+Frontend+Dashboard)

## 🧩 Module Breakdown

### 1. 🎨 Design Language (Zinc & Indigo)
*   **Aesthetic System**: A tailored color palette using deep Zine grays and vibrant Indigo accents.
*   **Motion Architecture**: Integrated **Framer Motion** for liquid-smooth transitions, modal entries, and live ticker updates.
*   **Glassmorphism Components**: Premium translucent backgrounds for the Top Header and Sidebar elements.

### 🧠 State Management (Zustand & Context)
*   **`notificationStore`**: A reactive global store that handles:
    *   **Fetching**: Server-side fetching of unread notifications.
    *   **Marking as Read**: Optimistic updates for instant UI feedback.
    *   **Counting**: Live red bubble count for the header bell icon.
*   **Auth Store**: Secure management of Sanctum sessions and user credit balances.

### 📊 Dashboard & Analytics
*   **Application Pipeline**: Vertical bar charts showing your "Applied", "Interviewing", and "Offered" job stages.
*   **Revenue Velocity (Admin Only)**: Advanced bar charts for administrators to monitor sales growth for the last 14 days.
*   **Popular Plans**: Interactive Sales breakdown for every credit pack on the platform.

### 🛡️ Admin Suite
*   **User Control**: Search, delete, toggle roles, and **manually add bonus credits** with one click.
*   **System Settings**: Real-time configuration for global credit costs and platform constants.

---

## 🛠️ Technical Stack

*   **Framework**: Next.js 15+ (App Router)
*   **Core Library**: React 19 (Zero-config [React Compiler](https://react.dev/learn/react-compiler) ready)
*   **State Management**: Zustand (Lightweight alternative to Redux)
*   **Styling**: Tailwind CSS 4.x (Utility-first, highly customized)
*   **Animations**: Framer Motion 12+
*   **Icons**: Lucide-React (Vibrant, accessible icons)
*   **HTTP Client**: Axios with Sanctum CSRF protection

---

## 🚀 Setup & Installation

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Create `.env.local` and add:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```
3.  **Launch**:
    ```bash
    npm run dev
    ```

---

## 🏗️ Folder Structure

*   `app/`: Dynamic routing, layouts, and page definitions.
*   `app/store/`: Zustand global storage for notifications/auth.
*   `components/`: Reusable React components.
    *   `dashboard/`: Specialized modules for the main app views.
    *   `landing/`: Components for the high-end marketing home page.
*   `app/lib/`: Custom utility functions and api client.

---

## 📸 Component Showcase

| Notification Dropdown | Admin Analytics Grid | Dashboard Sidebar |
| :---: | :---: | :---: |
| ![Notification UI](https://via.placeholder.com/350x200?text=Notification+UI) | ![Analytics UI](https://via.placeholder.com/350x200?text=Revenue+Charts) | ![Sidebar UI](https://via.placeholder.com/350x200?text=Sidebar+Design) |

---

## 📄 License
Copyright © 2026 Offerra Frontend Team.
