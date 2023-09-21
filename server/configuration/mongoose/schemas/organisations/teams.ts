import mongoose, { Schema } from "mongoose";

const TeamsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true 
            },
            name: {
                type: String,
                required: true
            }
        },
        required: false
    },
    organisation: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    },
    operatingHours: {
        type: {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            }
        }
    },
    actions: [{
        action: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: false
        },
        restricted: {
            type: Boolean,
            required: false,
            default: false
        },
        restrictedTo: {
            type: [String],
            required: false
        }
    }],
    manager: {
        type: {
            _id: {
                type: mongoose.Types.ObjectId,
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
    },
    roles: {
        type: [String],
        required: false
    }
}, { timestamps: true })

const database = mongoose.connection.useDb("organisations", { noListener: true });
const Team = database.model("team", TeamsSchema);

export default Team