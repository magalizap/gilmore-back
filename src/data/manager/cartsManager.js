import { cartModel } from "../models/carts.model.js";

// DAO

export default class CartManager {
    async createOne(obj) {
        try {
            const cart = await cartModel.create(obj)
            return cart
        } catch (error) {
            return error
        }
    }

    async findOneById(cid){
        try {
            const cartId = await cartModel.findOne(cid).populate('products.id_prod')
            return cartId
        } catch (error) {
            return error
        }
    }

    async addProductCart(cid, pid, quantity){
        try {
            const cart = this.findOneById(cid)
            const addProductToCart = { id_prod: pid, quantity: quantity}
            cart.products.push(addProductToCart)
            await cart.save()
            return cart
        } catch (error) {
            return error
        }

    }

    async deleteOne(cid, pid){
        try {
            const cart = this.findOneById(cid)
            cart.products.splice({id_prod: pid}, 1)
            await cart.save()
            return cart
        } catch (error) {
            return error
        }
    }

    async deleteCart(cid) {
        try {
            const emptyCart = this.findOneById(cid)
            emptyCart.products = []
            await emptyCart.save()
            return emptyCart
        } catch (error) {
            return error
        }
    }

    async updateOne(cid, pid, quantity){
        try {
            const cart = this.findOneById(cid)
            const arrayProducts = cart.products
            const findProd = arrayProducts.findIndex((prod) => prod.id_prod == pid)
            arrayProducts[findProd].quantity = arrayProducts[findProd].quantity + quantity
            const updateCart = await cartModel.updateOne({_id: cid}, {products: arrayProducts})
            return updateCart
        } catch (error) {
            return error
        }
    }

    async updateCart(cid, pid, quantity){
        try {
            const cart = this.findOneById(cid)
            cart.products = {products: [{id_prod: pid, quantity: quantity}]}
            return cart
        } catch (error) {
            return error
        }
    }
}

