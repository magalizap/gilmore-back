import { Schema, model } from "mongoose";

const userSchema = new Schema({
    full_name: {
        type:String,
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    },
    idCart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

export const userModel = model('users', userSchema)