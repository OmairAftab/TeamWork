import mongoose from 'mongoose';
import { config } from "./app.config";

let isConnected = false;

export const connectDatabase = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        const db = await mongoose.connect(config.MONGO_URI);
        isConnected = !!db.connections[0].readyState;
        console.log("Connected to mongodb atlas successfully");
    } catch (err) {
        console.error('Error connecting to database:', err);
        if (config.NODE_ENV !== "production") {
            process.exit(1);
        }
        throw err;
    }
};