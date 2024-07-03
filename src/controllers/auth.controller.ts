import { connect } from "../../lib/mongodb"
import { generateToken } from "../helper/jwt.helper"
import { verifyPassword } from "../helper/password.helper"
import { HonoContext } from "../types/main"

async function login (ctx: HonoContext) {

    // validate from mongodb
    const { db } = await connect()
    const userCollection = db?.collection('user')
    
    const {email, password} = await ctx.req.json()
    const user = await userCollection?.findOne({
        email: email
    })

    if(!user) return ctx.json({
        message : "Invalid email!",
        status : false
    }, 401)
    const passwordMatch = await verifyPassword(user.password, password)

    if(!passwordMatch) return ctx.json({
        message : "Password does not match!",
        status : false
    },401)

    // create hashed token
    const token = await generateToken(user)

    return ctx.json({
        message : "User Logged in!",
        status : true,
        token
    })
}

async function getME(ctx: HonoContext) {
    const { db } = await connect()
    const userCollection = db?.collection('user')

    const user = await userCollection?.findOne({})

    delete user?.password
    return ctx.json({ user })
}

export default {
    login,
    getME
}
