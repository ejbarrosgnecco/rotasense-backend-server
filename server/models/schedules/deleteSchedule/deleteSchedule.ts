import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { SuccessResponse } from "../../../types.config";

const deleteSchedule = async (orgId: string, teamId: string, userId: string, scheduleId: string): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Schedule.findOne({ _id: scheduleId, "organisation._id": orgId, "team._id": teamId })
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
                
                    schedule.schedule.splice(userIndex, 1);

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

export default deleteSchedule