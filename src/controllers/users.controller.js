import UserDB from "../data/DTO/userdb.js"



export const findUsers = async (req, res, next) => {
    try {
        res.status(200).send(new UserDB(req.user))
        next()
    } catch (error) {
        res.status(500).json({error})
        console.log('error')
    }
}

export const destroySession = async (req, res) => {
    try {
        if(req.session.destroy){
            req.session.destroy(() => {
                res.redirect('/api/sessions/login')
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


