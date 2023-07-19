import Department from "../../../../configuration/mongoose/schemas/organisations/departments";
import { SuccessResponse } from "../../../../types.config";

const getDepartments = async (orgId: string): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        await Department.find({ "organisation._id": orgId }, ["name", "team_count"])
            .then((departments) => {
                if(departments === null || departments.length === 0) {
                    resolve({
                        success: false,
                        reason: "No departments could be found for this organisation"
                    })
                } else {
                    const departmentsArray = departments.map(d => {
                        return {
                            _id: d._id.toString(),
                            name: d.name,
                            team_count: d.team_count
                        }
                    })

                    resolve({
                        success: true,
                        data: departmentsArray
                    })
                }
            })
            .catch((err) => {
                console.error(err);

                resolve({
                    success: false,
                    reason: "Oops, there was a technical error, please try again"
                })
            })
    })
}

export default getDepartments