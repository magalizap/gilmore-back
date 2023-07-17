import UsersManager from "../data/manager/usersManager.js";


const usersManager = new UsersManager()

export const findUserByEmail = async (email) => {
    try {
        const userEmail = await usersManager.findByEmail(email)
        return userEmail
    } catch (error) {
        console.log('error')
        return error

    }
}
