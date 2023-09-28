import { Router } from "express";
import { authAdminOrUserPremium, isAuthenticated } from "../middlewares/auth.middleware.js";
import { messageChat, realtimeproducts } from "../controllers/sockets.controllers.js";
//import uploader from "../middlewares/uploader.middleware.js";



const viewRouter = Router()

viewRouter.get('/chat', isAuthenticated, messageChat)
viewRouter.get('/realtimeproducts', authAdminOrUserPremium, realtimeproducts)

//opción con multer (NO IMPLEMENTADA)
///viewRouter.post('/realtimeproducts/upload', authAdminOrUserPremium, uploader.single('products'), realtimeUpload)

export default viewRouter

