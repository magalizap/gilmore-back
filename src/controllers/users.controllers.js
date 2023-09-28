
import { UserDTO, UserListDTO } from "../data/dto/user.dto.js"
//import jwt from "jsonwebtoken"
import { findAllUsers, findUserByEmail, findUserById, findUserByToken, findUserToUpdate, updateUser, deleteUsers } from "../services/users.service.js"
import crypto from 'crypto'
import { transporter } from "../helpers/nodemailer.js"
import { hashData } from "../utils/bcrypt.js"
import config from "../config/env.config.js"

export const findOneUser = async (req, res) => {
    try {
        const payload = new UserDTO(req.user)
        //const payload = UserDB.getUserTokenFrom(req.user)

        if(config.node_env === 'test'){
            if(payload){
                res.status(200).send({payload})
            }else if(!payload){
                res.status(404).send({status:"error",error:"User doesn't exist"})
            }
        }else {
            if(payload){
                res.render('profile', {payload, style: 'profile.css', script: 'profile.js'})
            }else {
                res.redirect('/api/users/login')
            }
        }

    } catch (error) {
        res.status(500).send({status:"error"})
        req.logger.error('error in findOneUser')
    }
}


export const destroySession = async (req, res) => {
    try {
       const user = req.user
       user.last_connection = Date.now()
       user.save()
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

export const signupUser = async (req, res) => {
    try {
        const {email} = req.body
        const user = await findUserByEmail(email)
        req.session.user = user
        if(config.node_env === 'test'){
            res.send({payload: user._id})
        }else {
            req.flash('success-msg', `Bienvenido/a ${user.first_name}!`)
            res.redirect('/api/products')
        }
    } catch (error) {
        req.logger.error('Error in signupUser')

        res.status(500).json({error: error})
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email} = req.body
        const user = await findUserByEmail(email)
        req.session.user = user
        user.last_connection = Date.now()
        user.save()
        if(config.node_env === 'test'){
            res.send({payload: user._id})
        }else {
            req.flash('success-msg', `Bienvenido/a ${user.first_name}!`)
            res.redirect('/api/products')
        }
        
    } catch (error) {
        req.logger.error('Error in loginUser')
        res.status(500).json({error: error})
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
        //console.log(resetUrl)
        req.logger.info('Todo ok! revisa la casilla de correo')
        req.flash('success-msg', 'Revisa tu casilla de correo')
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
        // agregar validacion si el user no existe

        res.render('restorePass', {tokenPass})

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
        req.logger.info('todo increíblemente ok')
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

        // si mi usuario subió los 3 documentos requeridos
        if(user.documents.length === 3){
            // Cambio a user premium
            await updateUser({ _id: uid }, { role: 'Premium' }, { new: true })
        }else {
            req.flash('error-msg', 'No has llenado todos los campos')
            return res.status(404).redirect('/api/users')
            //return res.status(404).json({ message: 'No has llenado todos los campos' })
        }
        req.flash('success-msg', 'Rol del usuario actualizado exitosamente!')
        res.status(200).redirect('/api/users')

    } catch (error) {
        req.logger.error('Error in changeRol')
        res.status(500).json({error: error})
    }
}

export const uploads = async (req, res) => {
    try {

        const uid = req.params.uid
        const payload = await findUserById(uid)

        for (const uploadedFile of req.files){
            const { originalname, path } = uploadedFile
            const index = path.indexOf('/upload') !== -1 ? path.indexOf('/upload') : path.indexOf('\\upload');
            const newPath = path.substring(index)

            const saveDocs = { name: originalname, reference: newPath }
            payload.documents.push(saveDocs)
            await payload.save()
        }
        
        res.redirect('/api/users/current')
        
    } catch (error) {
        req.logger.error('Error in uploads')
        res.status(500).json({ error: error })
    }
}


export const uploadProfile = async (req, res) => {
    try {
        const uid = req.params.uid
        const payload = await findUserById(uid)
    
        const { path } = req.file
    
        const index = path.indexOf('/upload') !== -1 ? path.indexOf('/upload') : path.indexOf('\\upload')
        const newPath = path.substring(index)
        payload.imageProfile = newPath
        await payload.save()
        
        res.redirect('/api/sessions/current')
        
    } catch (error) {
        req.logger.error('Error in uploads')
        res.status(500).json({ error: error })
    }
}


export const findUsers = async (req, res) => {
    try {
        const users = await findAllUsers()
        const payload = new UserListDTO(users)

        if(payload){
            res.render('usersList', { payload })
        }else {
            res.redirect('/api/users/login')
        }
    } catch (error) {
        res.status(500).send({status:"error"})
        req.logger.error('error in findOneUser')
    }
}

export const deleteDisconnectedUsers = async (req, res) => {
    try {
        const today = new Date()
        const twoDaysAgo = new Date(today)
        twoDaysAgo.setDate(today.getDate() - 2) // Retrocede 2 días desde hoy

        const disconnectedUsers = await deleteUsers({
            last_connection: { $lt: twoDaysAgo }
        })

        req.logger.info('Usuarios eliminados por inactividad:', disconnectedUsers)

        if (disconnectedUsers.deletedCount >= 1) {
            await transporter.sendMail({
                to: disconnectedUsers.map((user) => user.email).join(', '),
                subject: 'Usuario eliminado por inactividad',
                html: `<p>Hola!. Te notificamos que tu cuenta registrada en <strong>Matesuli</strong> ha sido eliminada por inactividad.</p>`,
            })
        }
        req.flash('success-msg', 'Usuarios eliminados correctamente')
        res.status(200).redirect('/api/users')
    } catch (error) {
        req.logger.error('Error al eliminar usuarios inactivos:', error) 
        res.status(500).json({ error: 'Error interno del servidor.' })
    }
}
