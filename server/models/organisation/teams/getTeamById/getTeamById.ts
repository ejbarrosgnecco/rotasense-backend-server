import Team from "../../../../configuration/mongoose/schemas/organisations/teams"
import { SuccessResponse } from "../../../../types.config"

const getTeamById = async ({ orgId, teamId }: { orgId: string, teamId: string }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOne({ _id: teamId, "organisation._id": orgId })
            .then((team) => {
                if(team === null) {
                    resolve({
                        success: false,
                        reason: "Team could not be found in this organisation department"
                    })
                } else {
                    resolve({
                        success: true,
                        data: team.toJSON()
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

export default getTeamById