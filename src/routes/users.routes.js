import { Router } from "express";
import { changeRol, findOneUser, uploadProfile, uploads, validateToken, findUsers, deleteDisconnectedUsers } from "../controllers/users.controllers.js";
import uploader from "../middlewares/uploader.middleware.js";
import { authAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";




const userRouter = Router()

 
userRouter.get('/login', (req, res) => {
    res.render('login')
})

userRouter.get('/signup', (req, res) => {
    res.render('signup')
})

// RESTABLECER CONTRASEÑA
userRouter.get('/restore', (req, res) => {
    res.render('restore')
})

userRouter.get('/restorePass/:tokenPass', validateToken)

// ROLES DE USUARIO
userRouter.put('/premium/:uid', changeRol)

// SUBIDA DE ARCHIVOS
userRouter.post('/:uid/documents', uploader.array('document', 3), uploads)
userRouter.post('/:uid/current', isAuthenticated, uploader.single('profile'), uploadProfile)

// PERFILES DE USUARIOS
userRouter.get('/current', isAuthenticated, findOneUser)
userRouter.get('/', isAuthenticated, findUsers)
userRouter.delete('/', authAdmin, deleteDisconnectedUsers)


export default userRouter