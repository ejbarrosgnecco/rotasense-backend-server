import mongoose, { Schema } from "mongoose";

const OrganisationsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    employeeSize: {
        type: String,
        required: true
    },
    owner: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            emailAddress: {
                type: String,
                required: true
            }
        }
    }
}, { timestamps: true })

const database = mongoose.connection.useDb("organisations", { noListener: true });
const Organisation = database.model("organisation", OrganisationsSchema);

export default Organisation