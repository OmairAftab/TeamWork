import  ProjectModel from "../models/project.model";
import { NotFoundException } from "../utils/appError";


export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();

  return { project };
};






export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  // Step 1: Find all projects in the workspace

  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize; // its key of pagination.. lets say pageNumber = 2, pageSize=10 , skip = (2 - 1) * 10 =10 .... So MongoDB skips the first 10 projects.



  const projects = await ProjectModel.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1 });   //means descending order.

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
};










export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  return { project };
};