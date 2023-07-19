export interface PermittedFields {
    orgId: string,
    teamId: string,
    scheduleId?: string,
    memberId: string,
    schedule: {
        time: string,
        action: string
    }[],
    date: string
}