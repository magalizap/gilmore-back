import { userPremium, usersOnline } from "../utils/sockets.js"


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