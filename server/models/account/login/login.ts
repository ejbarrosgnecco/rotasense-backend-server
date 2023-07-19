import User from "../../../configuration/mongoose/schemas/organisations/users";
import { SuccessResponse } from "../../../types.config";
import { PermittedFields } from "./resources/permitted_fields";
import bcrypt from "bcrypt";
import generatePortalAccessToken from "../../../middleware/access_tokens/portal/generate_token";

const accountLogin = async (props: PermittedFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await User.findOne({ email_address: props.emailAddress })
            .then( async (user) => {
                if(user === null) {
                    resolve({
                        success: false,
                        reason: "Incorrect email address or password combination, please try again"
                    })
                } else {
                    // Check that password is correct
                    const comparePassword = await bcrypt.compare(props.password, user.password);

                    if(comparePassword === true) {
                        const newAccessToken = generatePortalAccessToken({
                            userId: user._id.toString(),
                            emailAddress: user.email_address,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            organisation: {
                                _id: user.organisation._id.toString(),
                                name: user.organisation.name
                            },
                            team: {
                                _id: user.team._id.toString(),
                                name: user.team.name
                            },
                            profile: user.profile,
                            role: user.role
                        })

                        resolve({
                            success: true,
                            data: newAccessToken
                        })
                    } else {
                        resolve({
                            success: false,
                            reason: "Incorrect email address or password combination, please try again"
                        })
                    }
                }
            })
    })
}

export default accountLogin