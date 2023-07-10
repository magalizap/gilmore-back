import { Router } from "express";
import { addProduct,  createOneCart, deleteOneCart,  deleteOneProduct, findById,  updateOneCart, updateOneProduct } from "../controllers/carts.controllers.js";

const cartRouter = Router()

cartRouter.post('/', createOneCart)
cartRouter.get('/:cid', findById)
cartRouter.post('/:cid/product/:pid', addProduct)
cartRouter.delete('/:cid/product/:pid', deleteOneProduct)
cartRouter.delete('/:cid', deleteOneCart)
cartRouter.put('/:cid/product/:pid', updateOneCart)
cartRouter.put('/:cid', updateOneProduct)

export default cartRouter