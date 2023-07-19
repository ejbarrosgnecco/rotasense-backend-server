export interface SuccessResponse {
    success: boolean,
    data?: any,
    reason?: string
}

export interface UserRecord {
    userId: string,
    firstName: string,
    lastName: string,
    emailAddress: string,
    organisation: {
        _id: string,
        name: string
    },
    team: {
        _id: string,
        name: string
    },
    profile: string,
    role: string,
    accessToken: string
}