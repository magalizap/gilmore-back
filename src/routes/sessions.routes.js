import { Router } from "express";
import passport from "passport";
import { findUsers, destroySession } from "../controllers/users.controller.js";
import { userModel } from "../data/models/users.model.js";
import { authAdmin, authUser } from "../middlewares/auth.js";

const sessionRouter = Router()


// PASSPORT LOCAL

sessionRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/api/sessions/errorSignup',
    successRedirect: '/api/sessions/login',
}))

sessionRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/sessions/errorLogin',
    successRedirect: '/api/products',

}), async(req, res) => {

    const user = await userModel.findOne({email})
    req.session.user = user
    res.send({payload: req.session.user})
})

sessionRouter.get('/logout', destroySession)

// PASSPORT GITHUB

sessionRouter.get('/githubSignup', passport.authenticate('githubSignup', {scope: ['user: email']}))

sessionRouter.get('/github', passport.authenticate('githubSignup', {failureRedirect: '/api/session/errorLogin', successRedirect: '/api/products'}))

                
sessionRouter.get('/current', authUser , findUsers)

export default sessionRouter