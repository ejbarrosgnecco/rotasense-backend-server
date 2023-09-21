import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface EditRoleFields {
    currentRole: string,
    newRole: string
}

export const editRoleValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "currentRole",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "newRole",
            required: true,
            valueConstraints: {
                type: "string"
            }
        }
    ]
}