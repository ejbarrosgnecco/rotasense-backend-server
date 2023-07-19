import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import PORTAL_ACCESS_JWT_SECRET from "../../../configuration/access_tokens/portal/secret";
import User from "../../../configuration/mongoose/schemas/organisations/users";
import { UserRecord } from "../../../types.config";

const validatePortalAccessToken =  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;

    if(authHeader === null || authHeader === undefined) return res.sendStatus(403)
    const accessToken = authHeader.split(" ")[1];

    try {
        const validityCheck: any = jwt.verify(accessToken, PORTAL_ACCESS_JWT_SECRET);

        if(validityCheck) {
            // Now check that all user details are still correct
            await User.findById((validityCheck as UserRecord).userId)
                .then((user) => {
                    if(user === null) {
                        return res.json({
                            success: false,
                            reason: "User no longer exists inside of organisation"
                        })
                    } else {
                        const sourceObject = {
                            userId: user._id.toString(),
                            emailAddress: user.email_address,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            organisation: {
                                _id: user.organisation._id.toString(),
                                name: user.organisation.name
                            },
                            team: {
                                _id: user.team._id.toString(),
                                name: user.team.name
                            },
                            profile: user.profile,
                            role: user.role
                        }

                        const comparisonObject = {
                            userId: validityCheck.userId,
                            emailAddress: validityCheck.emailAddress,
                            firstName: validityCheck.firstName,
                            lastName: validityCheck.lastName,
                            organisation: {
                                _id: validityCheck.organisation._id,
                                name: validityCheck.organisation.name
                            },
                            team: {
                                _id: validityCheck.team._id,
                                name: validityCheck.team.name
                            },
                            profile: validityCheck.profile,
                            role: validityCheck.role
                        }

                        // If values are still the same in DB
                        if(JSON.stringify(sourceObject) === JSON.stringify(comparisonObject)) {
                            req.user = {
                                ...sourceObject,
                                accessToken: accessToken
                            };
                            return next();
                        } else {
                            // If they have changed
                            return res.sendStatus(403)
                        }
                    }
                })

        } else {
            return res.sendStatus(403)
        }
    }
    
    catch (err) {
        // Access token is invalid
        return res.sendStatus(403)
    }
}

export default validatePortalAccessToken