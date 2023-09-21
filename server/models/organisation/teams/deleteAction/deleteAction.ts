import Team from "../../../../configuration/mongoose/schemas/organisations/teams"
import { SuccessResponse } from "../../../../types.config"

const deleteAction = async ({ orgId, teamId, action }: { orgId: string, teamId: string, action: string }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["actions"])
            .then(async (team) => {
                if(team === null) {
                    resolve({
                        success: false,
                        reason: "Team could not be found within organisation"
                    })
                } else {
                    const actions = team.actions;

                    const removeIndex = actions.findIndex(a => a.action === action);

                    if(removeIndex < 0) return resolve({ success: false, reason: "Action could not be found within team"});

                    let newArray = [...actions]
                    newArray.splice(removeIndex, 1);

                    team.actions = newArray;

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

export default deleteAction