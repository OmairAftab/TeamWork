import mongoose from 'mongoose';
import { config } from "./app.config";

export const connectDatabase= async ()=>{
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to monogdb atlas successfully");
    }
    catch(err){
        console.error('Error connecting to database:', err);
        process.exit(1); // Exit the process with an error code
    }
}