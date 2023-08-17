import { Router } from "express";
import { changeRol, validateToken } from "../controllers/users.controller.js";



const userRouter = Router()

userRouter.get('/login', (req, res) => {
    res.render('login', {style: 'login.css'})
})

userRouter.get('/signup', (req, res) => {
    res.render('signup', {style: 'login.css'})
})

userRouter.get('/restore', (req, res) => {
    res.render('restore', {style: 'login.css'})
})

userRouter.get('/restorePass/:tokenPass', validateToken)

// ROLES DE USUARIO
userRouter.put('/premium/:uid', changeRol)

export default userRouter