import mongoose from "mongoose";
import Team from "../../../../configuration/mongoose/schemas/organisations/teams";
import { AddTeamFields } from "../../../../routes/organisation/fieldValidation/addTeam";
import { SuccessResponse, UserRecord } from "../../../../types.config";

const addNewTeam = async (props: AddTeamFields, user: UserRecord): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // Ensure that team doesn't already exist
        await Team.findOne({ name: props.name, "organisation._id": user.organisation._id })
            .then((teams) => {
                if(teams !== null) {
                    return resolve({
                        success: false,
                        reason: "A team with this name already exists"
                    })
                }
            })

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