# Verve E-commerce Backend

This is the backend for the Verve e-commerce website, built with Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based login and registration.
- **Product Management**: CRUD operations for products (Admin restricted for write).
- **Category Management**: Retrieve and manage product categories.
- **Order System**: Create and view orders for authenticated users.
- **Testimonials**: Manage customer testimonials.
- **Security**: Password hashing with bcrypt, protection with Helmet, and CORS enabled.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/verve
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

### Data Seeding
To populate the database with initial dummy data:
```bash
npm run data:import
```
To clear the database:
```bash
npm run data:destroy
```

### Running the Server
- Development mode (with nodemon):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

## API Endpoints

### Users
- `POST /api/users` - Register a user
- `POST /api/users/login` - Login & get token
- `GET /api/users/profile` - Get user profile (Private)
- `PUT /api/users/profile` - Update user profile (Private)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create a product (Admin only)

### Orders
- `POST /api/orders` - Create new order (Private)
- `GET /api/orders/myorders` - Get user orders (Private)
- `GET /api/orders/:id` - Get order by ID (Private)

### Categories & Testimonials
- `GET /api/categories` - Get all categories
- `GET /api/testimonials` - Get all testimonials
