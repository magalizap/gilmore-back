import { createOne, findOneById, updateOne} from "../services/carts.service.js";
import { findById as findProductById} from "../services/products.service.js";
import { createSession } from "../services/payment.service.js";



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
    
    try {

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
        
        const lineItems = productsToPurchase.map((prod) => ({
            price_data: {
                product_data: {
                    name: prod.id_prod.title,  
                    images: [prod.id_prod.thumbnail],
                },
                currency: 'usd',
                unit_amount: prod.id_prod.price,   
            },
            quantity: prod.quantity,            
        }))
        
        const payment = await createSession({
            line_items: lineItems, 
            mode: 'payment',
            client_reference_id: cid,
            success_url: `http://${req.headers.host}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://${req.headers.host}/api/payments/cancel`,
        })
        console.log(payment.success_url)
        console.log(payment.cancel_url)
        console.log(payment.url)
        console.log(payment)

        return res.redirect(payment.url)
        
    } catch (error) {
        req.logger.error('Error in purchaseCart ')
        res.status(500).json({error: error})
    }

}