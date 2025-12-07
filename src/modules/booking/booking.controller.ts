import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  // Logic to create a booking
  try {
    const result = await bookingService.createBooking(req.body);

    console.log(result);
    // Send the response once
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
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

const getAllBookings = async (req: Request, res: Response) => {
  // Logic to get all bookings
  try {

    const authUser = (req as any).user;

    const result = await bookingService.getAllBookings(authUser);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
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

const updateBooking = async (req: Request, res: Response) => {
  // Logic to update a booking

  const authUser = (req as any).user; 

  try{
    const { bookingId } = req.params;
    const result = await bookingService.updateBooking(bookingId as string, req.body , authUser);

    if(!result){
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
        success: true,
        message: "Booking updated successfully",
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

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
