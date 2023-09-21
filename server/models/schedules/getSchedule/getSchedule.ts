import Team from "../../../configuration/mongoose/schemas/organisations/teams";
import User from "../../../configuration/mongoose/schemas/organisations/users";
import Schedule from "../../../configuration/mongoose/schemas/schedules/schedules";
import { SuccessResponse } from "../../../types.config";
import { PermittedFields } from "./resources/permittedFields";

const getSchedule = async ( { orgId, teamId, date }: PermittedFields ): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Get all members of team (Ensuring that team is part of organisation)
        await User.find({ "organisation._id": orgId, "team._id": teamId }, ["firstName", "lastName", "emailAddress", "role"])
            .then( async (teamMembers) => {
                if(teamMembers.length === 0) {
                    return resolve({
                        success: false,
                        reason: "No users could be found inside of this team"
                    })
                }

                // Get operational times and create structural template
                const operationalHours = (await Team.findById(teamId, ["operatingHours"])).toJSON();
                let schedules = [];

                for (const member of teamMembers) {
                    let memberSchedule = {
                        submitted: false,
                        member: {
                            name: member.firstName + " " + member.lastName,
                            emailAddress: member.emailAddress,
                            _id: member._id.toString(),
                            role: member.role
                        },
                        schedule: []
                    }

                    schedules.push(memberSchedule)
                }

                let scheduleId: undefined | string = undefined;

                // Get schedule if exists and map against template
                await Schedule.findOne( { "organisation._id": orgId, "team._id": teamId, "date": date } )
                    .then((schedule) => {
                        if(schedule === null) return;
                        
                        scheduleId = schedule._id.toString();
                        for (let i = 0; i < schedules.length; i++) {
                            const teamSchedule = schedules[i];

                            if(schedule.schedule.find(s => s.member._id.toString() === teamSchedule.member._id.toString()) === undefined) {
                                continue;
                            } else {
                                const memberScheduleIndex = schedule.schedule.findIndex(s => s.member._id.toString() === teamSchedule.member._id.toString());

                                schedules[i].submitted = true;
                                schedules[i].schedule = schedule.schedule[memberScheduleIndex].timeslots
                            }
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    })

                resolve({
                    success: true,
                    data: {
                        scheduleId: scheduleId,
                        schedules: schedules,
                        timeframe: operationalHours.operatingHours
                    }
                })
            })
            .catch((err) => {

            })
    })
}

export default getSchedule