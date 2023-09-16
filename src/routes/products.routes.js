import { Router } from "express";
import { createOneProduct, deleteOneProduct, findAllProducts, findOneProduct, updateOneProduct } from "../controllers/products.controllers.js";
import { authAdminOrUserPremium, isAuthenticated } from "../middlewares/auth/auth.middleware.js";



const productRouter = Router()

// all users
productRouter.get('/', isAuthenticated ,findAllProducts)
productRouter.get('/:pid', isAuthenticated, findOneProduct)

// rol de admin or user premium
productRouter.post('/', authAdminOrUserPremium , createOneProduct)
productRouter.put('/:pid', authAdminOrUserPremium ,updateOneProduct)   
productRouter.delete('/:pid', authAdminOrUserPremium , deleteOneProduct)



export default productRouter