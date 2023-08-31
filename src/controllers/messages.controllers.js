import { create, findAll} from "../services/messages.service.js";

export const messagesChat = async (req, res) => {
    
    const user = req.user

    try {
        
        req.io.on('connection', async (socket) => {
            console.log('Client connected in messageChat')
          
            socket.on('client:sendMessage', async (data) => {
                await create({user: user.first_name, message: data})
                req.io.sockets.emit('server:newMessage', {
                    msg: data,
                    user: user.first_name
                })
            })

            
            socket.on("disconnect", async () => {
                console.log(socket.id, "disconnected")
            })
        })
        res.render('chat', { style: 'chat.css', script:'chat.js', user})
    } catch (error) {
        req.logger.error('Error in messagesChat')
        res.status(500).json({error: error})
    }
}


/**
 *  const emitMessages = async () => {
                const messages = await findAll()
                req.io.emit('server:loadMessages', messages)
            }

            emitMessages()

            socket.on('client:newMessage', async (data) => {
                
                const {message} = data
                await create({user: user.first_name, message: message})

                

            })
 */