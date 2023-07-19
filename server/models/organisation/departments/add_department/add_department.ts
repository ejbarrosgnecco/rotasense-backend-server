import mongoose from "mongoose";
import Department from "../../../../configuration/mongoose/schemas/organisations/departments";
import { SuccessResponse } from "../../../../types.config";

interface PermittedFields {
    organisation: {
        _id: string,
        name: string
    },
    departmentName: string
}

const addNewDepartment = async (props: PermittedFields): Promise<SuccessResponse> => {
    if(props.departmentName === undefined || props.departmentName === null || props.departmentName.length < 2) {
        return {
            success: false,
            reason: "One or more fields in the request are incorrectly formatted, please refer to documentation"
        }
    } else {
        return await new Promise<SuccessResponse>( async (resolve) => {
            const newDepartment = new Department({
                name: props.departmentName,
                organisation: {
                    _id: new mongoose.Types.ObjectId(props.organisation._id),
                    name: props.organisation.name
                }
            })

            await newDepartment.save()
                .then((response) => {
                    resolve({
                        success: true,
                        data: {
                            departmentId: response._id.toString()
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
}

export default addNewDepartment