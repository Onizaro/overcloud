import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import AWS from 'aws-sdk';
import user from './routes/user.route.js';
import upload from './routes/upload.routes.js';
import database from './routes/database.route.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:8085',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(json());

// Configuration AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.locals.dynamoDB = dynamoDB;

app.use("/api/users", user);
app.use("/api", upload);
app.use("/api/database", database);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
