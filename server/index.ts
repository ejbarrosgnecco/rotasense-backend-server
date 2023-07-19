import mongoose from "mongoose";
import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import MONGO_CONNECTION_STRING from "./configuration/mongoose/connection_string";
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
import account_routes from "./routes/account/account";

//-- Schedules
import schedule_routes from "./routes/schedules/schedules";

//-- Organisation
import organisation_routes from "./routes/organisation/organisation";

// App configuration
const app = express();
app.use(bodyParser.json())
app.use(cors());

// Route declarations
//-- Account
app.use("/account", account_routes);

//-- Schedules
app.use("/schedules", schedule_routes);

//-- Organisation
app.use("/organisation", organisation_routes)

console.log("Connecting...")
mongoose.connect(MONGO_CONNECTION_STRING)
    .then(() => {
        app.listen(5002, () => {
            console.log("Server listening on port 5002")
        })
    })