import { ticketModel } from "../data/models/ticket.model.js"
import { v4 as uuidv4 } from 'uuid'; // genera un codigo random
import { findOneById } from "../services/carts.service.js";
import { retrieveSession } from "../services/payment.service.js";
import { transporter } from "../helpers/nodemailer.js";

export const success = async (req, res) => {

    try {
        const sessionID = req.query.session_id
        const session = await retrieveSession(sessionID)
        
        const amountTotal = session.amount_total
        const paymentStatus = session.payment_status
        const email = session.customer_details.email
        const cid = session.client_reference_id
        const cart = await findOneById({_id: cid})

        if(paymentStatus === 'paid'){

            const ticket = new ticketModel({
                code: uuidv4(),
                amount: amountTotal,
                purchaser: email
            })

            await ticket.save()

            cart.products = []
            await cart.save()

            await transporter.sendMail({
                to: email,
                subject: '!Tu pedido ya está en camino!',
                html: `
                    <p>Órden de compra: #${ticket.code}</p>
                    <p>Pagaste: $${ticket.amount}</p>
                `
            })
            res.render('purchaseCart', ticket)

        }


    } catch (error) {
        req.logger.error('Error in success ')
        res.status(500).json({error: error})
    }

}


