import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

let io: Server | undefined;

/**
 * Initializes the Socket.IO server.
 * @param server - The HTTP server instance.
*/
const users: { [socketId: string]: { userId: string, role: string } } = {};

// const users: { [socketId: string]** This is key** : **This is value **{ userId: string, role: string } } = {};


export function setupSocket(server: HttpServer): void {

    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    // Middleware for authentication
    /*  io.use((socket: Socket, next) => {
         const token = socket.handshake.auth.token;
 
         if (!token) {
             return next(new Error("Authentication error: Token is required"));
         }
 
         try {
             const decoded = jwt.verify(token, process.env.JWT_SECRET);
             socket.data.userId = decoded?._id;
             socket.data.role = decoded?.role;
             // Attach user data to the socket
             next(); // Allow the connection
         } catch (err) {
             next(new Error("Authentication error: Invalid token"));
         }
     }); */


    io.on("connection", (socket: Socket) => {
        console.log("New client connected:", socket.id);
        const { userId, role } = socket.data;
        users[socket.id] = { userId, role };

        const activeUsers = Object.keys(users).filter(id => users[id].role !== 'admin')
            .map(id => users[id].userId); //only active employee are shows


        // only send to admin
        if (role === 'admin') {
            socket.emit('active_users', activeUsers); //All active users
        }


        // Example evesnt listener
        socket.on("disconnect", () => {
            delete users[socket.id]; //delete disconnected users

            const updateActiveuser = Object.keys(users).filter(id => users[id].role !== 'admin').map(id => users[id].userId);

            socket.emit('active_users', updateActiveuser); //this all active users 
            console.log("Client disconnected:", socket.id);
        });
    });

    // const timesheetSocket = io.of("/timesheet");


    // timesheetSocket.on('connection', (socket) => {

    //     console.log("Client connect on timesheet socket!");


    //     socket.on('disconnect', () => {
    //         console.log("Client disconnect on timesheet socket");
    //     })
    // });
}

/**
 * Retrieves the initialized Socket.IO server instance.
 * @returns The Socket.IO server instance.
 * @throws Error if Socket.IO is not initialized.
 */
export function getSocketIO(): Server {
    if (!io) {
        throw new Error("Socket.IO is not initialized. Call setupSocket first.");
    }
    return io;
}
