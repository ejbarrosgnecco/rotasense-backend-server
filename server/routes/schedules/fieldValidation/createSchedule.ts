import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface CreateScheduleFields {
    scheduleId: string,
    date: string,
    repeatDates: string[],
    schedule: {
        startTime: string,
        endTime: string,
        action: string
    }[]
}

export const createScheduleValidation: ValidationParams = {
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
            key: "date",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "repeatDates",
            required: false,
            valueConstraints: {
                type: "array"
            },
            nestedValues: {
                freeArray: false,
                valueConstraints: {
                    type: "string",
                    regex: /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/
                }
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