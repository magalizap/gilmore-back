import ProductManager from "../data/manager/products.manager.js";


const productManager = new ProductManager()


export const findAll = async (filter, obj) => {
    try {
        const products = await productManager.findAll(filter, obj)
        return products
    } catch (error) {
        return error
    }
}

export const findById = async (id) => {
    try {
        const products = await productManager.findOneById(id)
        return products
    } catch (error) {
        return error
    }
}

export const createOne = async (obj) => {
    try {
        const products = await productManager.createOne(obj)
        return products
    } catch (error) {
        return error
    }
}
export const updateOne = async (id, obj) => {
    try {
        const updateProduct = await productManager.updateOne(id, obj)
        return updateProduct
    } catch (error) {
        return error
    }
}

export const deleteOne = async (id) => {
    try {
        const deleteProduct = await productManager.deleteOne(id)
        return deleteProduct
    } catch (error) {
        return error
    }
}