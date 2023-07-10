import { productModel } from "../models/products.model.js";

// DAO
export default class ProductManager {
    async findAll(obj){
        try {
            const products = await productModel.paginate(obj)
            return products
        } catch (error) {
            return error
        }
    }

    async findOneById(id){
        try {
            const product = await productModel.findById(id) 
            return product
        } catch (error) {
            return error
        }
    }

    async createOne(obj){
        try {
            const newProduct = await productModel.create(obj)
            return newProduct
        } catch (error) {
            return error   
        }
    }

    async updateOne(id, obj){
        try {
            const updateProduct = await productModel.updateOne({_id:id}, {$inc: obj})
            return updateProduct
        } catch (error) {
            return error
        }
    }

    async deleteOne(id){
        try {
            const deleteProduct = await productModel.deleteOne({_id:id})
            return deleteProduct
        } catch (error) {
            return error
        }
    }

}