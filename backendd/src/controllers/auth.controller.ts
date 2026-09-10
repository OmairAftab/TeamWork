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




export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);  //it will pass the error to the next middleware, which is the error handler
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err); //if error occurs during login, it will pass the error to the next middleware, which is the error handler
          }

          return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);



export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout(() => undefined);
    req.session = null;

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  })