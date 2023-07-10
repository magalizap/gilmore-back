import CartManager from "../data/manager/cartsManager.js";

const cartManager = new CartManager()


export const createOne = async (obj) => {
    try {
        const cart = await cartManager.createOne(obj)
        return cart
    } catch (error) {
        return error
    }

}   

export const findOneById = async (cid) => {
    try {
        const cartId = await cartManager.findOneById(cid)
        return cartId
    } catch (error) {
        return error
    }
}

export const addProductCart = async (cid, pid, quantity) => {
    try {
        const cart = await cartManager.findOneById(cid)
        const addProductToCart = { id_prod: pid, quantity: quantity}
        cart.products.push(addProductToCart)
        await cart.save()
        return cart
    } catch (error) {   
        return error
    }
}

export const deleteOne = async (cid, pid) => {
    try {
        const cart = await cartManager.findOneById(cid)
        cart.products.splice({id_prod: pid}, 1)
        await cart.save()
        return cart
    } catch (error) {
        return error
    }
}

export const deleteCart = async (cid) => {
    try {
        const emptyCart = await cartManager.findOneById(cid)
        emptyCart.products = []
        await emptyCart.save()
        return emptyCart
    } catch (error) {
        return error
    }
}

export const updateOne = async (cid, pid, quantity) => {
    try {
        const cart = await cartManager.findOneById(cid)
        const arrayProducts = cart.products
        const findProd = arrayProducts.findIndex((prod) => prod.id_prod == pid)
        arrayProducts[findProd].quantity = arrayProducts[findProd].quantity + quantity
        const updateCart = await cartManager.updateOne({_id: cid}, {products: arrayProducts})
        return updateCart
    } catch (error) {
        return error
    }
}

export const updateCart = async () => {
    try {
        const cart = await cartManager.findOneById(cid)
        cart.products = {products: [{id_prod: pid, quantity: quantity}]}
        return cart
    } catch (error) {
        return error
    }
}