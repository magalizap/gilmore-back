import { productModel } from "../data/models/products.model.js";
import { findAll, findById, createOne, updateOne, deleteOne } from "../services/products.service.js";
import { v4 as uuidv4 } from 'uuid'; // genera un codigo random

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
        const newProduct = await createOne({title, description, price, thumbnail, code, stock, status, category, owner: ownerEmail})

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

export const realtimeproducts = async (req, res) => {

    let ownerEmail

    if (req.user.role === 'Premium'){
       ownerEmail = req.user.email 
    }

    try {
        // mi listado actual de productos
        const products = await findAll()
        req.io.on('connection', async (socket) => {
            console.log('Client connected in realtimeproducts')
            //envío el listado de mis productos
            socket.emit('allProducts', products.docs)
            //recibo el nuevo producto creado
            socket.on('newProduct', (data) => {
                newData(data)
            })
            //cargo la data y la guardo en mi BD
            const newData = async(data) =>{
                const newProduct = new productModel({
                    title: data.title, 
                    description: data.description,
                    price: data.price, 
                    //thumbnail: data.thumbnail, 
                    code: uuidv4(), 
                    owner: ownerEmail,
                    stock: data.stock, 
                    category: data.category, 
                })
                console.log(newProduct)
                await newProduct.save()
                //la envío al cliente para visualizarla en tiempo real
                socket.emit('saveProduct', newProduct)
            }

            // falta agregar lógica de actualización y eliminación
        
        })



        res.render('realtimeproducts', {style: 'products.css'})


    } catch (error) {
        res.status(500).json({error: 'error en realtimeproducts'})
    }
}