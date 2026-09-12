import  TaskModel  from "../models/task.model";
import  ProjectModel  from "../models/project.model";
import  MemberModel from "../models/member.model";
import { NotFoundException } from "../utils/appError";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";
import { BadRequestException } from "../utils/appError";




export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }
  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }
  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};







export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundException(
      "Task not found or does not belong to this project"
    );
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      ...body,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { updatedTask };
};











//this service job is to Build the MongoDB query based on the filters and fetch the correct tasks.
export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {

  //suppose workspaceId = W123  then query = { workspace: "W123"};   meaning Only get tasks belonging to W123. ...this is base query
  const query: Record<string, any> = {
    workspace: workspaceId,
  };

  //if user also requested projectId lets say projectId = P123 then the query becomes : query = { workspace: "W123", project: "P123"}; Now MongoDB must find tasks matching both.
  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };  //MongoDB $in means: value can be any one of these values.  So if filters.status = ["TODO", "IN_PROGRESS"] then query.status = { $in: ["TODO", "IN_PROGRESS"] } meaning MongoDB will find tasks whose status is either TODO or IN_PROGRESS.
  }

  if (filters.priority && filters.priority?.length > 0) {
    query.priority = { $in: filters.priority };  //MongoDB $in means: value can be any one of these values.  So if filters.priority = ["HIGH", "MEDIUM"] then query.priority = { $in: ["HIGH", "MEDIUM"] } meaning MongoDB will find tasks whose priority is either HIGH or MEDIUM.
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo }; //MongoDB $in means: value can be any one of these values.  So if filters.assignedTo = ["U123", "U456"] then query.assignedTo = { $in: ["U123", "U456"] } meaning MongoDB will find tasks whose assignedTo is either U123 or U456.
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.title = { $regex: filters.keyword, $options: "i" };  //MongoDB $regex means: find tasks whose title contains the keyword.  $options: "i" means case-insensitive search.  So if filters.keyword = "task" then query.title = { $regex: "task", $options: "i" } meaning MongoDB will find tasks whose title contains "task" or "Task" or "TASK" etc.
  }

  if (filters.dueDate) {
    query.dueDate = {
      $eq: new Date(filters.dueDate),
    };
  }

  //Pagination Setup
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "_id name profilePicture -password")
      .populate("project", "_id emoji name"),
    TaskModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};









export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new NotFoundException("Task not found.");
  }

  return task;
};









export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  return;
};





