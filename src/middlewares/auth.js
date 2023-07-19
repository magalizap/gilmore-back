// Middleware de autenticación de usuarios

export const authUser = (req, res, next) => {
    if(!req.user){
        return res.status(401).send('Debes iniciar sesión primero')
    }
    if(req.user.role !== 'User'){
        return res.status(401).send({ error: "User no posee los permisos necesarios" })
    }
    next()
}

export const authAdmin = (req, res, next) => {
    if(!req.user){
        return res.status(401).send('Debes iniciar sesión primero')
    }
    if(req.user.role !== 'Admin'){
        return res.status(500).json({error})
    }
    next()
}
/*
export const roleVerification = (role) => {
    return async (req, res, next) => {
        const userAccess = req.user.user[0]
        if (!req.user) {
            return res.status(401).send({ error: "User no autorizado" })
        }

        if (userAccess.rol != role) { //El user no tiene el rol necesario a esta ruta y a este rol
            return res.status(401).send({ error: "User no posee los permisos necesarios" })
        }

        next()

    }

} 
*/

