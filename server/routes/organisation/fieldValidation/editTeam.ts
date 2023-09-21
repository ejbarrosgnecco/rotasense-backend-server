import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface EditTeamFields {
    name?: string,
    manager?: {
        _id: string,
        name: string,
        emailAddress: string
    },
    operatingHours?: {
        from: string,
        to: string
    }
}

export const editTeamValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "name",
            required: false,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "manager",
            required: false,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
                {
                    key: "_id",
                    required: true,
                    valueConstraints: {
                        type: "string",
                    }
                },
                {
                    key: "name",
                    required: true,
                    valueConstraints: {
                        type: "string",
                    }
                },
                {
                    key: "emailAddress",
                    required: true,
                    valueConstraints: {
                        type: "string",
                        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/
                    }
                }
            ]
        },
        {
            key: "operatingHours",
            required: false,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
                {
                    key: "from",
                    required: true,
                    valueConstraints: {
                        type: "string",
                        regex: /^([0-9]{2})+:+([0-9]{2})$/
                    }
                },
                {
                    key: "to",
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