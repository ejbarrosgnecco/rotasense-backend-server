import Team from "../../../../configuration/mongoose/schemas/organisations/teams"
import { EditActionFields } from "../../../../routes/organisation/fieldValidation/editAction"
import { SuccessResponse } from "../../../../types.config"

const editAction = async (orgId: string, teamId: string, data: EditActionFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["actions"])
            .then( async (team) => {
                if(team === null) {
                    resolve({
                        success: false,
                        reason: "Team could not be found within organisation"
                    })
                } else {
                    const index = team.actions.findIndex(a => a.action === data.currentAction);
                    const newArray = [...team.actions];
                    
                    newArray[index] = {
                        action: data.newValues.action,
                        color: data.newValues.color,
                        restricted: data.newValues.restricted,
                        restrictedTo: data.newValues.restrictedTo
                    }

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
                    reason: "Oops there was a technical error, please try again"
                })
            })
    })
}

export default editAction