import { transporter } from "../helpers/nodemailer.js"
import { create, findAll } from "../services/messages.service.js"
import { createOne, deleteOne, findAll as findAllProducts, findById, updateOne} from "../services/products.service.js"
import { v4 as uuidv4 } from 'uuid' // genera un codigo random



let ownerEmail
let users
let userRole


export const usersOnline = (userOn) => {
    users = userOn.first_name
}
export const userPremium = (email, user) => {
    ownerEmail = email
    userRole = user.role
}

//opción con multer (NO IMPLEMENTADA)
/*
let image
export const upload = (url) => {
    image = url
    console.log(image) // devuelve la ruta deseada
}*/



export default (io) => {

    io.on('connection', async (socket) => {
        console.log('Client connected')

        // C H A T 

        const messagesList = async () => {
            const messages = await findAll()
            socket.emit('server:loadMessages', messages)
        }

        messagesList() // envío mi arreglo de mensajes

        socket.on('client:sendMessage', async (data) => {
            await create({user: users, message: data.msg})
            io.sockets.emit('server:newMessage', {
                msg: data.msg,
                user: users
            })
            
        })


        // P R O D U C T S 

        const productsList = async () => {
            const products = await findAllProducts({ status: true },                   
                { limit: 100, page: 1, sort: { price:  -1 }, lean: true }
            )
            //envío el listado de mis productos
            io.sockets.emit('server:loadProducts', products.docs)
        }
        
        productsList() //envío mi arreglo de productos

        socket.on('client:newProduct', async (data) => {
            const newProduct = await createOne({
                title: data.title, 
                description: data.description,
                price: data.price, 
                thumbnail: data.thumbnail,
                code: uuidv4(), 
                owner: ownerEmail,
                stock: data.stock, 
                category: data.category, 
            })
            io.sockets.emit('server:newProduct', newProduct) // envío los datos del nuevo producto creado
        })

        socket.on('client:deleteProduct', async (pid) => { //elimino el producto seleccionado y actualizo el front
            const product = await findById(pid)

            // si el usuario es premium y el producto no le pertenece no puede eliminarlo
            if(userRole === 'Premium' && ownerEmail !== product.owner){
                return productsList()
            }

            await deleteOne(pid)
            if(userRole === 'Admin' && product.owner !== 'Admin'){
                await transporter.sendMail({
                    to: product.owner,
                    subject:'Uno de tus productos ha sido eliminado',
                    html: `<p>¡Hola! Te notificamos que, tu producto con el nombre ${product.title} ha sido eliminado por el administrador del sitio. </p>`
                })
            }
            
            
            
            productsList()
        })

        socket.on('client:getProduct', async (pid) => {
            const product = await findById(pid)
            socket.emit('server:selectedProduct', product)
        })

        socket.on('client:updateProduct', async (updateProd) => {
            await updateOne(updateProd._id, {
                title: updateProd.title,
                description: updateProd.description, 
                price: updateProd.price, 
                thumbnail: updateProd.thumbnail,
                code: uuidv4(), 
                owner: ownerEmail,
                category: updateProd.category, 
                stock: updateProd.stock, 
            })
            productsList()
        })

        socket.on("disconnect", async () => {
            console.log(socket.id, "disconnected")
        })

    })
}
