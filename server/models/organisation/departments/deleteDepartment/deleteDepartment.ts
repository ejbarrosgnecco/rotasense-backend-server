import Department from "../../../../configuration/mongoose/schemas/organisations/departments";
import { SuccessResponse } from "../../../../types.config";

const deleteDepartment = async ({ orgId, dptId }: { orgId: string, dptId: string }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Department.findOneAndDelete({ _id: dptId, "organisation._id": orgId })
            .then((response) => {
                if(response === null) {
                    resolve({
                        success: false,
                        reason: "Department could not be found within organisation"
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

export default deleteDepartment