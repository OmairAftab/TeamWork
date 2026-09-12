import {Router} from "express";
import { createWorkspaceController, getAllWorkspacesUserIsMemberController, getWorkspaceByIdController , getAllMembersOfWorkspaceController, getWorkspaceAnalyticsController} from "../controllers/workspace.controller";

const workspaceRoutes=Router();


workspaceRoutes.post("/create/new", createWorkspaceController); 


workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController); 

workspaceRoutes.get("/:id", getWorkspaceByIdController); // Assuming you have a controller for fetching a workspace by ID   

workspaceRoutes.get("/members/:id", getAllMembersOfWorkspaceController); // Assuming you have a controller for fetching a workspace by ID   

workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController); // Assuming you have a controller for fetching a workspace by ID   


export default workspaceRoutes;