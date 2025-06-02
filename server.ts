require("rootpath")();
import express from "express";
import cors from "cors";
import errorHandler from "./_middleware/error-handler";
import dotenv from "dotenv";
import { initializeDb } from "./_helpers/db";
import employeeRoutes from "./employees/employees.controller";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/employees", employeeRoutes);
app.use(errorHandler);

const port = process.env.NODE_ENV === "production" ? (process.env.PORT || 80) : 4000;

async function startServer() {
  try {
    await initializeDb();
    app.listen(port, () => console.log(`App listening on port ${port}`));
  } catch (error) {
    console.error("Failed to initialize the database or start the server:", error);
    process.exit(1);
  }
}

startServer();
