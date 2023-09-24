
import { findAll, findById, createOne, updateOne, deleteOne } from "../services/products.service.js";
import { v4 as uuidv4 } from 'uuid'; // genera un codigo random
import CustomError from '../services/custom/customError.js'
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from '../services/errors/info.js'
import { findOneById } from "../services/carts.service.js";


export const findAllProducts = async(req, res) => {
    const { status, limit, page, price } = req.query
    try {
        const getQuerys = await findAll(
            { status: status ?? true },                   
            { limit: limit ?? 6, page: page ?? 1, sort: { price: price ?? -1 }, lean: true }
        )

         
        getQuerys.prevLink = getQuerys.hasPrevPage ? `http://${req.headers.host}/api/products?page=${getQuerys.prevPage}` : null
        getQuerys.nextLink = getQuerys.hasNextPage ? `http://${req.headers.host}/api/products?page=${getQuerys.nextPage}`: null

        if(getQuerys){
            res.render('products', { products: getQuerys, style: 'products.css'})
        }else{
            res.status(200).send({message: 'No products'})

        }

    } catch (error) {
        req.logger.error('Error in findAllProducts')
        res.status(500).json({error: error})
    }
}

export const findOneProduct = async (req, res) => {
    const {pid} = req.params
    try {
        const product = await findById(pid)
        const cartContext = await findOneById(req.user.idCart)
        const arrayProducts = cartContext.products
        const isInCart = arrayProducts.some((prod) => prod.id_prod._id == pid)

        if(product){
            res.render('productDetail', {product, style: 'products.css', isInCart})

        }else{
            res.status(200).json({message: 'No product'})
        }
    } catch (error) {
        req.logger.error('Error in findOneProduct')
        res.status(500).json({error: error})
    }
}

export const createOneProduct = async (req, res, next) => {

    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body

        if(!title || !description || !price || !thumbnail || !code || !stock || !status || !category){
            //return res.status(400).json({message: 'Missing data'})
            CustomError.createError({
                name: 'Product creation error',
                cause: generateProductErrorInfo(req.body),
                message: 'Error trying to create Product',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
    
        let ownerEmail
    
        if (req.user.role === 'Premium'){
           ownerEmail = req.user.email 
        }

        const newProduct = await createOne({title, description, price, thumbnail, code, stock, status, category, owner: ownerEmail})

        res.status(200).send({message: 'Product create', product: newProduct})

    } catch (error) {
        req.logger.error('Error in createOneProduct')
        next(error)
    }
}

export const updateOneProduct = async (req, res) => {
    const pid = req.params.pid
    const product = await findById(pid)
    const obj = req.body
    try {
        // Verificar si el usuario es un admin o el dueño del producto
        if (req.user.role === 'Admin' || (req.user.role === 'Premium' && req.user.email === product.owner)){
            await updateOne(pid, obj) 
            res.status(200).send({message: "Product update"})
        }

    } catch (error) {
        req.logger.error('Error in updateOneProduct')
        res.status(500).json({error: error})
    }
}

export const deleteOneProduct = async (req, res) => {
    const pid = req.params.pid
    const product = await findById(pid)
    try {
        // Verificar si el usuario es un admin o el dueño del producto
        if (req.user.role === 'Admin' || (req.user.role === 'Premium' && req.user.email === product.owner)) {
            const deleteProduct = await deleteOne(pid)
            res.status(200).json({message: "Product delete", product: deleteProduct})
        }
        
    } catch (error) {
        req.logger.error('Error in deleteOneProduct')
        res.status(500).json({error: error})
    }
}
