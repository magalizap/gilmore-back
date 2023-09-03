import { userPremium } from "../utils/sockets.js"


export const messageChat = async(req, res) => {
    const user = req.user
    //const allUsers = await findAll()  --> probar luego mostrar usuarios conectados
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