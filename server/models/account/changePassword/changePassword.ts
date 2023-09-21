import User from "../../../configuration/mongoose/schemas/organisations/users";
import { ChangePasswordFields } from "../../../routes/account/fieldValidation/changePassword";
import { SuccessResponse } from "../../../types.config";
import bcrypt from "bcrypt";

const changePassword = async (orgId: string, userId: string, credentials: ChangePasswordFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await User.findOne({ _id: userId, "organisation._id": orgId })
            .then( async (user) => {
                if(user === null) {
                    resolve({
                        success: false,
                        reason: "User could not be found within organisation"
                    })
                } else {
                    // See if current password is correct
                    const currentPasswordCorrect = await bcrypt.compare(credentials.currentPassword, user.password);

                    if(!currentPasswordCorrect) {
                        resolve({
                            success: false,
                            reason: "This password is incorrect, please check and try again"
                        })
                    } else {
                        // Encyrpt and set new password
                        const salt = await bcrypt.genSalt();
                        const newPassword = await bcrypt.hash(credentials.newPassword, salt);

                        user.password = newPassword;

                        await user.save()
                            .then(() => {
                                resolve({
                                    success: true
                                })
                            })
                    }
                }
            })
            .then((err) => {
                console.error(err);

                resolve({
                    success: false,
                    reason: "Oops, there was a technical error, please try again."
                })
            })
    })
}

export default changePassword