import winston from "winston";
import config from "../config/env.config.js";
import { __dirname } from "../utils/path.js";

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

const transports = [
    new winston.transports.Console({
        level: config.node_env === 'production' ? 'info' : 'debug',
        format: consoleFormat
    })
]

if (config.node_env === 'production') {
    transports.push(
        new winston.transports.File({
            filename: __dirname + '/logs/error.log',
            level: 'error',
            format: fileFormat
        })
    )
}

const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: transports,
})

const addLogger = (req, res, next) => {
    req.logger = logger
    const loggerLevel = config.node_env === 'production' ? 'info' : 'debug'
    req.logger.log(loggerLevel, `${req.method} at ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

export default addLogger

export { logger }
