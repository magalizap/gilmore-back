import { cartModel } from "../models/carts.model.js";

// DAO --> (única persistencia)

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


    async deleteOne(pid){
        try {
            const cart = await cartModel.findByIdAndDelete(pid)
            return cart
        } catch (error) {
            return error
        }
    }

    async deleteCart(cid) {
        try {
            const emptyCart = await cartModel.findOne(cid)
            emptyCart.products = []
            await emptyCart.save()
            return emptyCart
        } catch (error) {
            return error
        }
    }

    async updateProduct(cid, pid, quantity){
        try {
            const updateQty = await cartModel.updateOne({_id:cid, 'products.id_prod': pid}, {$inc: {'products.$.quantity': parseInt(quantity)}})
            return updateQty
        } catch (error) {
            return error
        }
    }
}
