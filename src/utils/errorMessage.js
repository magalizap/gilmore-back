import passport from "passport"

export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error){
                return next(error)
            }
            if(!user){
                return res.status(401).json({error: info.message ? info.message : info.toString()})
            }
            req.session.user = user
            res.status(200).json({payload: req.user})
            next()
        })(req, res, next)
    }
}

export const roleVerification = (isAdmin) => {
    return async(req, res, next) => {
        if(!req.user){
            return res.status(401).json({error: 'User no autorizado'})
        }
        if(userData.isAdmin != isAdmin){
            return res.status(401).json({error: 'User no posee permisos necesarios'})
        }
        next()
    }

}