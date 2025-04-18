import "./config/env"

import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import { flowRouter } from "./routes/flow";
import { googleAuthRouter } from "./routes/auth";
import { connectedAccountRouter } from "./routes/connectedAccount";


const app = express();
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT ?? 3000


app.use("/api/v1/user", userRouter);
app.use("/api/v1/flow", flowRouter);
app.use("/api/auth/google", googleAuthRouter);
app.use("/api/v1/connected-account", connectedAccountRouter);

app.listen(PORT)
