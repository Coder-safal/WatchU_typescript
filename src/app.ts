import express from 'express';
import cors from "cors";
import helmet from "helmet";
import logger from "./config/logger";
import compression from "compression";
import path from "path";
// import { createServer } from 'http';
import router from "./routes/index";
import errorMiddleware from './middleware/error.middleware';
import rateLimit from "express-rate-limit";



const app = express();
// const server = createServer(app); 

// Enable trust proxy to handle 'X-Forwarded-For' headers correctly
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 'loopback, linklocal, uniquelocal' : false);

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS
        : '*'
}));
// process.env.ALLOWED_ORIGINS?.split(',')

// Rate limiting
const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(path.join(__dirname, "public", "images")));
app.use(compression());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

import swaggerUI from "swagger-ui-express";
// Import the JSON file directly
import swaggerDocument from "../docs/swagger.json";


// Setup Swagger UI
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Set the views directory to templates/pages
// app.set('views', path.join(__dirname, '/templates/pages'));

// Set the view engine to hbs
app.set('view engine', 'hbs');



// Routes
app.use('/api', router);

// Errors middleware
app.use(errorMiddleware);

export default app;
