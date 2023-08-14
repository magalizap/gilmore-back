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
import { addLogger, logger} from './middlewares/logger.js'
import { engine } from 'express-handlebars'
import * as path from 'path'


//import { Server } from 'socket.io'



//config
const app = express()
const PORT = config.port || 8080
const server = app.listen(PORT, () => {
    logger.info(`Listening to port: ${PORT}`)
})

//hbs
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
app.set('views', path.resolve(__dirname, './views')) //mi ruta


// Middlewares
app.use(express.static(__dirname +'/public'))
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
    saveUninitialized: true // guarda mi sesión aunq no contenga info
}))
app.use(passport.initialize())// implementamos passport
app.use(passport.session())
app.use(addLogger)

// variables globales

app.use((req, res, next) => {
    res.locals.user = req.user || null  
    next()
})


// ServerIO y acceso a las rutas
/*const io = new Server(server, {cors: {origin: '*'}}) 
app.use((req, res, next) => {
    req.io = io
    return next()
})*/



// Routes
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/cart', cartRouter)
app.use('/chat' , chatRouter)


app.use('/loggerTest', (req, res) => {
    req.logger.info('ok, todo funciona')
    req.logger.debug("Debug")
    req.logger.http("Http")
    req.logger.warning("Warning")
    req.logger.error("Error")
    req.logger.fatal("Fatal")
    res.send('Probando Logger')
})
