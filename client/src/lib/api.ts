import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AllWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  DeleteTaskPayloadType,
  DeleteWorkspaceResponseType,
  EditProjectPayloadType,
  EditTaskPayloadType,
  EditWorkspaceType,
  LoginResponseType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  TaskType,
  WorkspaceByIdResponseType,
  loginType,
  registerType,
} from "@/types/api.type";

// ********* AUTH ****************
export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const logoutMutationFn = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

// ********* WORKSPACE ****************
export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post("/workspace/create/new", data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType): Promise<CreateWorkspaceResponseType> => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<DeleteWorkspaceResponseType> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

export const getAllMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

// ******* MEMBER ****************
export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{ message: string; workspaceId: string }> => {
  const response = await API.post(`/member/workspace/${inviteCode}/join`);
  return response.data;
};

// ********* PROJECTS ****************
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageNumber,
  pageSize,
  keyword,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(`/project/workspace/${workspaceId}/all`, {
    params: { pageNumber, pageSize, keyword },
  });
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{ message: string }> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

// ******* TASKS ********************************
export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType): Promise<{ message: string; task: TaskType }> => {
  const response = await API.post(
    `/task/projects/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const updateTaskMutationFn = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{ message: string; task: TaskType }> => {
  const response = await API.put(
    `/task/${taskId}/projects/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  projectId,
  keyword,
  priority,
  status,
  assignedTo,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const response = await API.get(`/task/workspace/${workspaceId}/all`, {
    params: {
      projectId: projectId || undefined,
      keyword: keyword || undefined,
      priority: priority || undefined,
      status: status || undefined,
      assignedTo: assignedTo || undefined,
      dueDate: dueDate || undefined,
      pageNumber: pageNumber || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return response.data;
};

export const deleteTaskMutationFn = async ({
  taskId,
  workspaceId,
}: DeleteTaskPayloadType): Promise<{ message: string }> => {
  const response = await API.delete(
    `/task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};
