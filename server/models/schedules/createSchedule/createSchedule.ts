import mongoose from "mongoose";
import User from "../../../configuration/mongoose/schemas/organisations/users";
import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { CreateScheduleFields } from "../../../routes/schedules/fieldValidation/createSchedule";
import { SuccessResponse } from "../../../types.config";
import checkActionPermissions from "../utils/checkActionPermissions";

const createSchedule = async ( orgId: string, teamId: string, userId: string, params: CreateScheduleFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Verify that member & team belongs to organisation
        await User.findOne({ _id: userId, "organisation._id": orgId, "team._id": teamId })
            .then( async (user) => {
                // User could not be found
                if(!user) {
                    resolve({
                        success: false,
                        reason: "User could not be found within organisation"
                    })
                } else {
                    // User is found
                    // See if there are any restricted actions unavailable to user
                    const timeslots = params.schedule;
                    const uniqueActions = timeslots.map(slot => slot.action).filter((action, i, arr) => {
                        return arr.indexOf(action) === i
                    })

                    let restrictedActions: string[] = [];

                    for (let i = 0; i < uniqueActions.length; i++) {
                        const action = uniqueActions[i];
                        
                        const valid = await checkActionPermissions(userId, action);
                        if(!valid) restrictedActions.push(action)
                    }

                    if(restrictedActions.length > 0) return resolve({ success: false, reason: "Action(s) in this schedule are not available to this user"});

                    // Format schedule timeslots
                    let timeslotsFormatted: { time: string, action: string }[] = [];

                    params.schedule.forEach(part => {
                        const fromTime = new Date(`2023-02-02T${part.startTime}:00.000Z`);
                        const toTime = new Date(`2023-02-02T${part.endTime}:00.000Z`);
    
                        for (let d = fromTime; d < toTime; d.setMinutes(d.getMinutes() + 15)) {
                            timeslotsFormatted.push({
                                time: d.toTimeString().substring(0, 5),
                                action: part.action
                            })
                        }
                    })

                    timeslotsFormatted.sort((a, b) => new Date(`2023-02-02T${a.time}:00.000`).getTime() - new Date(`2023-02-02T${b.time}:00.000`).getTime())

                    let newScheduleId: string = "";

                    // Fetch requested schedule
                    if(params.scheduleId) {
                        await Schedule.findOne({ _id: params.scheduleId, "organisation._id": orgId, "team._id": teamId })
                            .then( async (schedule) => {
                                if(!schedule) {
                                    // Schedule could not be found
                                    resolve({
                                        success: false,
                                        reason: "Schedule could not be found within organisation"
                                    })
                                } else {
                                    // Ensure that schedule hasn't already been created for this user
                                    const userIndex = schedule.schedule.findIndex(i => i.member._id.toString() === userId);

                                    // Schedule already exists
                                    if(userIndex > -1) resolve({ success: false, reason: "A schedule already exists for this user on this date" })

                                    // Add schedule
                                    schedule.schedule.push({
                                        member: {
                                            _id: new mongoose.Types.ObjectId(userId),
                                            name: user.firstName + " " + user.lastName,
                                            emailAddress: user.emailAddress,
                                            role: user.role
                                        },
                                        timeslots: timeslotsFormatted
                                    })

                                    await schedule.save()
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
                        // No scheduleId provided 
                        const newScheduleEntry = new Schedule({
                            organisation: {
                                _id: new mongoose.Types.ObjectId(orgId),
                                name: user.organisation.name
                            },
                            team: {
                                _id: new mongoose.Types.ObjectId(teamId),
                                name: user.team.name
                            },
                            date: params.date,
                            schedule: [
                                {
                                    member: {
                                        _id: new mongoose.Types.ObjectId(userId),
                                        name: user.firstName + " " + user.lastName,
                                        emailAddress: user.emailAddress,
                                        role: user.role
                                    },
                                    timeslots: timeslotsFormatted 
                                }
                            ]
                        })

                        await newScheduleEntry.save()
                            .then((response) => {
                                newScheduleId = response._id.toString()
                            })
                    }

                    if(params.repeatDates && params.repeatDates.length > 0) {
                        // Iterate through each repeat date to create repeat schedules
                        for (let i = 0; i < params.repeatDates.length; i++) {
                            const date = params.repeatDates[i];
                            
                            await Schedule.findOne({ date: date, "organisation._id": orgId, "team._id": teamId })
                                .then( async (dateSchedule) => {
                                    if(dateSchedule === null) {
                                        // Create a new schedule record
                                        const newScheduleEntry = new Schedule({
                                            organisation: {
                                                _id: new mongoose.Types.ObjectId(orgId),
                                                name: user.organisation.name
                                            },
                                            team: {
                                                _id: new mongoose.Types.ObjectId(teamId),
                                                name: user.team.name
                                            },
                                            date: date,
                                            schedule: [
                                                {
                                                    member: {
                                                        _id: new mongoose.Types.ObjectId(userId),
                                                        name: user.firstName + " " + user.lastName,
                                                        emailAddress: user.emailAddress,
                                                        role: user.role
                                                    },
                                                    timeslots: timeslotsFormatted 
                                                }
                                            ]
                                        })

                                        await newScheduleEntry.save();
                                    } else {
                                        // Find user entry inside of schedule
                                        const newUserIndex = dateSchedule.schedule.findIndex(s => s.member._id.toString() === userId);
                                        
                                        // Schedule exists (Overwrite)
                                        if(newUserIndex > -1) {
                                            dateSchedule.schedule[newUserIndex].timeslots = timeslotsFormatted
                                        } else {
                                            // Create new schedule entry
                                            dateSchedule.schedule.push({
                                                member: {
                                                    _id: new mongoose.Types.ObjectId(userId),
                                                    name: user.firstName + " " + user.lastName,
                                                    emailAddress: user.emailAddress,
                                                    role: user.role
                                                },
                                                timeslots: timeslotsFormatted
                                            })
                                        }

                                        await dateSchedule.save();
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);

                                    return resolve({
                                        success: false,
                                        reason: "Oops, there was a technical error, please try again"
                                    })
                                })
                        }
                    }

                    resolve({
                        success: true,
                        data: {
                            newSchedule: timeslotsFormatted,
                            scheduleId: newScheduleId || undefined
                        }
                    })
                }
            })
    })
}

export default createSchedule