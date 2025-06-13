// import files & packages
import mongoose from "mongoose";
// dotenv is used to load environment variables from a .env file
import dotenv from "dotenv";
// configure the dotenv package
dotenv.config();

// This function connects to the MongoDB database using Mongoose.
// It reads the MongoDB URI from environment variables and logs success or error messages accordingly.
// If the connection fails, it logs the error message and exits the process with a failure code.
// Make sure to set the MONGODB_URI environment variable in your .env file.

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(`Error connecting to Database : ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};
