import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface AddNewPartFields {
    scheduleId: string,
    newPart: {
        action: string,
        startTime: string,
        endTime: string
    }
}

export const addNewPartValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "scheduleId",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "newPart",
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
                    key: "startTime",
                    required: true,
                    valueConstraints: {
                        type: "string",
                        regex: /^([0-9]{2})+:+([0-9]{2})$/
                    }
                },
                {
                    key: "endTime",
                    required: true,
                    valueConstraints: {
                        type: "string",
                        regex: /^([0-9]{2})+:+([0-9]{2})$/
                    }
                }
            ]
        }
    ]
}