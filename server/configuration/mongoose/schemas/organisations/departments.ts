import mongoose, { Schema } from "mongoose";

const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    organisation: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true
        }
    },
    team_count: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true })

const database = mongoose.connection.useDb("organisations", { noListener: true })
const Department = database.model("department", DepartmentSchema);

export default Department