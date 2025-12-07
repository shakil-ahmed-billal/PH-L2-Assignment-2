import { Request, Response } from "express";
import { userService } from "./user.service";

const getALlUsers = async (req: Request, res: Response) => {
  // Logic to get all users
  try {
    const result = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
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
const updateUser = async (req: Request, res: Response) => {
  // Logic to update a user
  try {
    const { userId } = req.params;
    const authUser = (req as any).user;
    const result = await userService.updateUser(userId as string, req.body , authUser);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  // Logic to delete a user
  try {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
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

export const userController = {
  getALlUsers,
  updateUser,
  deleteUser,
};
