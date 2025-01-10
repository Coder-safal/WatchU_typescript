import mongoose from "mongoose";
import logger from "./logger";


const connectDB = async (): Promise<void> => {

    try {
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            throw new Error('Database URI is missing from .env');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB Connected ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDb connection Error: ${error}`);
        process.exit(1);


    }
}


export default connectDB;