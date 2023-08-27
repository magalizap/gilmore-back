import MessageManager from "../data/manager/messagesManager.js";

const messageManager = new MessageManager()

export const findAll = async () => {
    try {
        const message = await messageManager.findAll()
        return message
    } catch (error) {
        return error
    }
}

export const create = async (obj) => {
    try {
        const newMessage = await messageManager.create(obj)
        return newMessage
    } catch (error) {
        return error
    }
}