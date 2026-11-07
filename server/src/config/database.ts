import mongoose from "mongoose";
import HttpStatusCode from "../utils/httpStatusCode.js";
import { AppError } from "../utils/AppError.js";



const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new AppError(HttpStatusCode.InternalServerError, "MONGO_URI must defined"); 
    }
    const MONGO_URI = process.env.MONGODB_URI;    
    try {
        await mongoose.connect(`${MONGO_URI}`);
        console.log("connected to mongodb");
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("mongo disconnected");
    } catch (error) {
        console.error("err while disconnecting db : " , error);
    }
};

export { connectDB, disconnectDB };