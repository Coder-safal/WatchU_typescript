import app from "./app";
import 'dotenv/config';
import connectDB from "./config/database";
import logger from "./config/logger";
import emailconfig from "./config/email";
// import { setupSocket } from "./sockets/socketSetup";
// import { setupTimesheetNamespace } from "./sockets/timesheet.socket";




const initilize = async (): Promise<void> => { 

    await connectDB();
    logger.info("Database connected succesfully!");

    const PORT: Number = Number(process.env.PORT) || 3000;
    emailconfig.initializeEmail();
    logger.info("Initilize email succesfully!");

    // setupSocket(server);
    // logger.info("Socket setup succesfully!");

    // setupTimesheetNamespace();
    // logger.info("TimesheetNamespace socket setup!");
    // redis


    app.listen(PORT, () => {

        logger.info(`App is listening at port ${PORT}`);
    });
}


initilize();
