import User from "../../../configuration/mongoose/schemas/organisations/users";
import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { EditScheduleFields } from "../../../routes/schedules/fieldValidation/editSchedule";
import { SuccessResponse } from "../../../types.config";
import checkActionPermissions from "../utils/checkActionPermissions";

const editSchedule = async ( orgId: string, teamId: string, userId: string, params: EditScheduleFields ): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Verify that member & team belongs to organisation
        await User.findOne({ _id: userId, "organisation._id": orgId, "team._id": teamId })
            .then( async (user) => {
                // User could not found
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

                    timeslotsFormatted.sort((a, b) => new Date(`2023-02-02T${a.time}:00.000`).getTime() - new Date(`2023-02-02T${b.time}:00.000`).getTime());

                    // Fetch requested schedule
                    await Schedule.findOne({ _id: params.scheduleId, "organisation._id": orgId, "team._id": teamId })
                        .then( async (schedule) => {
                            if(!schedule) {
                                // Schedule could not be found
                                resolve({
                                    success: false,
                                    reason: "Schedule could not be found within organisation"
                                })
                            } else {
                                // Schedule was found
                                const userIndex = schedule.schedule.findIndex(i => i.member._id.toString() === userId);

                                // User could not be found to edit
                                if(userIndex === -1) return resolve({ success: false, reason: "A schedule has not yet been created for this user on this date" });

                                // Amend schedule
                                schedule.schedule[userIndex].timeslots = timeslotsFormatted

                                await schedule.save()
                                    .then(() => {
                                        resolve({
                                            success: true,
                                            data: {
                                                newSchedule: timeslotsFormatted
                                            }
                                        })
                                    })
                                    .catch((err) => {
                                        console.error(err)
        
                                        resolve({
                                            success: false,
                                            reason: "Oops there was a technical error, please try again"
                                        })
                                    })
                            }
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
    })
}

export default editSchedule