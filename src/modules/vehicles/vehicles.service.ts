import { pool } from "../../config/db"

const createVehicle = async(payload: Record<string, unknown>)=>{

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;

    console.log(payload)

    const Result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
        
    if(Result.rowCount === 0){
        throw new Error("Failed to create vehicle");
    }

    return Result.rows[0];
}

const getAllVehicles = async()=>{
    const result = await pool.query(`
        SELECT * FROM vehicles;
    `);

    return result.rows;
}

export const vehiclesService = {
    createVehicle,
    getAllVehicles 
}