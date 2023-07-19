import { Router } from "express";
import { messageModel } from "../data/models/message.model.js";

const chatRouter = Router()

chatRouter.get('/chat', async (req, res) => {
    try {
        //const message = await messageModel.find()
        req.io.on('message', (data) => {
            console.log(data)
        })
        res.send('hola')
    } catch (error) {
        res.send(error)
    }
})

export default chatRouter