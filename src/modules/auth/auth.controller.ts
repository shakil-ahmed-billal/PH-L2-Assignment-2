import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  // Implementation for user signup
  try {
    const insertedData = await AuthService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: {
        name: insertedData.name,
        email: insertedData.email,
        phone: insertedData.phone,
        role: insertedData.role,
        id: insertedData.id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const signInUser = async (req: Request, res: Response) => {
  // Implementation for user signin

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Further implementation goes here
    const user = await AuthService.signInUser(email, password);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const AuthController = {
  signUpUser,
  signInUser,
};
