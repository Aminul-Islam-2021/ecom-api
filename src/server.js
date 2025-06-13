// import packages & files
import app from "./app.js";
// dotenv is used to load environment variables from a .env file
import dotenv from "dotenv";
// configure the dotenv package
dotenv.config();

// initialize the port
const port = process.env.PORT || 5000;

// start the server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
