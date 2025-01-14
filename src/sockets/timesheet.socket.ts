import mongoose from "mongoose";
import timesheetController from "../controller/timesheet.controller";
import timesheetService from "../service/timesheet.service";
import { getSocketIO } from "./socketSetup";
import { Socket } from "socket.io";
import ApiError from "../utils/apiError";


export const setupTimesheetNamespace = (): Promise<void> => {

    const io = getSocketIO();

    // let users = {};

    const timesheetSocket = io.of("/timesheet");

    // timesheetSocket.use((socket: Socket, next) => {

    //     const { role, userId } = socket.data;

    //     if (role !== 'employee') { //only employee can use this
    //         return next(new ApiError(403, "Premission denied!"));
    //     }
    //     // socket.data.userID = userId;
    //     next(); //if role is employee then timesheetsocket is run
    // })


    timesheetSocket.on('connection', (socket) => {

        console.log("Client connect on timesheet socket! ", socket?.id);

        socket.on('start', async function (data) {
            try {
                // const { userId, role } = socket.data;

                console.log("Hello data is this", data);

                // const employeeId = new mongoose.Types.ObjectId(userId);
                // const projectId = new mongoose.Types.ObjectId(data?.projectId);//projectId is required when session start

                // const result: string = await timesheetService.start({ employeeId, projectId })
                const result = 123;

                // socket.emit('start:success', { sessionId: result, message: "Time start succesfully!" });
                socket.emit("start-success", "succesfully start time");

            } catch (error) {
                throw error;
            }

            socket.on('stop', async function (data) {
                try {
                    const { userId, role } = socket.data;

                    const employeeId = new mongoose.Types.ObjectId(userId);
                    const { timeId } = data;

                    await timesheetService.stop(timeId, employeeId)

                    socket.emit("stop:success", { message: "Time stop succesfully" });
                } catch (error) {
                    throw error;
                }
            });
            socket.on('resume', async function (data) {
                try {
                    const { userId, role } = socket.data;

                    const employeeId = new mongoose.Types.ObjectId(userId);
                    const { timeId } = data;

                    await timesheetService.resume(timeId, employeeId);

                    socket.emit("resume:success", { message: "Time resume succesfully" });
                } catch (error) {
                    throw error;
                }
            });
            socket.on('pause', async function (data) {
                try {
                    const { userId, role } = socket.data;

                    const employeeId = new mongoose.Types.ObjectId(userId);
                    const { timeId } = data;

                    await timesheetService.pauseTime(timeId, employeeId)

                    socket.emit("pause:success", { message: "Time pause succesfully" });
                } catch (error) {
                    throw error;
                }
            });

        });

        socket.on('reconnect', () => {
            socket.on('resume', async function (data) {
                try {
                    const { userId, role } = socket.data;

                    const employeeId = new mongoose.Types.ObjectId(userId);
                    const { timeId } = data;

                    await timesheetService.resume(timeId, employeeId);

                    socket.emit("resume:success", { message: "Time resume succesfully!" });
                } catch (error) {
                    throw error;
                }
            });
        })


        socket.on('disconnect', () => {

            socket.on('stop', async function (data) {
                try {
                    const { userId, role } = socket.data;

                    const employeeId = new mongoose.Types.ObjectId(userId);
                    const { timeId } = data;

                    await timesheetService.stop(timeId, employeeId)
                } catch (error) {
                    throw error;
                }
            });
        })

    })
    return;
}

