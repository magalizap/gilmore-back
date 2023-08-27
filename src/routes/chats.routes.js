import { Router } from "express";
import { messagesChat } from "../controllers/messages.controllers.js";
import { isAuthenticated } from "../middlewares/auth.js";


const chatRouter = Router()

chatRouter.get('/', isAuthenticated , messagesChat)

export default chatRouter