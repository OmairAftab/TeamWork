import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncmiddleware.middleware";
import { createWorkspaceService ,
    getAllWorkspacesUserIsMemberService} from "../services/workspace.service";
import { getWorkspaceByIdService } from "../services/workspace.service";
import {
         createWorkspaceSchema,
         workspaceIdSchema
 
        } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";




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