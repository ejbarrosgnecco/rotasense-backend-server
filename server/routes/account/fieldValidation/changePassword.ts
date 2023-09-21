import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface ChangePasswordFields {
    currentPassword: string,
    newPassword: string
}

export const changePasswordValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "currentPassword",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "newPassword",
            required: true,
            valueConstraints: {
                type: "string"
            }
        }
    ]
}