import { Router } from "express";
import { authAdminOrUserPremium, isAuthenticated } from "../middlewares/auth.middleware.js";
import { messageChat, realtimeproducts } from "../controllers/sockets.controllers.js";



const viewRouter = Router()

viewRouter.get('/chat', isAuthenticated, messageChat)
viewRouter.get('/realtimeproducts', authAdminOrUserPremium, realtimeproducts)


export default viewRouter

