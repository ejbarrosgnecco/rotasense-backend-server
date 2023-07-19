import mongoose, { Schema } from "mongoose";

const UsersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
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
    team: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    profile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true })

const database = mongoose.connection.useDb("organisations", { noListener: true });
const User = database.model("user", UsersSchema);

export default User