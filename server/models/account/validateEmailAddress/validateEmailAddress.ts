import User from "../../../configuration/mongoose/schemas/organisations/users";
import { SuccessResponse } from "../../../types.config";

const validateEmailAddress = async ( emailAddress: string ): Promise<SuccessResponse> => {
    if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(emailAddress) === false) {
        return {
            success: true,
            data: {
                usedPreviously: false,
                validEmail: false
            }
        }
    } else {
        // Check that email address has not been used previously
        return await new Promise<SuccessResponse>( async (resolve) => {
            await User.findOne({ emailAddress: emailAddress })
                .then((user) => {
                    if(!user) {
                        resolve({
                            success: true,
                            data: {
                                usedPreviously: false,
                                validEmail: true
                            }
                        })
                    } else {
                        resolve({
                            success: true,
                            data: {
                                usedPreviously: true,
                                validEmail: true
                            }
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

export default validateEmailAddress