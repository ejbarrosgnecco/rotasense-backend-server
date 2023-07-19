import jwt from "jsonwebtoken"
import PORTAL_ACCESS_JWT_SECRET from "../../../configuration/access_tokens/portal/secret";

interface TokenData {
    userId: string,
    emailAddress: string,
    firstName: string,
    lastName: string,
    organisation: {
        name: string,
        _id: string
    },
    team: {
        name: string,
        _id: string
    },
    profile: string,
    role: string
}

interface TokenResponse {
    accessToken: string,
    expiresIn: number,
    type: string
}

const generatePortalAccessToken = (props: TokenData): TokenResponse => {
    const newToken = jwt.sign(props, PORTAL_ACCESS_JWT_SECRET, { expiresIn: 86400 });

    return {
        accessToken: newToken,
        expiresIn: 86400,
        type: "Bearer"
    }
}

export default generatePortalAccessToken