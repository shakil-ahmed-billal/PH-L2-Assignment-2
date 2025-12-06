import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// Sample route for authentication
router.post("/v1/auth/signup", AuthController.signUpUser);
router.post("/v1/auth/signin", AuthController.signInUser);

export const authRoutes = router;
