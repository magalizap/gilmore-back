import dotenv from 'dotenv'
/*import { Command } from 'commander'

const program = new Command()

program
.option('-m, --mode <mode>', 'ambiente de desarrollo', 'dev')
.option()

program.parse()

const enviroment = program.opts().mode*/

const enviroment = 'dev'

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
    node_env: process.env.NODE_ENV
}
