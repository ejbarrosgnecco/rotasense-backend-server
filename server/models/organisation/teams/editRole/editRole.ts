import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import User from "../../../../configuration/mongoose/schemas/organisations/users";
import { EditRoleFields } from "../../../../routes/organisation/fieldValidation/editRole";
import { SuccessResponse } from "../../../../types.config";

const editRole = async (orgId: string, teamId: string, params: EditRoleFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["roles"])
            .then( async (team) => {
                if(team === null) {
                    resolve({
                        success: false,
                        reason: "Team could not be found within organisation"
                    })
                } else {
                    // Edit value in team
                    const editIndex = team.roles.indexOf(params.currentRole)
                    if(editIndex === -1) resolve({ success: false, reason: "Role could not be found within team" });

                    team.roles[editIndex] = params.newRole;

                    await team.save();

                    // Update role for users
                    await User.find({ "organisation._id": orgId, "team._id": teamId, role: params.currentRole}, ["role"])
                        .then( async (users) => {
                            for (let i = 0; i < users.length; i++) {
                                const user = users[i];
                                
                                user.role = params.newRole
                                await user.save();
                            }
                        })
                        .catch((err) => {
                            console.error(err);

                            resolve({
                                success: false,
                                reason: "Oops, there was a technical error, please try again"
                            })
                        })

                    resolve({
                        success: true
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

export default editRole