import express from 'express'
import config from './config/env.config.js'
import './config/db.config.js'
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import productRouter from './routes/products.routes.js'
import userRouter from './routes/users.routes.js'
import sessionsRoutes from './routes/sessions.routes.js'
import cartRouter from './routes/carts.routes.js'
import paymentRouter from './routes/payment.routes.js'
import { __dirname } from './utils/path.js'
import addLogger from './middlewares/logger.middleware.js'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { Server } from 'socket.io'
import { swaggerServe, swaggerSetup } from './helpers/swagger.js'
import errorHandler from './middlewares/errors/index.js'
import sockets from './utils/sockets.js'
import viewRouter from './routes/views.routes.js'
import { logger } from './middlewares/logger.middleware.js'
import flash from 'connect-flash'
import methodOverride from 'method-override'



// Config
export const app = express()
const PORT = config.port || 8080
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server listening on port: ${PORT}`)
})

// Handlebars
app.engine('hbs', engine({runtimeOptions: 
    { allowProtoPropertiesByDefault: true, 
    allowProtoMethodsByDefault: true},
    extname: 'hbs',
    helpers: {eq: function(a, b, options){
        if(a === b){
            return options.fn(this)
        }else{
            return options.inverse(this)
        }
    }}
}))
app.set('view engine', 'hbs') // vistas hbs
app.set('views', path.resolve(__dirname, './views')) // ruta de mis vistas


// Middlewares
app.use(express.static(__dirname +'/public')) // ruta de mi carpeta public
app.use(express.json()) // para ejecutar JSON 
app.use(express.urlencoded({extended: true})) // req.query
app.use(cookieParser(config.signed_cookie))
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 210
    }),
    secret: config.session_secret,
    resave: false, //para que mi sesión se mantenga activa
    saveUninitialized: false // elimino las sesiones que están vacías
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(addLogger)
app.use(flash()) // alertas
app.use(methodOverride('_method')) // métodos

// Variables globales
app.use((req, res, next) => {
    res.locals.user = req.user || null  
    res.locals.success_msg = req.flash('success-msg')
    res.locals.error_msg = req.flash('error-msg')
    res.locals.error = req.flash('error') // passport
    next()
})


// ServerIO
const io = new Server(server, {cors: {origin: '*'}}) 
sockets(io)

// initialization
app.get('/', async (req, res) => {
    res.render('login')
})


// Routes
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/', viewRouter)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/cart', cartRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/docs', swaggerServe, swaggerSetup)


// Logger
app.use('/loggerTest', (req, res) => {
    req.logger.info('Info test')
    req.logger.debug("Debug test")
    req.logger.http("Http test")
    req.logger.warning("Warning test")
    req.logger.error("Error test")
    req.logger.fatal("Fatal test")
    res.send('Probando Logger')
})

// manejo de errores
app.use(errorHandler)