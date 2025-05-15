import "./config/env"

import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import { flowRouter } from "./routes/flow";
import { googleAuthRouter } from "./routes/gmailAuth";
import { connectedAccountRouter } from "./routes/connectedAccount";
import { invoiceRouter } from "./routes/invoice";


const app = express();
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT ?? 3000


app.use("/api/v1/user", userRouter);
app.use("/api/v1/flow", flowRouter);

app.use("/api/auth/google", googleAuthRouter);
app.use("/api/v1/connected-account", connectedAccountRouter);

app.use("/api/invoices", invoiceRouter);

app.listen(PORT)
