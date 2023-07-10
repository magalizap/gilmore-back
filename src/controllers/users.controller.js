import { findByEmail } from "../services/users.service.js";

export const findUsers = async (req, res) => {
    try {
        const user = await findByEmail({email})
        req.session.user = user
        res.send({payload: req.user})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const destroySession = async (req, res) => {
    try {
        if(req.session.destroy){
            req.session.destroy(() => {
                res.redirect('/api/session')
            })
        }
       
    } catch (error) {
        res.status(500).json({error})
    }
}