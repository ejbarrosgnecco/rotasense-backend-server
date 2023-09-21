import User from "../../../../configuration/mongoose/schemas/organisations/users";
import { AddUserFields } from "../../../../routes/organisation/fieldValidation/addUser";
import { SuccessResponse } from "../../../../types.config";
import generateStrongPassword from "./actions/generatePassword";
import bcrypt from "bcrypt"

const addUser = async (organisation: { name: string, _id: string}, props: AddUserFields): Promise<SuccessResponse> => {
    return await new Promise<SuccessResponse>( async (resolve) => {
        let password = props.password || "";
        let passwordProvided: boolean = true;
        
        if(!props.password) {
            passwordProvided = false;
            password = generateStrongPassword();
        }

        // Hash password
        const hash = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, hash);

        password = hashedPassword

        const newUser = new User({
            firstName: props.firstName,
            lastName: props.lastName,
            emailAddress: props.emailAddress,
            profile: props.profile,
            role: props.role,
            password: password,
            team: props.team,
            organisation: organisation
        })

        await newUser.save()
            .then(() => {
                let returnObject: SuccessResponse = {
                    success: true
                }

                if(passwordProvided === false) {
                    returnObject.data = {
                        defaultPassword: password
                    }
                }

                resolve(returnObject)
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

export default addUser