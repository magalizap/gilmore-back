import { ticketModel } from "../data/models/ticket.model.js";
import { createOne, findOneById, updateOne} from "../services/carts.service.js";
import { findById as findProductById} from "../services/products.service.js";
import { v4 as uuidv4 } from 'uuid'; // genera un codigo random
import { transporter } from "../helpers/nodemailer.js";


// creo el carrito de mi user
export const createOneCart = async (req, res) => {
    try {
        const cart = await createOne([{products:[]}])
        res.status(200).send(cart)
    } catch (error) {
        req.logger.error('Error in createOneCart')
        res.status(500).json({error: error})
    }
}

// visualizo el carrito de mi user
export const findById = async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await findOneById({_id: cid})
        //res.status(200).json({message: 'Product found', cartId})
        res.status(200).render('cart', { cart })
    } catch (error) {
        req.logger.error('Error in findById')
        res.status(500).json({error: error})
    }
}

// agrego un producto al carrito
export const addProduct = async (req, res) => {
    const cid = req.params.cid 
    const pid = req.params.pid
    const quantity = req.body.quantity

    try {
        const product = await findProductById(pid)

        if(req.user.role === 'Premium' && req.user.email === product.owner){
            return res.status(400).json({message: 'No puedes agregar productos que ya te pertenecen a tu carrito'})
        }

        const parsedQuantity = parseInt(quantity)
        const cart = await findOneById({_id: cid})
        const addProductToCart = { id_prod: pid, quantity: parsedQuantity}
        cart.products.push(addProductToCart)
        await cart.save()

        res.status(200).redirect(`/api/cart/${cid}`)
    } catch (error) {
        req.logger.error('Error in addProduct')
        res.status(500).json({error: error})
    }
}

// elimino un producto del carrito
export const deleteOneProduct = async (req, res) => {
    const cid = req.params.cid 
    const pid = req.params.pid
    try {
        const cart = await findOneById({_id: cid})
        console.log(cart)
        cart.products = cart.products.filter((item) => item.id_prod._id.toString() !== pid)
        await cart.save()
        res.status(200).redirect(`/api/cart/${cid}`)

    } catch (error) {
        req.logger.error('Error in deleteOneProduct')
        res.status(500).json({error: error})
    }
}

// vacío el carrito de productos
export const deleteOneCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const emptyCart = await findOneById({_id: cid})
        emptyCart.products = []
        await emptyCart.save()
        res.status(200).json({cart: emptyCart})

    } catch (error) {
        req.logger.error('Error in deleteOneCart')
        res.status(500).json({error: error})
    }
}

// si ese producto ya fue agregado, sumo la cantidad
export const updateOneCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const {quantity} = req.body
    try {
        const result = await updateOne(cid, pid, quantity)
        console.log(result)
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito.' })
        }
        res.status(200).redirect(`/api/cart/${cid}`)

    } catch (error) {
        req.logger.error('Error in updateOneCart')
        res.status(500).json({error: error})
    }
}

// reemplazo la cantidad especificada por una nueva
export const updateOneProduct = async (req, res) => {
    const cid = req.params.cid
    const products = req.body.products
    try {
        const cart = await findOneById({_id: cid})
        cart.products = {products: [{products}]}
        //cart.products = {products: [{id_prod: pid, quantity: quantity}]}
        res.status(200).json({cart: cart})
    } catch (error) {
        req.logger.error('Error in updateOneProduct ')
        res.status(500).json({error: error})
    }
}

// finalizar compra
export const purchaseCart = async (req, res) => {
    const cid = req.params.cid
    const cart = await findOneById({_id: cid})

    const productsToPurchase = []
    const productsNotPurchase = []
    
    for(const product of cart.products){
        const productInStock = await findProductById(product.id_prod)
    
        if(product.quantity <= productInStock.stock){
            // stock disponible
            productInStock.stock -= product.quantity
            await productInStock.save()
            productsToPurchase.push(product)
            
        }else{
            // no hay stock suficiente
            productsNotPurchase.push(product)
        }

    }

    // Calcular el precio total 
    const totalPrice = productsToPurchase.reduce(
        (total, prod) => total + prod.id_prod.price * prod.quantity,  
        0,
    )

    // crear ticket
    const ticket = new ticketModel({
        code: uuidv4(),
        amount: totalPrice,
        purchaser: req.user.email
    })
    
    await ticket.save()

    // actualizar carrito
    cart.products = productsNotPurchase
    await cart.save()

    try {

        /*res.status(200).json({
            message: '¡Compra finalizada con exito!',
            ticket,
            productsNotPurchase
        })*/
        await transporter.sendMail({
            to: req.user.email,
            subject: '!Tu pedido ya está en camino!',
            html: `
                <p>Órden de compra: #${ticket.code}</p>
                <p>Pagaste: $${ticket.amount}</p>
            `
        })
        res.render('purchaseCart', ticket)

    } catch (error) {
        req.logger.error('Error in purchaseCart ')
        res.status(500).json({error: error})
    }

}