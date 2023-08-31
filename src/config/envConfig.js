import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
.option('-m, --mode <mode>', 'development environment', 'dev')
.option('-f, --file <file>', 'the file to read')
.option('-t --timeout <timeout>', 'the timeout to read')

program.parse()

const enviroment = program.opts().mode

//const enviroment = 'dev'

dotenv.config({
    path: enviroment === 'dev' ? './.env.development' : './.env.production'
})

export default {
    port: process.env.PORT,
    mongo_url: process.env.URL_MONGODB_ATLAS,
    signed_cookie: process.env.SIGNED_COOKIE,
    session_secret: process.env.SESSION_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
    node_env: process.env.NODE_ENV
}
