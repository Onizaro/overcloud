import file from './routes/file.route.js';
import user from './routes/user.route.js';
import upload from './routes/upload.routes.js';
import database from './routes/database.route.js';
import express, { json } from 'express';
import { connect } from "mongoose";
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
const PORT = process.env.PORT || 3000;

//je sais plus si on avait tranché entre 8080 ou 5173, à changer si jamais
const corsOptions = {
    origin: 'http://localhost:8085', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };
  
app.use(cors(corsOptions));

app.use(json());

connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.use("/api/files", file);
app.use("/api/users", user);
app.use("/api", upload);
app.use("/api/database", database);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
