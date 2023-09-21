import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import User from "../../../configuration/mongoose/schemas/organisations/users";
import { DuplicateScheduleFields } from "../../../routes/schedules/fieldValidation/duplicateSchedule";
import { SuccessResponse } from "../../../types.config";
import checkActionPermissions from "../utils/checkActionPermissions";
import mongoose from "mongoose";

const duplicateSchedule = async ( orgId: string, teamId: string, originUserId: string, params: DuplicateScheduleFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Retrieve requested schedule
        await Schedule.findOne({ _id: params.scheduleId, "organisation._id": orgId, "team._id": teamId })
            .then( async (schedule) => {
                if(schedule === null) {
                    resolve({
                        success: false,
                        reason: "No schedule could be found with the provided ID"
                    })
                } else {
                    // Schedule has been found - continue
                    // Find user index inside schedule
                    const userIndex = schedule.schedule.findIndex(s => s.member._id.toString() === originUserId);

                    // User schedule could not be found
                    if(userIndex === -1 ) return resolve({ success: false, reason: "No schedule has been created yet for this user on this date" });

                    // See if there are any restricted actions unavailable to destination user
                    const timeslots = schedule.schedule[userIndex].timeslots;
                    const uniqueActions = timeslots.map(slot => slot.action).filter((action, i, arr) => {
                        return arr.indexOf(action) === i
                    })

                    let restrictedActions: string[] = [];

                    for (let i = 0; i < uniqueActions.length; i++) {
                        const action = uniqueActions[i];
                        
                        const valid = await checkActionPermissions(params.destinationUserId, action);
                        if(!valid) restrictedActions.push(action)
                    }

                    let scheduleCopy = [...timeslots];

                    // Remove restricted actions if unavailable
                    if(restrictedActions.length > 0) {
                        scheduleCopy = scheduleCopy.filter(slot => !restrictedActions.includes(slot.action))
                    }

                    // Verify destination user & get details
                    const destinationUser = await User.findOne({ _id: params.destinationUserId, "organisation._id": orgId, "team._id": teamId });

                    // User not found
                    if(!destinationUser) return resolve({ success: false, reason: "'Copy to' user could not be found within organisation"})

                    // Iterate through each date to add schedule
                    for (let i = 0; i < params.dates.length; i++) {
                        const date = params.dates[i];
                        
                        // If date is same as source
                        if(date === schedule.date) {
                            const newUserIndex = schedule.schedule.findIndex(s => s.member._id.toString() === params.destinationUserId);

                            // Schedule exists (Overwrite)
                            if(newUserIndex > -1) {
                                schedule.schedule[newUserIndex].timeslots = scheduleCopy
                            } else {
                                // Create new schedule entry
                                schedule.schedule.push({
                                    member: {
                                        _id: new mongoose.Types.ObjectId(params.destinationUserId),
                                        name: destinationUser.firstName + " " + destinationUser.lastName,
                                        emailAddress: destinationUser.emailAddress,
                                        role: destinationUser.role
                                    },
                                    timeslots: scheduleCopy
                                })
                            }

                            await schedule.save()
                        } else {
                            // If date is another date different to source
                            await Schedule.findOne({ date: date, "organisation._id": orgId, "team._id": teamId })
                                .then( async (dateSchedule) => {
                                    if(dateSchedule === null) {
                                        // Create a new schedule record
                                        const newScheduleEntry = new Schedule({
                                            organisation: {
                                                _id: new mongoose.Types.ObjectId(orgId),
                                                name: destinationUser.organisation.name
                                            },
                                            team: {
                                                _id: new mongoose.Types.ObjectId(teamId),
                                                name: destinationUser.team.name
                                            },
                                            date: date,
                                            schedule: [
                                                {
                                                    member: {
                                                        _id: new mongoose.Types.ObjectId(params.destinationUserId),
                                                        name: destinationUser.firstName + " " + destinationUser.lastName,
                                                        emailAddress: destinationUser.emailAddress,
                                                        role: destinationUser.role
                                                    },
                                                    timeslots: scheduleCopy 
                                                }
                                            ]
                                        })

                                        await newScheduleEntry.save();
                                    } else {
                                        // Find user entry inside of schedule
                                        const newUserIndex = dateSchedule.schedule.findIndex(s => s.member._id.toString() === params.destinationUserId);
                                        
                                        // Schedule exists (Overwrite)
                                        if(newUserIndex > -1) {
                                            dateSchedule.schedule[newUserIndex].timeslots = scheduleCopy
                                        } else {
                                            // Create new schedule entry
                                            dateSchedule.schedule.push({
                                                member: {
                                                    _id: new mongoose.Types.ObjectId(params.destinationUserId),
                                                    name: destinationUser.firstName + " " + destinationUser.lastName,
                                                    emailAddress: destinationUser.emailAddress,
                                                    role: destinationUser.role
                                                },
                                                timeslots: scheduleCopy
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

                    let returnObject: SuccessResponse = {
                        success: true
                    }

                    if(params.dates.includes(schedule.date)) {
                        returnObject.data = {
                            newSchedule: scheduleCopy
                        }
                    }

                    resolve(returnObject)
                }
            })
            .catch((err) => {
                console.error(err);

                resolve({
                    success: false,
                    reason: "Oops, there was a technical error, please try again"
                })
            })
    })
}

export default duplicateSchedule