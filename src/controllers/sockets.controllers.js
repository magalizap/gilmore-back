import { upload, userPremium, usersOnline } from "../utils/sockets.js"


export const messageChat = async(req, res) => {
    const user = req.user
    usersOnline(user)
    res.render('chat', { style: 'chat.css', script:'chat.js', user})
}

export const realtimeproducts = async (req, res) => {
    let ownerEmail

    if (req.user.role === 'Premium'){
       ownerEmail = req.user.email 
    }
    userPremium(ownerEmail)
    res.render('realtimeproducts', {style: 'products.css', script: 'main.js'})
}

export const realtimeUpload = async (req, res) => {
    console.log(req.file)
    const {path} = req.file

    const index = path.indexOf('/upload') !== -1 ? path.indexOf('/upload') : path.indexOf('\\upload')
    const newPath = path.substring(index)
    upload(newPath)
    res.render('realtimeproducts', {style: 'products.css', script: 'main.js'})
}