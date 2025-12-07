# Vehicle Rental System

## Project Overview

**Vehicle Rental System** is a backend API designed for managing vehicle rentals. It allows customers to view available vehicles, create bookings, and manage their profiles, while administrators can manage vehicles, users, and bookings.

### Live URL
[[Live URL](https://assignment-2-nine-smoky.vercel.app)]

---

## Features & Technology Stack

### Features:
- **Vehicle Management**: Add, update, and remove vehicles from the system.
- **Customer Management**: Allows customers to create accounts, view vehicles, and make bookings.
- **Booking System**: Facilitates vehicle rentals, price calculation, and booking status management.
- **Authentication**: Secure login and registration with JWT token-based authentication for users and admins.

### Technology Stack:
- **Node.js** + **TypeScript**: Backend development with strong typing.
- **Express.js**: Framework for building the API.
- **PostgreSQL**: Relational database for data storage.
- **bcrypt**: For secure password hashing.
- **jsonwebtoken**: For JWT-based user authentication.

---

## Setup & Usage Instructions

To set up and run the Vehicle Rental System, follow these steps:

### Installation:
```bash
npm install
```

### Environment Variables:
- Create a `.env` file in the root directory.
- Define environment variables for the database connection and JWT secret key.

```bash
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

### Start the Server:
```bash
npm run dev
```
### Server run on port 3000
- Visit [http://localhost:3000](http://localhost:3000)

### Access the Live API:
- Visit [https://assignment-2-nine-smoky.vercel.app](https://assignment-2-nine-smoky.vercel.app)

### Prerequisites:
- **Node.js** and **npm** must be installed on your system.

### 1. Clone the Repository:
```bash
git clone <https://github.com/shakil-ahmed-billal/PH-L2-Assignment-2>
cd vehicle-rental-system
