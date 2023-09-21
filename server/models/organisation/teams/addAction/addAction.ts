import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import { AddActionFields } from "../../../../routes/organisation/fieldValidation/addAction";
import { SuccessResponse } from "../../../../types.config";

const addNewAction = async (orgId: string, teamId: string, newAction: AddActionFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["actions"])
            .then( async (team) => {
                if(team === null) {
                    resolve({
                        success: false,
                        reason: "Team could not be found within organisation"
                    })
                } else {
                    let newArray = [...team.actions, newAction];
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

export default addNewAction