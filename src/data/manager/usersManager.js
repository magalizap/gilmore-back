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
}