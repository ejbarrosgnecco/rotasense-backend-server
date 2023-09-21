import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { EditSchedulePartFields } from "../../../routes/schedules/fieldValidation/editPart";
import { SuccessResponse } from "../../../types.config";
import checkActionPermissions from "../utils/checkActionPermissions";

const editSchedulePart = async ( orgId: string, teamId: string, userId: string, params: EditSchedulePartFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Retrieve requested schedule
        await Schedule.findOne({ _id: params.scheduleId, "organisation._id": orgId, "team._id": teamId })
            .then( async (schedule) => {
                // Schedule could not be found
                if(!schedule) {
                    resolve({
                        success: false,
                        reason: "No schedule could be found within the provided ID"
                    })
                } else {
                    // Schedule has been found - continue
                    // Find user index inside schedule
                    const userIndex = schedule.schedule.findIndex(s => s.member._id.toString() === userId);

                    // User schedule could not be found
                    if(userIndex === -1) return resolve({ success: false, reason: "No schedule has been created yet for this user on this date" });

                    let existingSchedule = [ ...schedule.schedule[userIndex].timeslots ]

                    // Remove old slot from existing schedule
                    let amendedSchedule = existingSchedule.filter(slot => {
                        return !(
                            slot.action === params.prevSlot.action &&
                            new Date(`2023-02-02T${slot.time}:00.000`) >= new Date(`2023-02-02T${params.prevSlot.startTime}:00.000`) &&
                            new Date(`2023-02-02T${slot.time}:00.000`) < new Date(`2023-02-02T${params.prevSlot.endTime}:00.000`)
                        )
                    })

                    // Format new timeslot
                    let timeslotsFormatted: { time: string, action: string }[] = [];

                    for (let d = new Date(`2023-02-02T${params.newSlot.startTime}:00.000`); d < new Date(`2023-02-02T${params.newSlot.endTime}:00.000`); d.setMinutes(d.getMinutes() + 15)) {
                        timeslotsFormatted.push({
                            time: d.toTimeString().substring(0, 5),
                            action: params.newSlot.action
                        })
                    }

                    // Check for any clashes by adding new timeslot
                    const existingTimes = amendedSchedule.map(slot => slot.time)
                    const clashExists = timeslotsFormatted.some(slot => {
                        return existingTimes.includes(slot.time)
                    })

                    // Clash exists
                    if(clashExists) return resolve({ success: false, reason: "The amended timeslot would cause a clash with the existing schedule"})

                    // Check if user has access to action
                    const actionAccess = await checkActionPermissions(userId, params.newSlot.action);

                    // User does not have access
                    if(!actionAccess) return resolve({ success: false, reason: `This team member does not have access to '${params.newSlot.action}'`})

                    // Continue to add new slot
                    amendedSchedule = [...amendedSchedule, ...timeslotsFormatted].sort((a, b) => new Date(`2023-02-02T${a.time}:00.000`).getTime() - new Date(`2023-02-02T${b.time}:00.000`).getTime())

                    schedule.schedule[userIndex].timeslots = amendedSchedule;

                    await schedule.save()
                        .then(() => {
                            resolve({
                                success: true,
                                data: {
                                    amendedSchedule: amendedSchedule,
                                    newSlots: timeslotsFormatted.length
                                }
                            })
                        })
                }
            })
            .catch((err) => {
                console.error(err)

                resolve({
                    success: false,
                    reason: "Oops, there was a technical error, please try again"
                })
            })
    })
}

export default editSchedulePart