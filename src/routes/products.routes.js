import { Router } from "express";
import { createOneProduct, deleteOneProduct, findAllProducts, findOneProduct, updateOneProduct } from "../controllers/products.controllers.js";


const productRouter = Router()

productRouter.get('/', findAllProducts)
productRouter.get('/:pid', findOneProduct)
productRouter.post('/', createOneProduct)
productRouter.put('/:pid', updateOneProduct)
productRouter.delete('/:pid', deleteOneProduct)

export default productRouter