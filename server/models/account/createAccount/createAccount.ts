import User from "../../../configuration/mongoose/schemas/organisations/users";
import { CreateAccountFields } from "../../../routes/account/fieldValidation/createAccount";
import { SuccessResponse } from "../../../types.config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Organisation from "../../../configuration/mongoose/schemas/organisations/organisations";
import Department from "../../../configuration/mongoose/schemas/organisations/departments";
import Team from "../../../configuration/mongoose/schemas/organisations/teams";
import generatePortalAccessToken from "../../../middleware/accessTokens/portal/generateToken";

const createAccount = async (props: CreateAccountFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        // * Perform duplication & validity checks
        // -- Email address hasn't been used before
        await User.findOne({ emailAddress: props.user.emailAddress })
            .then((user) => {
                if(user) return resolve({
                    success: false,
                    reason: "This email address has already been used for another account"
                })
            })
        
        // * -------- Proceed to add account --------- * //
        try {
            // -- IDs
            const userId = new mongoose.Types.ObjectId();
            const organisationId = new mongoose.Types.ObjectId();
            const departmentId = new mongoose.Types.ObjectId();
            const teamId = new mongoose.Types.ObjectId();

            // -- USER
            const passwordSalt = await bcrypt.genSalt();
            const passwordEncrypted = await bcrypt.hash(props.user.password, passwordSalt);

            const newUser = new User({
                _id: userId,
                firstName: props.user.firstName,
                lastName: props.user.lastName,
                emailAddress: props.user.emailAddress,
                password: passwordEncrypted,
                role: props.team.roles[0],
                profile: "Super Admin",
                status: "active",
                organisation: {
                    _id: organisationId,
                    name: props.organisation.name
                },
                team: {
                    _id: teamId,
                    name: props.team.name
                }
            })

            await newUser.save();

            // -- ORGANISATION
            const newOrganisation = new Organisation({
                _id: organisationId,
                name: props.organisation.name,
                status: "active",
                sector: props.organisation.sector,
                employeeSize: props.organisation.employeeSize,
                owner: {
                    _id: userId,
                    name: props.user.firstName + " " + props.user.lastName,
                    emailAddress: props.user.emailAddress
                }
            })

            await newOrganisation.save();

            // -- DEPARTMENT
            const newDepartment = new Department({
                _id: departmentId,
                name: props.department,
                organisation: {
                    _id: organisationId,
                    name: props.organisation.name
                },
                teamCount: 1
            })

            await newDepartment.save();

            // -- TEAM
            const newTeam = new Team({
                _id: teamId,
                name: props.team.name,
                department: {
                    _id: departmentId,
                    name: props.department
                },
                organisation: {
                    _id: organisationId,
                    name: props.organisation.name
                },
                operatingHours: props.team.operatingHours,
                actions: props.team.actions,
                manager: {
                    _id: userId,
                    name: props.user.firstName + " " + props.user.lastName,
                    emailAddress: props.user.emailAddress
                },
                roles: props.team.roles
            })

            await newTeam.save();

            // * Generate an access token for the user to log in
            const accessToken = generatePortalAccessToken({
                userId: userId.toString(),
                emailAddress: props.user.emailAddress,
                firstName: props.user.firstName,
                lastName: props.user.lastName,
                organisation: {
                    _id: organisationId.toString(),
                    name: props.organisation.name
                },
                team: {
                    _id: teamId.toString(),
                    name: props.team.name
                },
                profile: "Super Admin",
                role: props.team.roles[0]
            })

            resolve({
                success: true,
                data: accessToken
            })
        }

        catch (err) {
            console.error(err);

            resolve({
                success: false,
                reason: "Oops, there was a technical error, please try again."
            })
        }
        
    })
}

export default createAccount