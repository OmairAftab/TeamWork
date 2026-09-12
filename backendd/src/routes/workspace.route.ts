import {Router} from "express";
import { createWorkspaceController, getAllWorkspacesUserIsMemberController, getWorkspaceByIdController , getAllMembersOfWorkspaceController, getWorkspaceAnalyticsController} from "../controllers/workspace.controller";

const workspaceRoutes=Router();


workspaceRoutes.post("/create/new", createWorkspaceController); 


workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController); 

workspaceRoutes.get("/:id", getWorkspaceByIdController); 

workspaceRoutes.get("/members/:id", getAllMembersOfWorkspaceController);  

workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController); 


// workspaceRoutes.put("/change/member/role/:id", changeWorkspaceMemberRoleController); 


export default workspaceRoutes;