import { findAll, findById, createOne, updateOne, deleteOne } from "../services/products.service.js";

export const findAllProducts = async(req, res) => {
    const { status, limit, page, price } = req.query
    try {
        const getQuerys = await findAll(
            { status: status ?? true },                   
            { limit: limit || 6, page: page ?? 1, sort: { price: price ?? -1 }, lean: true }
        )
        getQuerys.prevLink = getQuerys.hasPrevPage ? `http://${req.headers.host}/api/products?page=${getQuerys.prevPage}` : null
        getQuerys.nextLink = getQuerys.hasNextPage ? `http://${req.headers.host}/api/products?page=${getQuerys.nextPage}`: null

        const products = getQuerys.docs.map(({price, title, stock, status, code, category, _id}) => {
            return {price, title, stock, status, code, category, _id}
        })
        // pruebo enviar mi lista de productos de esta manera
        req.io.emit('getProducts', products)

        if(getQuerys){
            res.render('products', {getQuerys, style: 'products.css'})
        }else{
            res.status(200).json({message: 'No products'})
        }

    } catch (error) {
        res.status(500).json({error})
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
        res.status(500).json({error}) 
    }
}

export const createOneProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body

    if(!title || !description || !price || !thumbnail || !code || !stock || !status || !category){
        return res.status(400).json({message: 'Missing data'})
    }

    let ownerEmail

    if (req.user.role === 'Premium'){
       ownerEmail = req.user.email 
    }


    try {
        const newProduct = await createOne([{title, description, price, thumbnail, code, stock, status, category, owner: ownerEmail}])

        res.status(200).json({message: 'Product create', product: newProduct})
    } catch (error) {
        res.status(500).json({error: 'error en createOneProduct'})
    }
}

export const updateOneProduct = async (req, res) => {
    const pid = req.params.pid
    const product = await findById(pid)
    const obj = req.body
    try {
        // Verificar si el usuario es un admin o el dueño del producto
        if (req.user.role === 'Admin' || (req.user.role === 'Premium' && req.user.email === product.owner)){
            const updateProduct = await updateOne(pid, obj) 
            res.status(200).json({message: "Product update"})
        }

    } catch (error) {
        res.status(500).json({error: 'error en updateOneProduct'})
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
        res.status(500).json({error: 'error en deleteOneProduct'})
    }
}