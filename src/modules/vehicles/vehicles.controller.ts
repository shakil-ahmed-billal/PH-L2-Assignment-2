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

const getVehicleById = async (req: Request, res: Response) => {
  // Logic to get a vehicle by ID
  try{

    const vehicleId = req.params.vehicleId;
    const result = await vehiclesService.getVehicleById(vehicleId as string);

    if(!result){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    })
  }catch(err: any){
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  // Logic to update a vehicle

  try{
    const {vehicleId} = req.params;
    const result = await vehiclesService.updateVehicle(vehicleId as string, req.body);

    if(!result){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    })

  }catch(err: any){
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  // Logic to delete a vehicle
  try{
    const {vehicleId} = req.params;
    const result = await vehiclesService.deleteVehicle(vehicleId as string);
    if(!result){
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: result,
    })
  }catch(err: any){
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
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
