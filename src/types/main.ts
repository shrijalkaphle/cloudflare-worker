import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"

export type IUser ={
    email: string
    password: string
    _id: string
    name: string
    username: string
}

export type HonoContext = Context<BlankEnv, "/", BlankInput>