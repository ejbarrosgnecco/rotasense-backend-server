import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import { SuccessResponse } from "../../../../types.config";

const getTeams = async ({ orgId, dptId }: { orgId: string, dptId: string }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.find({ "organisation._id": orgId, "department._id": dptId }, ["name"])
            .then((teams) => {
                if(teams === null || teams.length === 0) {
                    resolve({
                        success: false,
                        reason: "No teams could be found for this organisation department"
                    })
                } else {
                    resolve({
                        success: true,
                        data: teams
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

export default getTeams