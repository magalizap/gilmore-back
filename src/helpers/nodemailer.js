import nodemailer from 'nodemailer'
import config from '../config/env.config.js'

export const transporter = nodemailer.createTransport({
    service: config.mailing_service,
    auth: {
        user: config.mailing_user,
        pass: config.mailing_password
    }
})