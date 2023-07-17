import UsersManager from "../data/manager/usersManager.js";
//import { findUserByEmail } from "../services/users.service.js";


export const findUsers = async (req, res) => {
    try {
       res.status(200).send(new UsersManager(req.user))
       console.log(req.user)
    } catch (error) {
        res.status(500).json({error})
        console.log('error')
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

export const signupUser = async (req, res) => {
    try {
        const user = await userModel.findOne({email})
        req.session.user = user
    } catch (error) {
        res.status(500).json({error})
    }
}

