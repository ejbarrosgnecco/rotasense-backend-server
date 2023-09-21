import { ValidationParams } from "api-field-validation-middleware/dist/types";

export interface EditSchedulePartFields {
    scheduleId: string,
    prevSlot: {
        startTime: string,
        endTime: string,
        action: string
    },
    newSlot: {
        startTime: string,
        endTime: string,
        action: string
    }
}

export const editSchedulePartValidation: ValidationParams = {
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
            key: "prevSlot",
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
        },
        {
            key: "newSlot",
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