import { userPremium, usersOnline } from "../utils/sockets.js"

export const messageChat = async(req, res) => {
    const user = req.user
    usersOnline(user)
    res.render('chat', { script:'chat.js', user})
}

export const realtimeproducts = async (req, res) => {
    const user = req.user
    let ownerEmail
    if (req.user.role === 'Premium'){
       ownerEmail = req.user.email 
    }
    userPremium(ownerEmail, user)
    res.render('realtimeproducts', {style: 'products.css', script: 'main.js'})
}

//opción con multer (NO IMPLEMENTADA)
/*
export const realtimeUpload = async (req, res) => {
    const {path} = req.file

    const index = path.indexOf('/upload') !== -1 ? path.indexOf('/upload') : path.indexOf('\\upload')
    const newPath = path.substring(index)
    upload(newPath)
    res.render('realtimeproducts', {style: 'products.css', script: 'main.js'})
}*/