import { messageModel } from "../models/messages.model.js";

// DAO --> (única persistencia)

export default class MessageManager {

    async findAll(){
        try {
            const messages = await messageModel.find()
            return messages
        } catch (error) {
            return error
        }
    }

    async create(obj){
        try {
            const newMessage = await messageModel.create(obj)
            return newMessage
        } catch (error) {
            return error
        }
    }

}