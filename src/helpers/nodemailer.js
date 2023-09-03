import nodemailer from 'nodemailer'
import config from '../config/envConfig.js'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail_user,
        pass: config.gmail_password
    }
})