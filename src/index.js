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
import { __dirname } from './utils/path.js'
import cors from 'cors'
//import * as path from 'path'

const app = express()

// Middlewares
app.use(express.json()) // para ejecutar JSON 
app.use(express.urlencoded({extended: true})) // req.query
app.use(cookieParser(config.signed_cookie))
app.use(cors({origin: 'http://localhost:3000'}))

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

const PORT = config.port || 8080

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})


