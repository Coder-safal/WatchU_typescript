import server from "./app";
import 'dotenv/config';
import connectDB from "./config/database";
import logger from "./config/logger";
import emailconfig from "./config/email";




const initilize = async (): Promise<void> => {

    await connectDB();
    logger.info("Database connected succesfully!");

    const PORT: Number = Number(process.env.PORT) || 3000;
    emailconfig.initializeEmail();
    logger.info("Initilize email succesfully!");


    // redis

    server.listen(PORT, () => {

        logger.info(`App is listening at port ${PORT}`);
    });
}


initilize();
