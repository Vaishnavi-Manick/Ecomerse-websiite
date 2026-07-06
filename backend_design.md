# Backend Design for Verve E-commerce

## 1. Overview
The backend for Verve will be a RESTful API built using Node.js, Express, and MongoDB. It will handle user authentication, product management, order processing, and other core e-commerce functionalities.

## 2. Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, cors, helmet

## 3. Database Schema

### User
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Required)
- `isAdmin`: Boolean (Default: false)

### Product
- `name`: String (Required)
- `image`: String (Required)
- `category`: String (Required)
- `description`: String
- `rating`: Number (Default: 0)
- `numReviews`: Number (Default: 0)
- `price`: Number (Required)
- `originalPrice`: Number
- `stock`: Number (Required, Default: 0)
- `tags`: [String] (e.g., 'featured', 'bestseller', 'flash')

### Category
- `name`: String (Required)
- `icon`: String

### Order
- `user`: ObjectId (Ref: User)
- `orderItems`: [Array of product details]
- `shippingAddress`: { address, city, postalCode, country }
- `paymentMethod`: String
- `totalPrice`: Number
- `isPaid`: Boolean
- `paidAt`: Date
- `isDelivered`: Boolean
- `deliveredAt`: Date

### Testimonial
- `name`: String
- `role`: String
- `text`: String

## 4. API Endpoints

### Auth/Users
- `POST /api/users/login`: Authenticate user & get token
- `POST /api/users/register`: Register a new user
- `GET /api/users/profile`: Get user profile (Private)
- `PUT /api/users/profile`: Update user profile (Private)

### Products
- `GET /api/products`: Get all products (with optional tag/category filters)
- `GET /api/products/:id`: Get product by ID
- `POST /api/products`: Create a product (Admin only)
- `PUT /api/products/:id`: Update a product (Admin only)
- `DELETE /api/products/:id`: Delete a product (Admin only)

### Categories
- `GET /api/categories`: Get all categories

### Orders
- `POST /api/orders`: Create new order (Private)
- `GET /api/orders/myorders`: Get logged in user orders (Private)
- `GET /api/orders/:id`: Get order by ID (Private)

### Testimonials
- `GET /api/testimonials`: Get all testimonials

## 5. Implementation Steps
1. Initialize Node.js project.
2. Set up Express server and MongoDB connection.
3. Define Mongoose models.
4. Implement Authentication middleware.
5. Create controllers and routes for each entity.
6. Seed database with initial dummy data.
7. Test API endpoints.
