import User from "../../../../configuration/mongoose/schemas/organisations/users"
import { SuccessResponse } from "../../../../types.config"

const getUsers = async ({ orgId, teamId, abbreviated }: { orgId: string, teamId?: string, abbreviated?: boolean }): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        let searchParams = {
            "organisation._id": orgId
        }

        if(teamId) searchParams["team._id"] = teamId
        
        let returnValues: string[] = ["first_name", "last_name", "email_address", "role"]
        if(abbreviated) returnValues = ["first_name", "last_name", "email_address"]

        await User.find(searchParams, returnValues)
            .then((users) => {
                if(users === null || users.length === 0) {
                    resolve({
                        success: false,
                        reason: "No users could be found for the requested parameters"
                    })
                } else {
                    let data: any = users.sort((a, b) => a.first_name.localeCompare(b.first_name));
                    if(abbreviated) {
                        data = users.map(user => {
                            return {
                                _id: user._id.toString(),
                                full_name: user.first_name + " " + user.last_name
                            }
                        }).sort((a, b) => a.full_name.localeCompare(b.full_name))
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