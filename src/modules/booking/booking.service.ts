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
    `SELECT daily_rent_price, availability_status, vehicle_name FROM vehicles WHERE id = $1`,
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

  const bookingStatus = availability_status === "available" ? "active" : "cancelled";

  try {
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, vehicle_id, startDate, endDate, total_price, bookingStatus]
    );

    console.log(dailyRentResult.rows);

    if (result.rows && result.rows.length > 0) {

      const status = bookingStatus === "active" && "booked" ;

      await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
        [status, vehicle_id]
      );
    }

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

const getAllBookings = async (authUser: any) => {
  console.log(authUser);
   
  // Check if the user role is admin
  if (authUser.role == "admin") {
    try {

      const result = await pool.query(`
        SELECT * FROM bookings;
      `);
      return result.rows;
     
    } catch (error:any) {
      console.error("Error fetching bookings for admin:", error.message);
      throw new Error("Unable to fetch bookings for admin.");
    }
  } 

  try {
      const result = await pool.query(`
        SELECT * FROM bookings WHERE customer_id = $1;
      `, [authUser.id]);

      console.log(result);
      return result.rows;
    } catch (error:any) {
      console.error("Error fetching bookings for customer:", error.message);
      throw new Error("Unable to fetch bookings for customer.");
    }

  // // Check if the user role is customer
  // else if (authUser.role == "customer") {
    
  // } 
  // // If the role is unauthorized
  // else {
  //   throw new Error("Unauthorized action");
  // }
};

const updateBooking = async (
  bookingId: string,
  payload: Record<string, unknown>, 
  authUser: any
) => {
  const { status } = payload;

  try {
    // Check if the booking exists
    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];

    // Check if the booking's rental period has already started
    const currentDate = new Date();
    const rentStartDate = new Date(booking.rent_start_date);

    // Logic for **Customer**: They can only cancel before the rent start date
    if (authUser.role == "customer" && currentDate < rentStartDate  && booking.customer_id == authUser.id) {
      if (status == "cancelled") {
        const cancelResult = await pool.query(
          `
            UPDATE bookings
            SET status = $1
            WHERE id = $2
            RETURNING *;
          `,
          [status, bookingId]
        );
        return cancelResult.rows[0];
      } else {
        throw new Error("Customers can only cancel bookings before the start date and own bookings.");
      }
    }

    // Logic for **Admin**: They can mark a booking as "returned"
    if (authUser.role == "admin" && status == "returned") {
      // Mark the booking as returned
      const updateBookingResult = await pool.query(
        `
          UPDATE bookings
          SET status = $1
          WHERE id = $2
          RETURNING *;
        `,
        [status, bookingId]
      );

      // Also update the vehicle's availability to "available"
      const vehicleId = booking.vehicle_id;
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [vehicleId]
      );

      return updateBookingResult.rows[0];
    }

    // Logic for **System**: Auto-mark as "returned" when the period ends
    if (currentDate >= rentStartDate && status == "returned") {
      // Auto-mark booking as "returned"
      const autoReturnResult = await pool.query(
        `
          UPDATE bookings
          SET status = 'returned'
          WHERE id = $1
          RETURNING *;
        `,
        [bookingId]
      );

      // Update vehicle availability status to "available"
      const vehicleId = booking.vehicle_id;
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [vehicleId]
      );

      return autoReturnResult.rows[0];
    }

    // If no conditions match, return an error
    throw new Error("Unauthorized action or invalid status change.");

  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};


export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
