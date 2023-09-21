import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface EditScheduleFields {
    scheduleId: string,
    schedule: {
        startTime: string,
        endTime: string,
        action: string
    }[]
}

export const editScheduleValidation: ValidationParams = {
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
            key: "schedule",
            required: true,
            valueConstraints: {
                type: "array"
            },
            nestedValues: {
                freeArray: false,
                valueConstraints: {
                    type: "object"
                },
                nestedValues: [
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
                    },
                    {
                        key: "action",
                        required: true,
                        valueConstraints: {
                            type: "string"
                        }
                    }
                ]
            }
        }
    ]
}