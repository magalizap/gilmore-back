
import UserDB from "../data/dto/userdb.js"
import { logger } from "../middlewares/logger.js"
import { findUserByEmail, findUserById, findUserByToken, findUserToUpdate } from "../services/users.service.js"
import crypto from 'crypto'
import { transporter } from "../utils/nodemailer.js"
import { hashData } from "../utils/bcrypt.js"

export const findUsers = async (req, res, next) => {
    try {
        const payload = new UserDB(req.user)
        if(payload){
            res.render('profile', {payload, style: 'profile.css'})
        }else {
            res.redirect('/api/users/login')
        }

    } catch (error) {
        res.status(500).json({error: error})
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
        res.status(500).json({error: 'error en destroySession'})
    }
}

export const signupUser = async (req, res) => {
    try {
        const user = await findUserByEmail(email)
        req.session.user = user
    } catch (error) {
        res.status(500).json({error: 'error en signupUser'})
    }
}

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
        res.status(500).json({error: 'error en restorePass'})
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
        res.status(500).json({error: 'error en validateToken'})
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
        res.status(500).json({error: 'error en updatePass'})
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
        res.status(500).json({error: 'error en changeRol'})
    }
}