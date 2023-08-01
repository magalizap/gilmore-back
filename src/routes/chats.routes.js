import { Router } from "express";
import { messageModel } from "../data/models/message.model.js";
import { logger } from "../middlewares/logger.js";

const chatRouter = Router()

chatRouter.get('/chat', async (req, res) => {
    try {
        //const message = await messageModel.find()
        req.io.on('message', (data) => {
            logger.ingo(data)
        })
        res.send('hola')
    } catch (error) {
        res.send(error)
    }
})

export default chatRouter