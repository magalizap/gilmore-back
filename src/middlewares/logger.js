import config from "../config/envConfig.js"
import { devLogger } from "../logs/devLogger.js"
import { prodLogger } from "../logs/prodLogger.js"



export const addLogger = (req, res, next) => {

    if(config.node_env === 'dev'){
        req.logger = devLogger()
        req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    }

    if(config.node_env === 'prod'){
        req.logger = prodLogger()
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    }
    
    next() 
}

export const logger = (config.node_env === 'dev') ? devLogger() : prodLogger()