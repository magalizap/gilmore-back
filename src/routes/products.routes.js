import { Router } from "express";
import { createOneProduct, deleteOneProduct, findAllProducts, findOneProduct, updateOneProduct } from "../controllers/products.controllers.js";
import { authAdminOrUserPremium, authUserOrUserPremium, isAuthenticated } from "../middlewares/auth.middleware.js";



const productRouter = Router()

// all users
productRouter.get('/', isAuthenticated ,findAllProducts)
productRouter.get('/:pid', authUserOrUserPremium, findOneProduct)

// rol de admin or user premium
productRouter.post('/', authAdminOrUserPremium , createOneProduct)
productRouter.put('/:pid', authAdminOrUserPremium ,updateOneProduct)   
productRouter.delete('/:pid', authAdminOrUserPremium , deleteOneProduct)



export default productRouter