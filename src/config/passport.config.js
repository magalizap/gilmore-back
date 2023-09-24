import passport from "passport";
import { userModel } from "../data/models/users.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {hashData, compareData} from '../utils/bcrypt.js'
import { cartModel } from "../data/models/carts.model.js";
import config from './env.config.js'


const initializePassport = async () => {
    // ESTRATEGIA LOCAL DE LOGIN
    passport.use('login', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, email, password, done) => {
        try {
            const user = await userModel.findOne({email})

            if(!user){
                return done(null, false, {message: 'Usuario no encontrado'})
            }
            const isPasswordValid = await compareData(password, user.password) 

            if(!isPasswordValid){
                return done(null, false, {message: 'Correo o contraseña incorrecta'})
            }

            done(null, user)
            
        } catch (error) {
            done(error)
        }
    }))


    // ESTRATEGIA LOCAL DE SIGNUP
    passport.use('signup', new LocalStrategy({
        passReqToCallback: true, 
        usernameField: 'email'
    }, async(req, email, password, done) => {
        try {
            const {password} = req.body
            const user = await userModel.findOne({email})
            if(user){
                return done(null, false, {message: 'Ya existe un usuario con ese correo'})
            }
            
            const hashPassword = await hashData(password)
            const newUser = {...req.body, password: hashPassword}
            const result = await userModel.create(newUser)

            const cart = await cartModel.create({products:[]})
            result.idCart = cart._id
            await result.save()
            return done(null, result)
        } catch (error) {
            done(error)
        }

    }))

    // PASSPORT - GITHUB
    passport.use('githubStrategy', new GithubStrategy({
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: `http://${req.headers.host}/api/sessions/github`
    }, async(accessToken, refreshToken, profile, done) => {
        const {name, email} = profile._json
        try {
            const user = await userModel.findOne({email})
            if(user){
                return done(null, user)
            }
            const newUser = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[2] || '',
                email,
                password: ' '
            }
            const saveUser = await userModel.create(newUser)
            const cart = await cartModel.create({products:[]})
            saveUser.idCart = cart._id
            await saveUser.save()
            
            done(null, saveUser)
        } catch (error) {   
            done(error)
        }
    }))


    // ESTRATEGIA LOGIN DE GOOGLE
    passport.use('googleStrategy', new GoogleStrategy({
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: "http://localhost:4000/api/sessions/google"
    }, async(accessToken, refreshToken, profile, done) => {
        const {given_name, family_name, email} = profile._json
        try {
            const userDB = await userModel.findOne({email})
            if(userDB){
                return done(null, userDB)
            }
            const user = {
                first_name: given_name,
                last_name: family_name || '',
                email,
                password: ' '
            }
            const newUserDB = await userModel.create(user)
            done(null, newUserDB)
        } catch (error) {
            done(null, error)
        }
    }))


    // SERIALIZAR Y DESERIALIZAR
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await userModel.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

export default initializePassport

