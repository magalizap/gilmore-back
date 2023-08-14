import UsersManager from "../data/manager/usersManager.js";


const usersManager = new UsersManager()

export const findUserByEmail = async (email) => {
    try {
        const userEmail = await usersManager.findByEmail(email)
        return userEmail
    } catch (error) {
        return error

    }
}

export const findUserById = async (id) => {
    try {
        const userId = await usersManager.findById(id)
        return userId
    } catch (error) {
        return error

    }
}

export const findUserByToken = async (tokenPass) => {
    try {
        const userToken = await usersManager.findByToken(tokenPass)
        return userToken
    } catch (error) {
        return error
    }
}

export const findUserToUpdate = async (tokenPass, timeToExpiredPass) => {
    try {
        const userValid = await usersManager.findByExpired(tokenPass, timeToExpiredPass)
        return userValid
    } catch (error) {
        return error
    }
}

