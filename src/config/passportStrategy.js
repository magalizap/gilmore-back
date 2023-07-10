import passport from "passport";
import { userModel } from "../data/models/users.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import {hashData, compareData} from '../utils/bcrypt.js'
import { cartModel } from "../data/models/carts.model.js";
import config from './config.js'

// ESTRATEGIA LOCAL DE LOGIN
passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
}, async(req, email, password, done) => {
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return done(null, false)
        }
        const isPasswordValid = await compareData(password, user.password) 
        if(!isPasswordValid){
            return done(null, false)
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
            return done(null, false)
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

// ESTRATEGIA LOGIN DE GITHUB
passport.use('githubSignup', new GithubStrategy({
    clientID: config.github_client_id,
    clientSecret: config.github_client_secret,
    callbackURL: "http://localhost:4000/api/users/github"
}, async(accessToken, refreshToken, profile, done) => {
    console.log(profile)
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