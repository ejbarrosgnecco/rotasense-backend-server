import mongoose from "mongoose";
import User from "../../../configuration/mongoose/schemas/organisations/users";
import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { SuccessResponse } from "../../../types.config";
import { PermittedFields } from "./resources/permitted_fields";

const createSchedule = async (props: PermittedFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Verify that member & team belongs to organisation
        await User.findById(props.memberId)
            .then( async (user) => {
                if(user === null) {
                    resolve({
                        success: false,
                        reason: "No user could be found in this organisation with this name"
                    })
                } else if (user.organisation._id.toString() !== props.orgId || user.team._id.toString() !== props.teamId) {
                    resolve({
                        success: false,
                        reason: "No user could be found in this organisation with this name"
                    })
                } else {
                    // Member is found & is part of org/team
                    if(props.scheduleId) {
                        // Update existing schedule
                        await Schedule.findOne({ _id: props.scheduleId, "organisation.id": props.orgId, "team.id": props.teamId })
                            .then( async (schedule) => {
                                if(schedule === null) {
                                    // Provided schedule ID could not be found
                                    resolve({
                                        success: false,
                                        reason: "No schedule could be found with the provided ID"
                                    })
                                } else {
                                    schedule.schedule.push({
                                        member: {
                                            _id: new mongoose.Types.ObjectId(user._id),
                                            name: user.first_name + " " + user.last_name,
                                            email_address: user.email_address,
                                            role: user.role
                                        },
                                        timeslots: props.schedule
                                    })

                                    await schedule.save()
                                        .then(() => {
                                            resolve({
                                                success: true
                                            })
                                        })
                                }
                            })
                            .catch((err) => {
                                console.error(err)

                                resolve({
                                    success: false,
                                    reason: "Oops there was a technical error, please try again"
                                })
                            })
                    } else {
                        // Create new schedule
                        const newScheduleEntry = new Schedule({
                            organisation: {
                                _id: new mongoose.Types.ObjectId(user.organisation._id.toString()),
                                name: user.organisation.name
                            },
                            team: {
                                _id: new mongoose.Types.ObjectId(user.team._id.toString()),
                                name: user.team.name
                            },
                            date: props.date,
                            schedule: {
                                member: {
                                    _id: new mongoose.Types.ObjectId(user._id),
                                    name: user.first_name + " " + user.last_name,
                                    email_address: user.email_address,
                                    role: user.role
                                },
                                timeslots: props.schedule
                            }
                        })

                        await newScheduleEntry.save()
                            .then((response) => {
                                resolve({
                                    success: true,
                                    data: {
                                        scheduleId: response._id.toString()
                                    }
                                })
                            })
                    }
                }
            })
            .catch((err) => {
                console.error(err)

                resolve({
                    success: false,
                    reason: "Oops there was a technical error, please try again"
                })
            })
    })
}

export default createSchedule