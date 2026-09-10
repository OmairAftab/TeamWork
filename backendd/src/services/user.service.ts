import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")            //"Don't just give me the workspace ID; go to the Workspace collection and give me the actual workspace data."
    .select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return {
    user,
  };
};