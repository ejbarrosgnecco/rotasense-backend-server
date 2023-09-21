import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface EditUserFields {
    firstName: string,
    lastName: string,
    profile: string,
    role: string,
    team: {
        _id: string,
        name: string
    }
}

export const editUserValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "firstName",
            required: false,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "lastName",
            required: false,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "profile",
            required: false,
            valueConstraints: {
                type: "string",
                regex: /\b(Admin|Standard|Team manager)\b/
            }
        },
        {
            key: "role",
            required: false,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "status",
            required: false,
            valueConstraints: {
                type: "string",
                regex: /\b(active|suspended)\b/
            }
        },
        {
            key: "team",
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
                }
            ]
        }
    ]
}