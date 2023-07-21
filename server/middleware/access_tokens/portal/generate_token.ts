import jwt from "jsonwebtoken"

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
    const newToken = jwt.sign(props, process.env.PORTAL_ACCESS_SECRET, { expiresIn: 86400 });

    return {
        accessToken: newToken,
        expiresIn: 86400,
        type: "Bearer"
    }
}

export default generatePortalAccessToken