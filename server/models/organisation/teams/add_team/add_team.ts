import mongoose from "mongoose";
import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import { AddTeamFields } from "../../../../routes/organisation/field_validation/add_team";
import { SuccessResponse, UserRecord } from "../../../../types.config";

const addNewTeam = async (props: AddTeamFields, user: UserRecord): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        const newTeam = new Team({
            ...props,
            organisation: {
                _id: new mongoose.Types.ObjectId(user.organisation._id),
                name: user.organisation.name
            }
        })

        await newTeam.save()
            .then((response) => {
                resolve({
                    success: true,
                    data: {
                        teamId: response._id.toString()
                    }
                })
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

export default addNewTeam