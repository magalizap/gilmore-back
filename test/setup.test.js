import mongoose from "mongoose";
import config from "../src/config/env.config.js";
import { productModel } from "../src/data/models/products.model.js";
import { cartModel } from '../src/data/models/carts.model.js'
import { userModel } from '../src/data/models/users.model.js'


const URL = config.mongo_url

before(async () => {
    await mongoose.connect(URL)
})

after(async () => {
    mongoose.connection.close()
})

export const dropProduct = async () => {
    await productModel.collection.drop()
}

export const dropCart = async () => {
    await cartModel.collection.drop()
}

export const dropUser = async () => {
    await userModel.collection.drop()
}