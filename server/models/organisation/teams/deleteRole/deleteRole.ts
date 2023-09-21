import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import { SuccessResponse } from "../../../../types.config";

const deleteRole = async (orgId: string, teamId: string, role: string): Promise<SuccessResponse> => {
    if(typeof role !== "string" || role.length < 2) {
        return {
            success: false,
            reason: "Please provide the name of the role you'd like to delete"
        }
    } else {
        // Proceed to delete role
        return await new Promise<SuccessResponse>( async (resolve) => {
            await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["roles"])
                .then( async (team) => {
                    if(team === null) {
                        resolve({
                            success: false,
                            reason: "Team could not be found within organisation"
                        })
                    } else {
                        const deleteIndex = team.roles.indexOf(role);
                        if(deleteIndex === -1) resolve({ success: false, reason: "Role could not be found within team" })

                        team.roles.splice(deleteIndex, 1);

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

export default deleteRole