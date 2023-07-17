import { Router } from "express";
import passport from "passport";
import { findUsers, destroySession } from "../controllers/users.controller.js";
import { userModel } from "../data/models/users.model.js";

const sessionRouter = Router()


// PASSPORT LOCAL

sessionRouter.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/api/sessions/errorSignup',
    successRedirect: '/api/products',
}))

sessionRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/sessions/errorLogin',
    successRedirect: '/api/products',

}), async(req, res) => {

    const user = await userModel.findOne({email})
    req.session.user = user
    res.send({payload: req.user})
})

sessionRouter.get('/logout', destroySession)

// PASSPORT GITHUB

sessionRouter.get('/githubSignup', passport.authenticate('githubSignup', {scope: ['user: email']}))

sessionRouter.get('/github', passport.authenticate('githubSignup', {failureRedirect: '/api/session/errorLogin', successRedirect: '/api/products'}))

//no funciona
sessionRouter.get('/current', findUsers )

export default sessionRouter