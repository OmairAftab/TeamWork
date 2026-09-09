import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncmiddleware.middleware";
import { config } from "../config/app.config";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import passport from "passport";
import { registerSchema } from "../validation/auth.validation";


//AUTH.ROUTE.TS AND YE WALI FILE ABHI COMPLETE NHI KI

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);



export const registerUserController= asyncHandler(
  async(req: Request, res: Response) => {
    const body=registerSchema.parse({              //3. Validate the body with Zod as we set in auth.validation.ts
      ...req.body
    })

    await registerUserService(body);

    return res.status(201).json({
      message: "User registered successfully",
    });
  }
)
