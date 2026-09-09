import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import {config} from "./config/app.config";
import cors from "cors";
import session from "cookie-session";
import { connectDatabase } from "./config/database.config";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { asyncHandler } from "./middleware/asyncmiddleware.middleware";
import { ErrorCodeEnum, ErrorCodeEnumType } from "./enums/error-code.enum";
import { BadRequestException } from "./utils/appError";
import { HTTPSTATUS } from "./config/http.config";

const app=express();
const BASE_PATH=config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
    })
)

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
)


app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);


//imported from middleware/errorhandler.config.ts
app.use(errorHandler);


app.listen(config.PORT, async ()=>{
    console.log(`Server is running on port ${config.PORT}`);
    await connectDatabase();
})