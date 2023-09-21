import User from "../../../../configuration/mongoose/schemas/organisations/users"
import { SuccessResponse } from "../../../../types.config"

const getUsers = async ({ orgId, teamId, status, abbreviated }: { orgId: string, teamId?: string, status?: string, abbreviated?: boolean }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        let searchParams = {
            "organisation._id": orgId
        }

        if(teamId) searchParams["team._id"] = teamId
        if(status) searchParams["status"] = status
        
        let returnValues: string[] = ["firstName", "lastName", "emailAddress", "role", "profile", "status"]
        if(abbreviated) returnValues = ["firstName", "lastName", "emailAddress"]

        await User.find(searchParams, returnValues)
            .then((users) => {
                if(users === null || users.length === 0) {
                    resolve({
                        success: false,
                        reason: "No users could be found for the requested parameters"
                    })
                } else {
                    let data: any = users.sort((a, b) => a.firstName.localeCompare(b.firstName));
                    if(abbreviated) {
                        data = users.map(user => {
                            return {
                                _id: user._id.toString(),
                                fullName: user.firstName + " " + user.lastName,
                                emailAddress: user.emailAddress
                            }
                        }).sort((a, b) => a.fullName.localeCompare(b.fullName))
                    }

                    resolve({
                        success: true,
                        data: data
                    })
                }
            })
            .catch((err) => {
                console.error(err)

                resolve({
                    success: false,
                    reason: "Oops, there was a techincal error, please try again."
                })
            })
    })
}

export default getUsers