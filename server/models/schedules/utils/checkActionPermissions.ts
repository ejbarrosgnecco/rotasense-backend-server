import Team from "../../../configuration/mongoose/schemas/organisations/teams";
import User from "../../../configuration/mongoose/schemas/organisations/users"

const checkActionPermissions = async (userId: string, action: string): Promise<boolean> => {
    return await new Promise<boolean>( async (resolve) => {
        // Find user
        await User.findById(userId)
            .then( async (user) => {
                // User was not found
                if(!user) return resolve(false);
                
                const userRole = user.role;
                const teamId = user.team._id;

                if(action === "Lunch" || action === "Break") return resolve(true);

                // Find team
                await Team.findById(teamId)
                    .then((team) => {
                        // Team was not found
                        if(!team) return resolve(false);
                        
                        const teamAction = team.actions.find(a => a.action === action);

                        // Action was not found
                        if(!teamAction) return resolve(false);

                        if(teamAction.restricted) {
                            resolve(teamAction.restrictedTo.includes(userRole))
                        } else {
                            resolve(true)
                        }
                    })
            }) 
            .catch((err) => {
                console.error(err);
                resolve(false);
            })
    })
}

export default checkActionPermissions