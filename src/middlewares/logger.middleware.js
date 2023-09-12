import winston from "winston";
import config from "../config/env.config.js";
import { __dirname } from "../utils/path.js";

winston.transports.File.prototype.setMaxListeners(15) 
/*
 solución temporal encontrada (aún así no funciona), actualicé dependencias, optimicé el uso de los loggers y  comenté uno de los transportes de archivos pero no   me elimina la advertencia.
 */ 
process.on('warning', e => console.warn(e.stack))

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "cyan"
    }
}

const consoleFormat = winston.format.combine(
    winston.format.colorize({ colors: levelOptions.colors }),
    winston.format.simple()
)

const fileFormat = winston.format.combine(
    winston.format.simple()
)

const loggingConfig = {
    dev: [
        new winston.transports.Console({
            level: 'debug',
            format: consoleFormat
        }),
        /*new winston.transports.File({
            filename: __dirname + '/logs/info.log', 
            level: 'info', 
            format: fileFormat
        })*/
    ],
    prod: [
        new winston.transports.Console({
            level: 'info',
            format: consoleFormat
        }),
        new winston.transports.File({
            filename: __dirname + '/logs/error.log', 
            level: 'error', 
            format: fileFormat
        }) 
    ],
    test: [
        new winston.transports.Console({
            level: 'debug',
            format: consoleFormat
        }),
    ],
}

const addLogger = (req, res, next) => {
    
    req.logger = winston.createLogger({
        levels: levelOptions.levels,
        transports: loggingConfig[config.node_env]
    })
    const loggerLevel = config.node_env === 'prod' ? 'info' : 'debug'
    req.logger.log(loggerLevel,`${req.method} at ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()
}

export default addLogger
//para usar en la escucha al puerto y bbd
export const logger = winston.createLogger({
    transports: loggingConfig[config.node_env]
})
