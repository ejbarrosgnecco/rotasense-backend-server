import Team from "../../../configuration/mongoose/schemas/organisations/teams"
import { SuccessResponse } from "../../../types.config"

const getActions = async ( { orgId, teamId, role } : { orgId: string, teamId: string, role?: string } ): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Team.findOne({ _id: teamId, "organisation._id": orgId }, ["actions"])
            .then( async (team) => {
                if(team === null) {
                    return resolve({
                        success: false,
                        reason: "No team could be found in this organisation with this name"
                    })
                }

                let actions = team.actions;
                
                // Filter if team member role has been provided
                if(role !== undefined) {
                    actions = actions.filter(a => a.restricted === false || (a.restricted === true && a.restricted_to.includes(role)))
                }

                resolve({
                    success: true,
                    data: actions.map(a => { return { action: a.action, color: a.color }})
                })
            })
    })
}

export default getActions