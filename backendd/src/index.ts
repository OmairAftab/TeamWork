import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import {config} from "./config/app.config";
import cors from "cors";
import session from "cookie-session";



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


app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        'message': 'Hello World!'
    });
});


app.listen(config.PORT, ()=>{
    console.log(`Server is running on port ${config.PORT}`);
})