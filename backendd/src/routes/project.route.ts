import {Router} from "express";
import { createProjectController , getAllProjectsInaWorkspaceController} from "../controllers/project.controller";

const projectRoutes=Router();


projectRoutes.post("/workspace/:workspaceId/create",  createProjectController);

projectRoutes.get("/workspace/:workspaceId/all",  getAllProjectsInaWorkspaceController);

export default projectRoutes;