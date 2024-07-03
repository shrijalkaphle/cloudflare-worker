import * as jose from 'jose'
import { IUser } from '../types/main';


const JWT_SECRET = "$$__portfolio__$$";
export async function generateToken(user: IUser) {
    const payload = {
        email: user.email,
        _id: user._id
    }

    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        // .setExpirationTime('3m')
        .sign(new TextEncoder().encode(JWT_SECRET))
    return token
}

export async function verifyToken(token: string) {

    try {
        const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        return { ...payload, status: true }
    } catch {
        return {
            message: "Token Expired!",
            status: false
        }
    }
}