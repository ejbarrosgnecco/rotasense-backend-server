import User from "../../../../configuration/mongoose/schemas/organisations/users";
import { EditUserFields } from "../../../../routes/organisation/fieldValidation/editUser";
import { SuccessResponse } from "../../../../types.config";

const editUser = async (orgId: string, userId: string, props: EditUserFields): Promise<SuccessResponse> => {
    if(Object.keys(props).length === 0) {
        return {
            success: false,
            reason: "Please provide at least one edit field"
        }
    } else {
        return await new Promise<SuccessResponse>( async (resolve) => {
            await User.findOneAndUpdate({ _id: userId, "organisation._id": orgId }, props)
                .then((response) => {
                    if(response === null) {
                        resolve({
                            success: false,
                            reason: "User could not be found within organisation"
                        })
                    } else {
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

export default editUser