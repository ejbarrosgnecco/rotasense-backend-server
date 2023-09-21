import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface AddUserFields {
    firstName: string,
    lastName: string,
    emailAddress: string,
    profile: string,
    role: string,
    password?: string,
    team: {
        _id: string,
        name: string
    }
}

export const addUserValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "firstName",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "lastName",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "emailAddress",
            required: true,
            valueConstraints: {
                type: "string",
                regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/
            }
        },
        {
            key: "password",
            required: false,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "profile",
            required: true,
            valueConstraints: {
                type: "string",
                regex: /\b(Admin|Standard|Team manager)\b/
            }
        },
        {
            key: "role",
            required: true,
            valueConstraints: {
                type: "string"
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