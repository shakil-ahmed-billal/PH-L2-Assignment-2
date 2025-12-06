import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  // Logic to create a vehicle
  try {
    const result = await vehiclesService.createVehicle(req.body);

    console.log(result);

    // Send the response once
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err: any) {
    // Handle error
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  // Logic to get all vehicles

  try {
    const result = await vehiclesService.getAllVehicles();
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No vehicles found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
};
