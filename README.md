# ZansMarket E-Commerce System

ZansMarket is a premium, modern e-commerce platform built with **Next.js**, **Express**, and **Supabase**. It features a robust relational database schema, granular Row Level Security (RLS), and a world-class Admin Dashboard.

## 🚀 Features

- **🛍️ Complete Shopping Flow**: Product catalog, cart management, and secure checkout.
- **🛡️ Secure Auth & Profiles**: Integrated with Supabase Auth with automatic profile synchronization.
- **🏛️ Stabilized Supabase Schema**: Normalized database with `profiles`, `products`, `orders`, and `order_items`.
- **🔐 Row Level Security (RLS)**: Fine-grained access control (Public Read / Admin Write).
- **💎 Premium Admin Dashboard**:
  - Glassmorphism UI design.
  - Real-time business statistics.
  - Order management with batch delivery actions.
  - Secure Admin Routing Guard.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: Supabase (PostgreSQL).
- **Authentication**: Supabase Auth + JWT.

## 📦 Getting Started

### 1. Environment Setup

Create a `.env` file in the `server` directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

### 2. Database Migration

Run the provided SQL scripts in your Supabase SQL Editor:
1. `server/schema_v2.sql`: Build the relational structure and triggers.
2. `server/enable_rls.sql`: Activate Row Level Security.
3. `server/product_policies.sql`: Apply product access policies.

### 3. Installation

```bash
# Setup Client
cd client
npm install
npm run dev

# Setup Server
cd server
npm install
npm run dev
```

## 🔒 Security Policy

This project uses RLS to protect sensitive data.
- **Products**: Publicly viewable; Admins only for modification.
- **Profiles**: Restricted to self-access and admins.
- **Orders**: Users see their own; Admins see all.

## 🌐 Deployment (Option A)

### 1. Frontend (Vercel)
- **Repo**: Connect your GitHub repository.
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://your-server-url.com/api`

### 2. Backend (Render / Railway)
- **Repo**: Connect the same GitHub repository.
- **Root Directory**: `server`
- **Start Command**: `node index.js`
- **Environment Variables**:
  - `PORT`: `5000`
  - `SUPABASE_URL`: (Your Supabase URL)
  - `SUPABASE_KEY`: (Your Service Role Key)
  - `JWT_SECRET`: (Your JWT Secret)

---

Built with ❤️ by [Iszan](https://github.com/iszan666) | [ZansMarket GitHub Repository](https://github.com/iszan666/zans-market-e-commerce-system.git)
