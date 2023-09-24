import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
.option('-m, --mode <mode>', 'development environment', 'development')
.option('-m, --mode <mode>', 'testing environment', 'testing')
.option('-m, --mode <mode>', 'production environment', 'production')
.option('-f, --file <file>', 'the file to read')
.option('-t --timeout <timeout>', 'the timeout to read')

program.parse()

const environment = program.opts().mode

//const enviroment = 'dev'

let envFilePath = ''

if (environment === 'dev') {
  envFilePath = './.env.development'
} else if (environment === 'test') {
  envFilePath = './.env.testing'
} else {
  envFilePath = './.env.production'
}

dotenv.config({ path: envFilePath })


export default {
  port: +process.env.PORT,
  mongo_url: process.env.URL_MONGODB_ATLAS,
  signed_cookie: process.env.SIGNED_COOKIE,
  session_secret: process.env.SESSION_SECRET,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  mailing_user: process.env.MAILING_USER,
  mailing_service: process.env.MAILING_SERVICE,
  mailing_password: process.env.MAILING_PASSWORD,
  node_env: process.env.NODE_ENV || 'prod'
}
