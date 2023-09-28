import Stripe from "stripe";
import config from '../config/env.config.js'

const stripe = new Stripe(config.stripe_secret_key)

export const createSession = async (data) => {
    try {
        const session = await stripe.checkout.sessions.create(data)
        return session
    } catch (error) {
        return error
    }
}

export const retrieveSession = async (sessionID) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionID)
        return session
    } catch (error) {
        return error
    }
}