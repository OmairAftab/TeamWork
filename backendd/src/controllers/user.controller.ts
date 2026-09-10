import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncmiddleware.middleware";
import { getCurrentUserService } from "../services/user.service";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(200).json({
      message: "User fetch successfully",
      user,
    });
  }
);