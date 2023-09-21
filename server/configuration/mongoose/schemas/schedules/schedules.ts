import mongoose, { Schema } from "mongoose";

const SchedulesSchema = new Schema({
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
    date: {
        type: String,
        index: true,
        required: true
    },
    team: {
        type: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                index: true
            },
            name: {
                type: String,
                required: true
            }
        }
    },
    schedule: {
        type: [
            {
                member: {
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
                        },
                        role: {
                            type: String,
                            required: true
                        }
                    }
                },
                timeslots: [
                    {
                        time: {
                            type: String,
                            required: true
                        },
                        action: {
                            type: String,
                            required: true
                        }
                    }
                ]
            }
        ],
        required: true
    }
}, { timestamps: true })

const database = mongoose.connection.useDb("schedules", { noListener: true });
const Schedule = database.model("schedule", SchedulesSchema);

export default Schedule