import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncmiddleware.middleware";
import { createWorkspaceService ,
    getAllWorkspacesUserIsMemberService} from "../services/workspace.service";
import { getWorkspaceByIdService , deleteWorkspaceService,  getWorkspaceMembersService, getWorkspaceAnalyticsService, changeMemberRoleService, updateWorkspaceByIdService} from "../services/workspace.service";
import {
         createWorkspaceSchema,
         workspaceIdSchema,
          changeRoleSchema,
          updateWorkspaceSchema
        } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";


export const createWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {


        const body= createWorkspaceSchema.parse(req.body); //.parse() is a Zod method used to validate the incoming data against your schema.
                                            //Take req.body, check whether it follows the rules defined in createWorkspaceSchema, and if valid, return the validated data.

        const userId=req.user?._id;

        // Call the service to create a workspace
        const workspace = await createWorkspaceService(userId, body);

        return res.status(201).json({
            message: "Workspace created successfully",
            workspace,
        });
    });






// Controller: Get all workspaces the user is part of

export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    return res.status(200).json({
      message: "User workspaces fetched successfully",
      workspaces,
    });
  }
);








export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;


    //get role of member in workspace
    await getMemberRoleInWorkspace(userId, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(200).json({
      message: "Workspace fetched successfully",
      workspace,
    });
  }
);







export const getAllMembersOfWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    //get role of member in workspace
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(200).json({
      message: "Workspace members retrieved successfully",
      members,
      roles,
    });
  }
);









export const getWorkspaceAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(200).json({
      message: "Workspace analytics retrieved successfully",
      analytics,
    });
  }
);









export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId
    );

    return res.status(200).json({
      message: "Member Role changed successfully",
      member,
    });
  }
);







export const updateWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(
      workspaceId,
      name,
      description
    );

    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace,
    });
  }
);







export const deleteWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
      workspaceId,
      userId
    );

    return res.status(200).json({
      message: "Workspace deleted successfully",
      currentWorkspace,
    });
  }
);