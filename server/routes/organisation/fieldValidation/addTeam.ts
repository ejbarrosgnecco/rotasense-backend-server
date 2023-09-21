import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface AddTeamFields {
    name: string,
    department: {
        _id: string,
        name: string
    },
    manager: {
        _id: string,
        name: string,
        emailAddress: string
    },
    operatingHours: {
        from: string,
        to: string
    },
    actions: {
        action: string,
        color: string,
        restricted: boolean,
        restrictedTo: string[]
    }[],
    roles: string[]
}

export const addTeamValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "name",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "department",
            required: true,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
                {
                    key: "_id",
                    required: true,
                    valueConstraints: {
                        type: "string"
                    }
                },
                {
                    key: "name",
                    required: true,
                    valueConstraints: {
                        type: "string"
                    }
                }
            ]
        },
        {
            key: "manager",
            required: true,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
                {
                    key: "_id",
                    required: true,
                    valueConstraints: {
                        type: "string"
                    }
                },
                {
                    key: "name",
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
                }
            ]
        },
        {
            key: "operatingHours",
            required: true,
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
        },
        {
            key: "actions",
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
                ],
                minLength: 1
            }
        },
        {
            key: "roles",
            required: true,
            valueConstraints: {
                type: "array"
            },
            nestedValues: {
                freeArray: false,
                valueConstraints: {
                    type: "string"
                },
                minLength: 1
            },
            
        }
    ]
}