import {Router} from "express";
import { createWorkspaceController, getAllWorkspacesUserIsMemberController, updateWorkspaceByIdController,  getWorkspaceByIdController , getAllMembersOfWorkspaceController, getWorkspaceAnalyticsController, changeWorkspaceMemberRoleController} from "../controllers/workspace.controller";

const workspaceRoutes=Router();


workspaceRoutes.post("/create/new", createWorkspaceController); 


workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController); 

workspaceRoutes.get("/:id", getWorkspaceByIdController);

workspaceRoutes.put("/update/:id", updateWorkspaceByIdController); 


workspaceRoutes.get("/members/:id", getAllMembersOfWorkspaceController);  

workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController); 


workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRoleController); 


export default workspaceRoutes;