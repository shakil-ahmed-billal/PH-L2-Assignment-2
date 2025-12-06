import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();
// Define booking routes here
router.post("/v1/bookings" , bookingController.createBooking);
router.get("/v1/bookings" , bookingController.getAllBookings);
router.put("/v1/bookings/:bookingId" , bookingController.updateBooking);

export const bookingRoutes = router;
