
import { findAll, findById, createOne, updateOne, deleteOne } from "../services/products.service.js";
import { v4 as uuidv4 } from 'uuid'; // genera un codigo random
import CustomError from '../services/custom/customError.js'
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from '../services/errors/info.js'


export const findAllProducts = async(req, res) => {
    const { status, limit, page, price } = req.query
    try {
        const getQuerys = await findAll(
            { status: status ?? true },                   
            { limit: limit ?? 10, page: page ?? 1, sort: { price: price ?? -1 }, lean: true }
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
        if(product){
            res.render('productDetail', {product, style: 'products.css'})

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

export const realtimeproducts = async (req, res) => {

    let ownerEmail

    if (req.user.role === 'Premium'){
       ownerEmail = req.user.email 
    }

    try {

        req.io.on('connection', async (socket) => {

            console.log('Client connected in realtimeproducts')
            const emitProd = async () => {
                const products = await findAll()
                //envío el listado de mis productos
                socket.emit('server:loadProducts', products.docs)

            }
           
            emitProd() // envío mi arreglo de productos

            socket.on('client:newProduct', async (data) => {
                const newProduct = await createOne({
                    title: data.title, 
                    description: data.description,
                    price: data.price, 
                    //thumbnail: data.thumbnail, 
                    code: uuidv4(), 
                    owner: ownerEmail,
                    stock: data.stock, 
                    category: data.category, 
                })
                //const saveProduct = await newProduct.save()

                socket.emit('server:newProduct', newProduct) // envío los datos del nuevo producto creado
            })

            socket.on('client:deleteProduct', async (pid) => { // elimino el producto seleccionado y actualizo el front
                await deleteOne(pid)
                emitProd()
            })

            socket.on('client:getProduct', async pid => {
                const product = await findById(pid)
                socket.emit('server:selectedProduct', product)
            })

            socket.on('client:updateProduct', async (updateProd) => {
                await updateOne(updateProd._id, {
                    title: updateProd.title,
                    category: updateProd.category, 
                    price: updateProd.price, 
                    stock: updateProd.stock, 
                    description: updateProd.description, 
                    thumbnail: updateProd.thumbnail
                })
                emitProd()
            })

            socket.on("disconnect", async () => {
                console.log(socket.id, "disconnected")
            })
        
        })
        res.render('realtimeproducts', {style: 'products.css', script: 'main.js'})
    } catch (error) {
        req.logger.error('Error in realtimeproducts')
        res.status(500).json({error: error})
    }
}