import { userModel } from "../models/users.model.js";

// DAO --> (única persistencia)

export default class UsersManager {
    async findByEmail(email){
        try {
            const user = await userModel.findOne({email})
            return user
        } catch (error) {
            return error
        }
    }

    async findById(id){
        try {
            const user = await userModel.findById(id)
            return user
        } catch (error) {
            return error
        }
    }

    async findByToken(tokenPass){
        try {
            const user = await userModel.findOne({tokenPass})
            return user
        } catch (error) {
            return error
        }
    }

    async findByExpired(tokenPass, timeToExpiredPass){
        try {
            const user = await userModel.findOne(tokenPass, timeToExpiredPass)
            return user
        } catch (error) {
            return error
        }
    }

    async createOne(obj){
        try {
            const user = await userModel.create(obj)
            return user
        } catch (error) {
            return error
        }
    }

    async updateUser(id, change, state){
        try {
            const user = await userModel.findByIdAndUpdate(id, change, state)
            return user
        } catch (error) {
            return error
        }
    }

    async findAllUsers(){
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            return error
        }
    }

    async deleteUsers(obj){
        try {
            const users = await userModel.deleteMany(obj)
            return users
        } catch (error) {
            return error
        }
    }
}