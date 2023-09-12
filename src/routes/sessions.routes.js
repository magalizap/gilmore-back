import { Router } from "express";
import passport from "passport";
import { findUsers, destroySession, restorePass, updatePass, signupUser, loginUser } from "../controllers/users.controllers.js";
//import { userModel } from "../data/models/users.model.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import uploader from "../utils/uploader.js";
//import config from "../config/envConfig.js";


const sessionRouter = Router()


// PASSPORT LOCAL

sessionRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/api/users/signup',
    failureFlash: true
}), signupUser)

sessionRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/users/login',
    failureFlash: true
}), loginUser)

sessionRouter.get('/logout', destroySession)

// PASSPORT GITHUB
sessionRouter.get('/githubSignup', passport.authenticate('githubStrategy', {scope: ['user: email']}))
sessionRouter.get('/github', passport.authenticate('githubStrategy', {failureRedirect: '/api/session/errorLogin', successRedirect: '/api/products'}))


// PASSPORT GOOGLE
sessionRouter.get('/googleSignup', passport.authenticate('googleStrategy', { scope: ['profile', 'email'] }));
sessionRouter.get('/google', passport.authenticate('googleStrategy', {failureRedirect: '/api/session/errorLogin', successRedirect: '/api/products'}))

// PERFIL DEL USUARIO
sessionRouter.get('/current', isAuthenticated, findUsers)


// RESTAURACIÓN DE CONTRASEÑAS
sessionRouter.post('/restore', restorePass)
sessionRouter.post('/restorePass/:tokenPass', updatePass)




export default sessionRouter