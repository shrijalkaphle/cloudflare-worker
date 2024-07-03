import { Context, Next } from "hono"
import { verifyToken } from "../src/helper/jwt.helper"
import { BlankEnv, BlankInput } from "hono/types"

export default async function validateToken(ctx: Context<BlankEnv, "/", BlankInput>, next: Next) {

    // get headers
    const authorization = ctx.req.header('Authorization')
    const userAgent = ctx.req.header('X-Request-Agent')
    
    if(userAgent == 'frontend') await next()
    
    if(!authorization) 
        return ctx.json({
            status: false,
            message: "Unauthorized Access!!"
        }, 401)

    const token = authorization.split(" ")[1]

    // verify token
    const payload = await verifyToken(token)
    if(!payload.status) return ctx.json(payload, 401)

    await next()
}