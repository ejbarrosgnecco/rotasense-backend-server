import { resolve } from "path";
import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import { SuccessResponse } from "../../../../types.config";

const addNewRole = async (orgId: string, teamId: string, newRole: string): Promise<SuccessResponse> => {
    if(typeof newRole !== "string" || newRole.length < 2) {
        return {
            success: false,
            reason: "Please provide the name of the new role you'd like to add"
        }
    } else {
        // Proceed to add role
        return await new Promise<SuccessResponse>( async (resolve) => {
            await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["roles"])
                .then( async (team) => {
                    if(team === null) {
                        resolve({
                            success: false,
                            reason: "Team could not be found within organisation"
                        })
                    } else {
                        team.roles.push(newRole);
                        await team.save()
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
}

export default addNewRole