import { Router } from "express";
import { authAdminOrUserPremium, isAuthenticated } from "../middlewares/auth.js";
import { messageChat, realtimeproducts } from "../controllers/messages.controllers.js";



const viewRouter = Router()

viewRouter.get('/chat', isAuthenticated, messageChat)
viewRouter.get('/realtimeproducts', authAdminOrUserPremium, realtimeproducts)


export default viewRouter

