import "./config/env"

import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import { flowRouter } from "./routes/flow";
import { gmailAuthRouter } from "./routes/gmailAuth";
import { connectedAccountRouter } from "./routes/connectedAccount";
import { invoiceRouter } from "./routes/invoice";
import { togglauthRouter } from "./routes/togglAuth";
import { clientRouter } from "./routes/client";


const app = express();
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT ?? 3000


app.use("/api/v1/user", userRouter);
app.use("/api/v1/flow", flowRouter);

app.use("/api/v1/connected-account", connectedAccountRouter);

app.use("/api/v1/client", clientRouter);
app.use("/api/v1/invoices", invoiceRouter);


app.use("/api/auth/google", gmailAuthRouter);
app.use("/api/auth/toggl", togglauthRouter);


app.listen(PORT)
