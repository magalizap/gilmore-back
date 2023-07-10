import { createOne, findOneById, addProductCart, deleteCart, deleteOne, updateCart, updateOne } from "../services/carts.service.js";


export const createOneCart = async (req, res) => {
    try {
        const cart = await createOne([{products:[]}])
        res.status(200).json({message: 'create cart', cart: cart})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const findById = async (req, res) => {
    const cid = req.params.cid
    try {
        const cartId = await findOneById({_id: cid})
        res.status(200).json({message: 'Product found', cartId})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const addProduct = async (req, res) => {
    const cid = req.params.cid 
    const pid = req.params.pid
    const quantity = req.body.quantity
    try {
        const parsedQuantity = parseInt(quantity)
        const cart = await findOneById({_id: cid})
        const addProductToCart = { id_prod: pid, quantity: parsedQuantity}
        cart.products.push(addProductToCart)
        await cart.save()
        res.status(200).json({message: "El producto se ha añadido correctamente a su carrito"})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const deleteOneProduct = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        const cart = await findOneById({_id: cid})
        cart.products.splice({id_prod: pid}, 1)
        await cart.save()
        res.status(200).json({cart: cart})

    } catch (error) {
        res.status(500).json({error})
    }
}

export const deleteOneCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const emptyCart = await findOneById({_id: cid})
        emptyCart.products = []
        await emptyCart.save()
        res.status(200).json({cart: emptyCart})

    } catch (error) {
        res.status(500).json({error})
    }
}

export const updateOneCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const {quantity} = req.body
    try {
        const cart = await findOneById({_id: cid})
        const arrayProducts = cart.products
        const findProd = arrayProducts.findIndex((prod) => prod.id_prod == pid)
        arrayProducts[findProd].quantity = arrayProducts[findProd].quantity + quantity
        const updateCart = await updateOne({_id: cid}, {products: arrayProducts})
        res.status(200).json({cart: updateCart})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const updateOneProduct = async (req, res) => {
    const cid = req.params.cid
    const {pid} = req.body
    const {quantity} = req.body
    try {
        const cart = await findOneById({_id: cid})
        cart.products = {products: [{id_prod: pid, quantity: quantity}]}
        res.status(200).json({cart: cart})
    } catch (error) {
        res.status(500).json({error})
    }
}