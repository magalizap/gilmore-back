// Middleware de autenticación de usuarios
import { logger } from "./logger.js";

export const isAuthenticated = (req, res, next) => {
    if(!req.user) return res.redirect('/api/users/login')

    if (req.user.role === 'Admin') {
        res.locals.isAdmin = true;
    } else if(req.user.role === 'Premium'){
        res.locals.isPremium = true
    }else {
        res.locals.isAdmin = false;
        res.locals.isPremium = false
    }

    next();
}

export const authUser = (req, res, next) => {
    if(!req.user) return res.redirect('/api/users/login')
    if(req.user.role === 'User') {
        logger.info('tienes rol de usuario')
        res.locals.isAdmin = false
        next()
    } else {
        logger.error('solo el usuario tiene acceso a esta ruta')
        return res.redirect('/api/products')
    } 
}

export const authAdminOrUserPremium = (req, res, next) => {

    if(!req.user) return res.redirect('/api/users/login')
    if (req.user.role === 'Admin') {
        logger.info('tienes rol de administrador')
        res.locals.isAdmin = true
        next()
    } else if (req.user.role === 'Premium') {
        logger.info('tienes la cuenta premium')
        res.locals.isPremium = true
        next()
    }else {
        logger.error('no tienes los permisos suficientes')
        return res.redirect('/api/products')
    }
      
}


