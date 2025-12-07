import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = Router();
// Define booking routes here
router.post("/v1/bookings" ,auth("customer" , "admin") , bookingController.createBooking);
router.get("/v1/bookings" ,auth("admin", "customer") , bookingController.getAllBookings);
router.put("/v1/bookings/:bookingId" , auth("admin", "customer"), bookingController.updateBooking);

export const bookingRoutes = router;
