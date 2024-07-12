import { connect } from "../../lib/mongodb";

const DROPBOX_APP_ID = "01q6k4p72r2v8mf"
const DROPBOX_APP_SECERET = "lrmwbipaw8on8ky"
const DROPBOX_REDIRECT_URI = "https://portfolio-worker.kaphle-shrijal9.workers.dev/dropbox/callback"

async function refreshAccessToken() {
    const { db } = await connect()

    const user = await db?.collection('user').findOne({ email: 'kaphle.shrijal9@gmail.com' })
    const previousRefreshToken = user.refreshToken

    // refresh token here
    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: previousRefreshToken,
        client_id: DROPBOX_APP_ID,
        client_secret: DROPBOX_APP_SECERET
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
    if (!tokenData.access_token) return { message: 'Access token not found', error: tokenData, status: 400 };
    const accessToken = tokenData.access_token;

    const updated = await db?.collection('user').updateOne({ email: 'kaphle.shrijal9@gmail.com' }, { $set: { accessToken } }, { upsert: true })
    const updatedUser = await db?.collection('user').findOne({ email: 'kaphle.shrijal9@gmail.com' })
    return updatedUser
}

async function generateTemporaryLink(path: string) {

    const dropboxApiUrl = 'https://api.dropboxapi.com/2/files/get_temporary_link';

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

    if (!response.ok) return {
        status: false,
        message: response.statusText,
        response: JSON.stringify(response)
    }
    
    const data: any = await response.json();
    return data
}

export default {
    refreshAccessToken,
    generateTemporaryLink
}


