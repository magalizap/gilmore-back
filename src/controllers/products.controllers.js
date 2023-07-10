import { findAll, findById, createOne, updateOne, deleteOne } from "../services/products.service.js";

export const findAllProducts = async(req, res) => {
    const { status, limit, page, price } = req.query
    try {
        const products = await findAll(
            { status: status ?? true },                   
            { limit: limit || 10, page: page ?? 1, sort: { price: price ?? -1 }}
        )
        products.prevLink = products.hasPrevPage ? `http://localhost:4000/api/products?page=${products.prevPage}` : null
        products.nextLink = products.hasNextPage ? `http://localhost:4000/api/products?page=${products.nextPage}`: null

        if(products){
            console.log(products)
            res.status(200).json({message: 'Products found', products: products})
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
            res.status(200).json({message: 'Product found'})
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

    try {
        const newProduct = await createOne([{title, description, price, thumbnail, code, stock, status, category}])
        res.status(200).json({message: 'Product create', product: newProduct})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const updateOneProduct = async (req, res) => {
    const pid = req.params.pid
    const {stock} = req.body

    try {
        const updateProduct = await updateOne({_id:pid}, {$inc: stock}) // revisar
        res.status(200).json({message: "Product update", product: updateProduct})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const deleteOneProduct = async (req, res) => {
    const pid = req.params.pid
    try {
        const deleteProduct = await deleteOne(pid)
        res.status(200).json({message: "Product delete", product: deleteProduct})
    } catch (error) {
        res.status(500).json({error})
    }
}
