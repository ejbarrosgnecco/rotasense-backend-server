import Team from "../../../../configuration/mongoose/schemas/organisations/teams"
import { SuccessResponse } from "../../../../types.config"

const deleteTeam = async ({ orgId, teamId }: { orgId: string, teamId: string }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOneAndDelete({ "organisation._id": orgId, _id: teamId })
            .then((response) => {
                if(response === null) {
                    resolve({
                        success: false,
                        reason: "Team could not be found within organisation"
                    })
                } else {
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

export default deleteTeam