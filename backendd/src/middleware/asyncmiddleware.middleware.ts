
import { NextFunction, Request, Response } from "express";


// This says that a controller:
// 1. Receives req (request)
// 2. Receives res (response)
// 3. Receives next (next middleware function)
// 4. Returns a Promise because the controller is async
type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;


// Create and export our asyncHandler function. asyncHandler receives an async controller as an argument. Example: asyncHandler(getUsers)
//
// The ": AsyncControllerType" after the parameter means that asyncHandler will return another function having the same controller structure.

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>

  async (req, res, next) => {

    try {

      await controller(req, res, next);

    } catch (error) {
        
      next(error);

      // Instead of handling the error inside every controller, we pass the error to Express using next(error).
      //
      // Express will then send this error to our centralized error-handling middleware. as we next defined it in index.ts
    }
  };