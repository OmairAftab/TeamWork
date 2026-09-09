import {ErrorRequestHandler} from "express";
import { AppError } from "../utils/appError";
import { z ,ZodError} from "zod";
import { Response } from "express";


const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(400).json({
    message: "Validation error",
    errors: errors,
  });
};


export const errorHandler:ErrorRequestHandler= (error, req, res, next) : any =>{

    console.error(`Error occurred on path ${req.path} `, error)

    if(error instanceof SyntaxError){
        return res.status(400).json({
            message : "Invalid json format.  Please check your request body."
        })
    }

    if(error instanceof ZodError){
        return formatZodError(res, error);
    }

    if(error instanceof AppError){
        return res.status(error.statusCode).json({         //statusCode, message and errorCode jo hum ne AppError import kiya hai us main define kiye hue hain is liye . lga kr wo access kr pa rhe
            message: error.message,
            errorCode: error.errorCode          
        })
    }

    return res.status(500).json({
        message: "  Internal server error",
        error: error.message?  error.message : "Unkonwn error occured"
    })
}