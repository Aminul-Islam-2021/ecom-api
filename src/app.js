// import files & packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/authRoute.js";
import ProductRoutes from "./routes/productRoute.js";
import CategoryRoutes from "./routes/categoryRoute.js";
import { connectDB } from "./config/dbConfig.js";
import { errorHandler, notFound } from "./handlers/errorHandler.js";

// initialize express app
const app = express();

// import & configure database connection
connectDB();

// built-in middleware for parsing JSON
app.use(express.json());
// built-in middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));
// middleware for handling CORS (Cross-Origin Resource Sharing)
app.use(cors());
// middleware for parsing cookies
app.use(cookieParser());

// main application route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

// import routes

app.use("/api/auth", AuthRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/category", CategoryRoutes);



// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// export the app for use in other files
export default app;
