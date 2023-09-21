import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { DeletePartFields } from "../../../routes/schedules/fieldValidation/deletePart";
import { SuccessResponse } from "../../../types.config";

const deleteSchedulePart = async (orgId: string, teamId: string, userId: string, props: DeletePartFields ): Promise<SuccessResponse> => {
    // Check that time from < to
    if(new Date(`2023-02-02T${props.startTime}:00.000`) > new Date(`2023-02-02T${props.endTime}:00.000`)) {
        return {
            success: false,
            reason: "Please enter a valid time period"
        }
    }

    return await new Promise<SuccessResponse>( async (resolve) => {
        await Schedule.findOne({ _id: props.scheduleId, "organisation._id": orgId, "team._id": teamId })
            .then( async ( schedule ) => {
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

                    // Filter out the requested deletion slots
                    let newArray = [ ...schedule.schedule[userIndex].timeslots ];

                    newArray = newArray.filter(slot => {
                        return !(
                                new Date(`2023-02-02T${slot.time}:00.000`) >= new Date(`2023-02-02T${props.startTime}:00.000`)
                                &&
                                new Date(`2023-02-02T${slot.time}:00.000`) < new Date(`2023-02-02T${props.endTime}:00.000`)
                                &&
                                slot.action === props.action
                            )
                    })

                    if(newArray.length > 0) {
                        schedule.schedule[userIndex].timeslots = newArray;
                    } else {
                        schedule.schedule.splice(userIndex, 1);
                    }

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

export default deleteSchedulePart