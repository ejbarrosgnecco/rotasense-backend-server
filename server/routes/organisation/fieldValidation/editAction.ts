import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface EditActionFields {
    currentAction: string,
    newValues: {
        action: string,
        color: string,
        restricted: boolean,
        restrictedTo: string[]
    }
}

export const editActionValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "currentAction",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "newValues",
            required: true,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
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
    ]
}