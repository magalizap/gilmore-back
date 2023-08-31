
import UserDB from "../data/dto/user.dto.js"
//import jwt from "jsonwebtoken"
import { logger } from "../middlewares/logger.js"
import { createUser, findUserByEmail, findUserById, findUserByToken, findUserToUpdate } from "../services/users.service.js"
import crypto from 'crypto'
import { transporter } from "../utils/nodemailer.js"
import { hashData, compareData } from "../utils/bcrypt.js"
import config from "../config/envConfig.js"

export const findUsers = async (req, res, next) => {
    try {
        //const payload = new UserDB(req.user)
        const payload = UserDB.getUserTokenFrom(req.user)

        if(config.node_env === 'prod'){
            if(payload){
                res.render('profile', {payload, style: 'profile.css'})
            }else {
                res.redirect('/api/users/login')
            }
        }else if(config.node_env === 'dev'){
            if(payload){
                res.status(200).send({payload})
            }else if(!payload){
                res.status(404).send({status:"error",error:"User doesn't exist"})
            }
        }



        /*if(payload){
            res.render('profile', {payload, style: 'profile.css'})
        }else {
            res.redirect('/api/users/login')
        }*/

    } catch (error) {
        res.status(500).send({status:"error"})
        logger.error('error en findUsers')
    }
}

export const destroySession = async (req, res) => {
    try {
        if(req.session.destroy){
            req.session.destroy(() => {
                res.redirect('/api/users/login')
            })
        }
       
    } catch (error) {
        req.logger.error('Error in destroySession')
        res.status(500).json({error: error})
    }
}
/*
export const signupUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, age, role } = req.body
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" })
        const exists = await findUserByEmail(email)
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" })
        const hashedPassword = await hashData(password)
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age,
            role
        }
        let result = await createUser(user)
        console.log(result)
        
        res.send({ status: "success", payload: result._id })
    } catch (error) {
        res.status(500).json({error: 'error en signupUser'})
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" })
    const user = await findUserByEmail(email)
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"})

    const isValidPassword = await compareData(password, user.password)
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"})

    const userDto = UserDB.getUserTokenFrom(user)
    console.log(userDto)
    const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"})

    /*if(config.node_env === 'dev'){
        res.cookie('coderCookie', token, {maxAge:3600000}).send({status:"success",message:"Logged in"})
    }else {
        res.cookie('coderCookie', token, {maxAge:3600000}).redirect('/api/products') // Redirección en producción
    }

    res.cookie('coderCookie', token, {maxAge:3600000}).send({status:"success",message:"Logged in"})
    
}*/


export const restorePass = async (req, res) => {
    try {
        const email = req.body.email
        const user = await findUserByEmail(email)

        // agregar validación si no encuentra al usuario

        // si el usuario si existe, genero token de acceso
        user.tokenPass = crypto.randomBytes(20).toString('hex')

        user.timeToExpiredPass = Date.now() + 3600000  // le doy 1 hora de expiración
        
        await user.save() // guardo en DB
        
        const resetUrl = `http://${req.headers.host}/api/users/restorePass/${user.tokenPass}`

        // crear mailing para acceso al token
        await transporter.sendMail({
            to: email,
            subject:'Restablece tu contraseña',
            html: `<h2>¡Hola, ${email}!</h2> <p>Para reestablecer su contraseña, haga click <a href=${resetUrl}>aqui</a></p>`
        })
        console.log(resetUrl)
        logger.info('Todo ok! revisa la casilla de correo')
        res.redirect('/api/users/login')

    } catch (error) {
        req.logger.error('Error in restorePass')
        res.status(500).json({error: error})
    }
}

export const validateToken = async (req, res) => {
    const tokenPass = req.params.tokenPass
    try {
        const user = await findUserByToken(tokenPass)
        console.log(user)
        // agregar validacion si el user no existe

        res.render('restorePass', {tokenPass, style: 'login.css'})

    } catch (error) {
        req.logger.error('Error in validateToken')
        res.status(500).json({error: error})
    }
}

export const updatePass = async (req, res) => {
    try {
        const user = await findUserToUpdate({
            // valido según la fecha de expiración
            tokenPass: req.params.tokenPass,
            timeToExpiredPass: {$gt:Date.now()}
        })

        if(!user){
            res.redirect('/api/users/restore')
        }
        //restableciendo contraseña
        user.tokenPass = null
        user.timeToExpiredPass = null

        const {password} = req.body

        // hasheamos la nueva contraseña
        const hashNewPass = await hashData(password)
        
        user.password = hashNewPass
        await user.save()
        logger.info('todo increíblemente ok')
        res.redirect('/api/users/login')


    } catch (error) {
        req.logger.error('Error in updatePass')
        res.status(500).json({error: error})
    }
}

export const changeRol = async (req, res) => {
    try {
        const uid = req.params.uid
        const user = await findUserById(uid)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Cambiar el rol del usuario
        user.role = user.role === 'User' ? 'Premium' : 'User'
        await user.save()

        res.status(200).json({ message: 'Rol del usuario actualizado exitosamente'})

    } catch (error) {
        req.logger.error('Error in changeRol')
        res.status(500).json({error: error})
    }
}