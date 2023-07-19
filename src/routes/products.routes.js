import { Router } from "express";
import { createOneProduct, deleteOneProduct, findAllProducts, findOneProduct, updateOneProduct } from "../controllers/products.controllers.js";
import { authAdmin } from "../middlewares/auth.js";


const productRouter = Router()

productRouter.get('/', findAllProducts)
productRouter.get('/:pid', findOneProduct)
productRouter.post('/', authAdmin , createOneProduct)
productRouter.put('/:pid', authAdmin , updateOneProduct)
productRouter.delete('/:pid', authAdmin , deleteOneProduct)

export default productRouter