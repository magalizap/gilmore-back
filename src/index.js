import express from 'express'
import config from './config/envConfig.js'
import './config/dbConfig.js'
import './config/passportStrategy.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import productRouter from './routes/products.routes.js'
import userRouter from './routes/users.routes.js'
import sessionsRoutes from './routes/sessions.routes.js'
import cartRouter from './routes/carts.routes.js'
import chatRouter from './routes/chats.routes.js'
import { __dirname } from './utils/path.js'
import cors from 'cors'
import { addLogger, logger} from './middlewares/logger.js'

//import { Server } from 'socket.io'
//import * as path from 'path'

//config
const app = express()
app.use(addLogger)

const PORT = config.port || 8080


const server = app.listen(PORT, () => {
    logger.info(`Listening to port: ${PORT}`)
})

// Middlewares
app.use(express.json()) // para ejecutar JSON 
app.use(express.urlencoded({extended: true})) // req.query
app.use(cookieParser(config.signed_cookie))
app.use(cors())

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 210
    }),
    secret: config.session_secret,
    resave: false, //para que mi sesión se mantenga activa
    saveUninitialized: true // guarda mi sesión aunq no contenga info
}))
app.use(passport.initialize())// implementamos passport
app.use(passport.session())




// Routes
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/cart', cartRouter)
app.use('/' , chatRouter)
app.use('/loggerTest', (req, res) => {
    req.logger.info('ok, todo funciona')
    req.logger.debug("Debug")
    req.logger.http("Http")
    req.logger.warning("Warning")
    req.logger.error("Error")
    req.logger.fatal("Fatal")
    res.send('Probando Logger')
})




