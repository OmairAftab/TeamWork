import {Router} from "express";

import { joinWorkspaceController } from "../controllers/member.controller";


const memberRoutes=Router();


memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController); // Assuming you have a controller for fetching a workspace by ID


export default memberRoutes;