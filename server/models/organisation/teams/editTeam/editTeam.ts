import Team from "../../../../configuration/mongoose/schemas/organisations/teams"
import User from "../../../../configuration/mongoose/schemas/organisations/users"
import { EditTeamFields } from "../../../../routes/organisation/fieldValidation/editTeam"
import { SuccessResponse } from "../../../../types.config"

const editTeam = async (orgId: string, teamId: string, editValues: EditTeamFields): Promise<SuccessResponse> => {
    if(Object.keys(editValues).length === 0) {
        return {
            success: false,
            reason: "Please provide at least one edit field"
        }
    } else {
        // Proceed to edit values
        return await new Promise<SuccessResponse>( async (resolve) => {
            await Team.findOneAndUpdate({ _id: teamId, "organisation._id": orgId }, editValues)
                .then( async (response) => {
                    if(response === null) {
                        resolve({
                            success: false,
                            reason: "Team could not be found within organisation"
                        })
                    } else {
                        // Update 'name' of team for users
                        if(Object.keys(editValues).includes("name")) {
                            await User.find({ "organisation._id": orgId, "team._id": teamId })
                                .then( async (users) => {
                                    for (let i = 0; i < users.length; i++) {
                                        const user = users[i];
                                        
                                        user.team.name = editValues.name;
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
                        }

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
}

export default editTeam