import Department from "../../../../configuration/mongoose/schemas/organisations/departments"
import Team from "../../../../configuration/mongoose/schemas/organisations/teams"
import { SuccessResponse } from "../../../../types.config"

const renameDepartment = async ({ orgId, dptId, newName }: { orgId: string, dptId: string, newName: string}): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Rename department itself
        await Department.findOneAndUpdate({ _id: dptId, "organisation._id": orgId }, { name: newName })
            .then( async (response) => {
                if(response === null) {
                    resolve({
                        success: false,
                        reason: "Department could not be found within organisation"
                    })
                } else {
                    // Now rename all teams associated with department
                    await Team.find({ "department._id": dptId })
                        .then( async (teams) => {
                            for (let i = 0; i < teams.length; i++) {
                                const team = teams[i];
                                
                                team.department.name = newName;
                                await team.save();
                            }

                            resolve({
                                success: true
                            })
                        })
                        .catch((err) => {
                            console.error(err);

                            resolve({
                                success: false,
                                reason: "Oops, there was a technical error, please try again"
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

export default renameDepartment