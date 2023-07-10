import { Router } from "express";

const sessionRouter = Router()

sessionRouter.get('/', (req, res) => {
    res.render('login')
})

sessionRouter.get('/errorLogin', (req, res) => {
    res.render('errorLogin')
})

sessionRouter.get('/signup', (req, res) => {
    res.render('signup')
})

sessionRouter.get('/errorSignup', (req, res) => {
    res.render('errorSignup')
})

export default sessionRouter