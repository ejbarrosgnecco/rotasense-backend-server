import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { SuccessResponse } from "../../../types.config";
import checkActionPermissions from "../utils/checkActionPermissions";

const addSchedulePart = async (
    orgId: string,
    teamId: string,
    userId: string,
    scheduleId: string,
    newPart: { action: string, startTime: string, endTime: string }
): Promise<SuccessResponse> => {
    // Check that time from < to
    if(new Date(`2023-02-02T${newPart.startTime}:00.000`) > new Date(`2023-02-02T${newPart.endTime}:00.000`)) {
        return {
            success: false,
            reason: "Please enter a valid time period"
        }
    }

    return await new Promise<SuccessResponse>( async (resolve) => {
        // Retrieve requested schedule
        await Schedule.findOne({ _id: scheduleId, "organisation._id": orgId, "team._id": teamId })
            .then( async (schedule) => {
                // Schedule Id could not be found
                if(schedule === null) {
                    resolve({
                        success: false,
                        reason: "No schedule could be found with the provided ID"
                    })
                } else {
                    // Schedule has been found - continue
                    // Find user index inside schedule
                    const userIndex = schedule.schedule.findIndex(s => s.member._id.toString() === userId);

                    // User schedule could not be found
                    if(userIndex === -1 ) return resolve({ success: false, reason: "No schedule has been created yet for this user on this date" });

                    // Verify that the user has permissions to use this action
                    const permissionForAction = await checkActionPermissions(userId, newPart.action);
                    if(!permissionForAction) return resolve({ success: false, reason: "User does not have permission to use this action" })

                    // Format schedule parts
                    let timeslotsFormatted: { time: string, action: string }[] = [];

                    const fromTime = new Date(`2023-02-02T${newPart.startTime}:00.000Z`);
                    const toTime = new Date(`2023-02-02T${newPart.endTime}:00.000Z`);

                    for (let d = fromTime; d < toTime; d.setMinutes(d.getMinutes() + 15)) {
                        timeslotsFormatted.push({
                            time: d.toTimeString().substring(0, 5),
                            action: newPart.action
                        })
                    }

                    // Check that schedule parts haven't been used before
                    const existingSchedule = schedule.schedule[userIndex].timeslots;

                    const noOverlaps: boolean = timeslotsFormatted.some(slot => {
                        return !existingSchedule.some(existingSlot => {
                            return existingSlot.time === slot.time
                        })
                    })

                    if(!noOverlaps) return resolve({ success: false, reason: "This new slot would cause an overlap within the existing schedule"})

                    // Proceed to add slot values into schedule
                    schedule.schedule[userIndex].timeslots = [...existingSchedule, ...timeslotsFormatted].sort((a, b) => new Date(`2023-02-02T${a.time}:00.000`).getTime() - new Date(`2023-02-02T${b.time}:00.000`).getTime())

                    await schedule.save()
                        .then(() => {
                            resolve({
                                success: true
                            })
                        })
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

export default addSchedulePart