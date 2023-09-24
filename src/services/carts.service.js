import CartManager from "../data/manager/carts.manager.js";

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


export const deleteOne = async (pid) => {
    try {
        const cart = await cartManager.deleteOne(pid)
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
        const updateQty = await cartManager.updateProduct(cid, pid, quantity)
        return updateQty
    } catch (error) {
        return error
    }
}
