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
    // Generate seconds to expiry (midnight)
    const now = new Date( new Date().toISOString() );
    let expiry = new Date(new Date(now).setHours(23, 59, 0));

    const expiryTime = (expiry.getTime() - now.getTime());

    const newToken = jwt.sign(props, process.env.PORTAL_ACCESS_SECRET, { expiresIn: `${expiryTime}` });

    return {
        accessToken: newToken,
        expiresIn: Math.floor(expiryTime / 1000),
        type: "Bearer"
    }
}

export default generatePortalAccessToken