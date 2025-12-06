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



  // Bookings table creation
};

export { initializeDB, pool };
