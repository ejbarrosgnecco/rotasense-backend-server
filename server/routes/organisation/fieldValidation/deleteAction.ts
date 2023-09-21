import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface DeleteActionFields {
    action: string
}

export const deleteActionValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "action",
            required: true,
            valueConstraints: {
                type: "string"
            }
        }
    ]
}