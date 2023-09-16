// Middleware de autenticación de usuarios

export const isAuthenticated = (req, res, next) => {
    if(!req.user) return res.status(401).redirect('/api/users/login'), req.logger.error('Debes iniciar sesión primero')
        
    if (req.user.role === 'Admin') {
        res.locals.isAdmin = true
    } else if(req.user.role === 'Premium'){
        res.locals.isPremium = true
    }else {
        res.locals.isAdmin = false
        res.locals.isPremium = false
    }
    next()
}

export const authUser = (req, res, next) => {
    if(!req.user) return res.status(401).redirect('/api/users/login'), req.logger.error('Debes iniciar sesión primero')
    if(req.user.role === 'User') {
        req.logger.info('tienes rol de usuario')
        res.locals.isAdmin = false
        next()
    } else {
        req.logger.error('solo el usuario tiene acceso a esta ruta')
        return res.redirect('/api/products')
    } 
}

export const authAdminOrUserPremium = (req, res, next) => {

    if(!req.user) return res.status(401).redirect('/api/users/login'), req.logger.error('Debes iniciar sesión primero')
    if (req.user.role === 'Admin') {
        req.logger.info('tienes rol de administrador')
        res.locals.isAdmin = true
        next()
    } else if (req.user.role === 'Premium') {
        req.logger.info('tienes la cuenta premium')
        res.locals.isPremium = true
        next()
    }else {
        req.logger.error('no tienes los permisos suficientes')
        return res.redirect('/api/products')
    }
      
}


