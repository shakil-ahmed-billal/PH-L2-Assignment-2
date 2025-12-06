import { pool } from "../../config/db";

interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBooking = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const dailyRentResult = await pool.query(
    `SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (dailyRentResult.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const daily_rent_price = dailyRentResult.rows[0].daily_rent_price;
  const availability_status = dailyRentResult.rows[0].availability_status;
  const vehicle_name = dailyRentResult.rows[0].vehicle_name || "Unknown";

  if (availability_status === "unavailable") {
    throw new Error("Vehicle is not available for booking");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  const rent_duration_in_days =
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const total_price = rent_duration_in_days * daily_rent_price;

  const status = availability_status === "available" ? "active" : "cancelled";

  try {
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, vehicle_id, startDate, endDate, total_price, status]
    );

    console.log(dailyRentResult.rows);

    return {
      ...result.rows[0],
      vehicle: {
        vehicle_name,
        daily_rent_price,
      },
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Error creating booking");
  }
};

const getAllBookings = async () => {
  const result = await pool.query(`
      SELECT * FROM bookings;
  `);

  return result.rows;
};

const updateBooking = async (
  bookingId: string,
  payload: Record<string, unknown>) => {
    
  const { status } = payload;
  const result = await pool.query(
    `
        UPDATE bookings
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `,
    [status, bookingId]
  );
  return result.rows[0];
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
