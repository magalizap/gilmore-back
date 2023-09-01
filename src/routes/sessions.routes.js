import { Router } from "express";
import passport from "passport";
import { findUsers, destroySession, restorePass, updatePass, signupUser, loginUser } from "../controllers/users.controller.js";
//import { userModel } from "../data/models/users.model.js";
import { isAuthenticated } from "../middlewares/auth.js";
//import config from "../config/envConfig.js";


const sessionRouter = Router()


// PASSPORT LOCAL

sessionRouter.post('/signup', passport.authenticate('signup'), signupUser)

sessionRouter.post('/login', passport.authenticate('login'), loginUser)


/*
sessionRouter.post('/signup', signupUser)

sessionRouter.post('/login', loginUser)*/

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