import { Router } from "express";
import { addProduct,  createOneCart, deleteOneCart,  deleteOneProduct, findById,  purchaseCart,  updateOneCart, updateOneProduct } from "../controllers/carts.controllers.js";
import { authUserOrUserPremium } from "../middlewares/auth.middleware.js";

const cartRouter = Router()

cartRouter.post('/', createOneCart)

cartRouter.get('/:cid',findById)
cartRouter.put('/:cid', updateOneProduct)
cartRouter.delete('/:cid', deleteOneCart)

cartRouter.post('/:cid/product/:pid', authUserOrUserPremium ,addProduct)
cartRouter.delete('/:cid/product/:pid', authUserOrUserPremium, deleteOneProduct)
cartRouter.put('/:cid/product/:pid', authUserOrUserPremium, updateOneCart)

cartRouter.post('/:cid/purchase', authUserOrUserPremium ,purchaseCart) 

export default cartRouter
