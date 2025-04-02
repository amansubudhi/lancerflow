import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import dotenv from "dotenv"
import { flowRouter } from "./routes/flow";

dotenv.config();


const app = express();
app.use(express.json())
app.use(cors())


app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", flowRouter);
