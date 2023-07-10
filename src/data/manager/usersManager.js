import { userModel } from "../models/users.model.js";

// DAO

export default class UsersManager {
    async findByEmail(email){
        try {
            const userEmail = await userModel.findOne({email: email})
            return userEmail
        } catch (error) {
            return error
        }
    }
}