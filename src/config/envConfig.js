import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    mongo_url: process.env.URL_MONGODB_ATLAS,
    signed_cookie: process.env.SIGNED_COOKIE,
    session_secret: process.env.SESSION_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
}
