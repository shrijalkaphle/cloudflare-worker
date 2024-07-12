import { connect } from "../../lib/mongodb";
import dropboxService from "../services/dropbox.service";
import { HonoContext } from "../types/main"


const DROPBOX_APP_ID = "01q6k4p72r2v8mf"
const DROPBOX_APP_SECERET = "lrmwbipaw8on8ky"
const DROPBOX_REDIRECT_URI = "http://127.0.0.1:8787/dropbox/callback"

async function authenticate(ctx: HonoContext) {

    const authUrl = new URL('https://www.dropbox.com/oauth2/authorize');
    authUrl.searchParams.set('client_id', DROPBOX_APP_ID);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('token_access_type', 'offline');
    authUrl.searchParams.set('redirect_uri', DROPBOX_REDIRECT_URI);

    return ctx.redirect(authUrl.toString())
}


async function callback(ctx: HonoContext) {
    const code = ctx.req.query('code');

    if (!code) {
        return ctx.json({ message: 'Authorization code not found' }, 400);
    }


    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';
    const body = new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: DROPBOX_APP_ID,
        client_secret: DROPBOX_APP_SECERET,
        redirect_uri: DROPBOX_REDIRECT_URI,
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-Source": "Cloudflare-Workers",
        },
        body: body.toString(),
    });

    const tokenData: any = await response.json();
    if (!tokenData.access_token) return ctx.json({ message: 'Access token not found', error: tokenData }, 400);
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token

    // store to user table
    const { db } = await connect()
    const updated = await db?.collection('user').updateOne({ email: 'kaphle.shrijal9@gmail.com' }, { $set: { accessToken, refreshToken } }, { upsert: true })
    return ctx.json({ message: "authenticated! Close this tab and refresh", tokenData, updated }, 200)
}

async function refreshToken(ctx: HonoContext) {
    
    const response = await dropboxService.refreshAccessToken()

    if(response.error) return ctx.json({ message: "Something went wrong", error: response.error }, 400)
    else 
        return ctx.json({ updatedUser: response.updatedUser, status: true }, 200)

}


async function generateUploadUrl(ctx: HonoContext) {

    const dropboxApiUrl = 'https://api.dropboxapi.com/2/files/get_temporary_upload_link';
    
    const { db } = await connect()
    const user = await db?.collection('user').findOne({ email: 'kaphle.shrijal9@gmail.com' })
    const accessToken = user?.accessToken

    const { path } = await ctx.req.json();
    const payload = {
        commit_info: {
            autorename: true,
            mode: "add",
            mute: false,
            path: path,
            strict_conflict: false
        },
        duration: 600
    }

    const response = await fetch(dropboxApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`,
            "X-Source": "Cloudflare-Workers",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) return ctx.json({
        status: false,
        message: response.statusText,
        response: JSON.stringify(response)
    }, 401)

    const data: any = await response.json();
    return ctx.json({ status: true, upload_link: data.link }, 200)

}

async function removeFileFromDropbox(ctx: HonoContext) {

    const dropboxApiUrl = 'https://api.dropboxapi.com/2/files/delete_v2';

    const { db } = await connect()
    const user = await db?.collection('user').findOne({ email: 'kaphle.shrijal9@gmail.com' })
    const accessToken = user?.accessToken

    const { path } = await ctx.req.json();

    const response = await fetch(dropboxApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`,
            "X-Source": "Cloudflare-Workers",
        },
        body: JSON.stringify({ path }),
    });

    if (!response.ok) return ctx.json({
        status: false,
        message: response.statusText,
        response: JSON.stringify(response)
    }, 401)

    const data: any = await response.json();
    return ctx.json({ status: true }, 200)
}

async function generateTemporaryLink(ctx: HonoContext) {
    
    const dropboxApiUrl = 'https://api.dropboxapi.com/2/files/get_temporary_link';

    const { db } = await connect()
    const user = await db?.collection('user').findOne({ email: 'kaphle.shrijal9@gmail.com' })
    const accessToken = user?.accessToken

    const { path } = await ctx.req.json();

    const response = await fetch(dropboxApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`,
            "X-Source": "Cloudflare-Workers",
        },
        body: JSON.stringify({ path }),
    });

    if (!response.ok) return ctx.json({
        status: false,
        message: response.statusText,
        response: JSON.stringify(response)
    }, 401)

    const data: any = await response.json();
    return ctx.json({ status: true, temporary_link: data.link }, 200)
    
}


async function removeFile(path: string) {
    const dropboxApiUrl = 'https://api.dropboxapi.com/2/files/delete_v2';

    const { db } = await connect()
    const user = await db?.collection('user').findOne({ email: 'kaphle.shrijal9@gmail.com' })
    const accessToken = user?.accessToken

    const response = await fetch(dropboxApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`,
            "X-Source": "Cloudflare-Workers",
        },
        body: JSON.stringify({ path }),
    });
    const data: any = await response.json();
    return true
}

export default {
    authenticate,
    callback,
    refreshToken,
    generateUploadUrl,
    removeFileFromDropbox,
    generateTemporaryLink,
    removeFile
}