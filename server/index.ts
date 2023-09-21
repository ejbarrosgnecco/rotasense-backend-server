import mongoose from "mongoose";
import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import MONGO_CONNECTION_STRING from "./configuration/mongoose/connectionString";
import { UserRecord } from "./types.config";

declare global {
    namespace Express {
        interface Request {
            user: UserRecord
        }
    }
}

// Route imports
//-- Account
import accountRoutes from "./routes/account/account";

//-- Schedules
import scheduleRoutes from "./routes/schedules/schedules";

//-- Organisation
import organisationRoutes from "./routes/organisation/organisation";

// App configuration
const app = express();
app.use(bodyParser.json())
app.use(cors({
    methods: ["POST", "PUT", "GET", "DELETE", "COPY"]
}));

// Route declarations
//-- Account
app.use("/account", accountRoutes);

//-- Schedules
app.use("/schedules", scheduleRoutes);

//-- Organisation
app.use("/organisation", organisationRoutes);

console.log("Connecting...");
mongoose.connect(MONGO_CONNECTION_STRING)
    .then(() => {
        app.listen(5002, () => {
            console.log("Server listening on port 5002")
        })
    })