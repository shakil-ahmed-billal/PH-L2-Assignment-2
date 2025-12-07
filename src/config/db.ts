import { Pool } from "pg";
import config from "./config";

const pool = new Pool({
  connectionString: `${config.database_url}`,
});

const initializeDB = async () => {

  // user table creation
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Vehicles table creation
  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    daily_rent_price NUMERIC(10, 2) NOT NULL,
    availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available', 'booked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Bookings table creation with the correct logic for PostgreSQL
await pool.query(`
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date TIMESTAMP NOT NULL,
    rent_end_date TIMESTAMP NOT NULL CHECK (rent_end_date > rent_start_date),  -- Ensuring rent_end_date is after rent_start_date
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),  -- Ensuring total_price is positive
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
  );
`);

};

export { initializeDB, pool };
