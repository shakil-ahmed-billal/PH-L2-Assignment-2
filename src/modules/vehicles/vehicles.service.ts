import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  console.log(payload);

  const Result = await pool.query(
    `
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  if (Result.rowCount === 0) {
    throw new Error("Failed to create vehicle");
  }

  return Result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`
        SELECT * FROM vehicles;
    `);

  console.log(result.rows);

  return result.rows;
};

const getVehicleById = async (vehicleId: string) => {
  const result = await pool.query(
    `
        SELECT * FROM vehicles WHERE id = $1;
    `,
    [vehicleId]
  );
  return result.rows[0];
};

const updateVehicle = async (
  vehicleId: string,
  payload: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
        UPDATE vehicles
        SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5
        WHERE id = $6
        RETURNING *;
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );
  return result.rows[0];
};

const deleteVehicle = async (vehicleId: string) => {

  // Delete vehicle (only if no active bookings exist)
  const findBooking = await pool.query(
    `
        SELECT * FROM bookings WHERE vehicle_id = $1;
    `,
    [vehicleId]
  );

console.log(findBooking.rows)
  if (findBooking.rows) {
    
  }

  const checkBooking = findBooking.rowCount as any > 0 && findBooking?.rows.find((booking: any) => booking?.status == "active")

 
  if (checkBooking.status == "active") {
    throw new Error("Cannot delete vehicle with active bookings");
  } else {
    const result = await pool.query(
      `
        DELETE FROM vehicles WHERE id = $1 RETURNING *;
    `,
      [vehicleId]
    );
    return result.rows[0];
  }
};

export const vehiclesService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
