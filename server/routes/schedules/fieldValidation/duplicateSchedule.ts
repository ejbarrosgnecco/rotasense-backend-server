import { ValidationParams } from "api-field-validation-middleware/dist/types";

export interface DuplicateScheduleFields {
    scheduleId: string,
    destinationUserId: string,
    dates: string[]
}

export const duplicateScheduleValidation: ValidationParams = {
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
            key: "destinationUserId",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "dates",
            required: true,
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
    ]
}