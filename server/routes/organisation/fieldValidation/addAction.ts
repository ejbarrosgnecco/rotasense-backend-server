import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface AddActionFields {
    action: string,
    code: string,
    restricted: boolean,
    restrictedTo: string[]
}

export const addActionValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "action",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "color",
            required: true,
            valueConstraints: {
                type: "string",
                regex: /^#(?:[0-9a-fA-F]{3}){1,2}$/
            }
        },
        {
            key: "restricted",
            required: true,
            valueConstraints: {
                type: "boolean"
            }
        },
        {
            key: "restrictedTo",
            required: false,
            valueConstraints: {
                type: "array"
            },
            nestedValues: {
                freeArray: false,
                valueConstraints: {
                    type: "string"
                }
            }
        }
    ]
}