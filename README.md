# FakeStore E-Commerce App

A full-stack e-commerce application built with React, TypeScript, Redux Toolkit, React Query, and Firebase.  
The project includes authentication, product management, shopping cart, order history, unit/integration tests, and a complete CI/CD pipeline that deploys to Vercel.

## Features

- User Authentication (Register / Login / Logout) with Firebase Auth
- Product Catalog with category filtering
- Full CRUD for products (Create, Read, Update, Delete)
- Shopping Cart with Redux Toolkit + sessionStorage persistence
- Checkout that saves orders to Firestore
- Order History page for logged-in users
- Toast notifications
- Responsive design
- Unit tests & Integration tests (Jest + React Testing Library)
- CI/CD pipeline with GitHub Actions
- Automatic deployment to Vercel

## Tech Stack

**Frontend**

- React 18 + TypeScript
- Vite
- Redux Toolkit
- React Query (TanStack Query)
- React Router
- React Testing Library + Jest

**Backend / Services**

- Firebase Authentication
- Cloud Firestore
- Vercel (Hosting)

**DevOps**

- GitHub Actions (CI/CD)
- Jest for testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/lukearoehm-cloud/Fake-Store-App-Deploy.git

# Navigate into the project
cd Fake-Store-App-Deploy

# Install dependencies
npm install

# Start the development server
npm run dev
```
