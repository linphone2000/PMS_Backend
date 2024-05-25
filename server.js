import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import cors from 'cors';
// import { errorHandler } from './middleware/errorMiddleware.js';

// env and db
dotenv.config();
connectDB();

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoute);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
