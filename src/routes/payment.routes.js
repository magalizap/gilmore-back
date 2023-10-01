import { Router } from "express";
import { success } from "../controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.get('/success', success)


export default paymentRouter