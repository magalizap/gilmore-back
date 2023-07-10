import { Router } from "express";
import passport from "passport";
import { destroySession, findUsers } from "../controllers/users.controller.js";

const userRouter = Router()

// PASSPORT LOCAL

userRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/api/session/errorSignup',
    successRedirect: '/api/session'
}))

userRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/session/errorLogin',
    successRedirect: '/realtimeproducts'
}), findUsers)

userRouter.get('/logout', destroySession)

// PASSPORT GITHUB

userRouter.get('/githubSignup', passport.authenticate('githubSignup', {scope: ['user: email']}))
userRouter.get('/github', passport.authenticate('githubSignup', {
    failureRedirect: '/api/session/errorLogin', 
    successRedirect: '/realtimeproducts'
}))

export default userRouter