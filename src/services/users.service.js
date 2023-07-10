import UsersManager from "../data/manager/usersManager.js";


const usersManager = new UsersManager()

export const findByEmail = async (email) => {
    try {
        const userEmail = await usersManager.findByEmail(email)
        return userEmail
    } catch (error) {
        return error
    }
}
