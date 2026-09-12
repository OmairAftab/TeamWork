import {Router} from "express";
import { createTaskController , updateTaskController} from "../controllers/task.controller";

const taskRoutes=Router();


taskRoutes.post("/projects/:projectId/workspace/:workspaceId/create" , createTaskController)

taskRoutes.put("/:id/projects/:projectId/workspace/:workspaceId/update" , updateTaskController)

export default taskRoutes;