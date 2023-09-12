import { Router } from "express";
import { addProduct,  createOneCart, deleteOneCart,  deleteOneProduct, findById,  purchaseCart,  updateOneCart, updateOneProduct } from "../controllers/carts.controllers.js";
import { authUser } from "../middlewares/auth.middleware.js";

const cartRouter = Router()

cartRouter.post('/', createOneCart)

cartRouter.get('/:cid', findById)
cartRouter.put('/:cid', updateOneProduct)
cartRouter.delete('/:cid', deleteOneCart)


cartRouter.post('/:cid/product/:pid', authUser ,addProduct)
cartRouter.delete('/:cid/product/:pid', deleteOneProduct)
cartRouter.put('/:cid/product/:pid', updateOneCart)


cartRouter.post('/:cid/purchase', purchaseCart) 

export default cartRouter
