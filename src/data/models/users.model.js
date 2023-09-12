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
        enum: ['Admin', 'User', 'Premium'],
        default: 'User'
    },
    idCart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    },
    last_connection: Date,
    timeToExpiredPass: Date,
    tokenPass: String
})

export const userModel = model('users', userSchema)