// Express
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// Database
import connectDB from "./config/db.js";
// Routes
import userRoute from "./routes/userRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
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
app.use("/api/suppliers", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    data: {
      users: [],
      suppliers: [],
      inventory: [],
      orders: [],
      customers: [],
    },
  });
});

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
