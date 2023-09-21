import { ValidationParams } from "api-field-validation-middleware/dist/types"

export interface CreateAccountFields {
    user: {
        firstName: string,
        lastName: string,
        emailAddress: string,
        password: string
    },
    department: string,
    organisation: {
        name: string,
        sector: string,
        employeeSize: string
    },
    team: {
        name: string,
        operatingHours: {
            from: string,
            to: string
        },
        actions: {
            action: string,
            color: string,
            restricted: boolean,
            restrictedTo: string[]
        },
        roles: string[]
    }
}

export const createAccountValidation: ValidationParams = {
    rejectAdditionalFields: true,
    returnFailedValues: false,
    fields: [
        {
            key: "user",
            required: true,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
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
                }
            ]
        },
        {
            key: "department",
            required: true,
            valueConstraints: {
                type: "string"
            }
        },
        {
            key: "organisation",
            required: true,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
                {
                    key: "name",
                    required: true,
                    valueConstraints: {
                        type: "string"
                    }
                },
                {
                    key: "sector",
                    required: true,
                    valueConstraints: {
                        type: "string"
                    }
                },
                {
                    key: "employeeSize",
                    required: true,
                    valueConstraints: {
                        type: "string",
                        regex: /\b(1-10|11-50|51-100|101-500|500+)\b/
                    }
                }
            ]
        },
        {
            key: "team",
            required: true,
            valueConstraints: {
                type: "object"
            },
            nestedValues: [
                {
                    key: "name",
                    required: true,
                    valueConstraints: {
                        type: "string"
                    }
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
    ]
}