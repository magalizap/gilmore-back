
// C H A T 
/*
const socket = io()

const botonChat = document.getElementById('botonChat')
const messages = document.getElementById('messages')
const val = document.getElementById('chatBox')


botonChat.addEventListener('click', () => {
    if(val.value.trim().length > 0){
        socket.emit('client:newMessage', {message: val.value})

        val.value = ''
    }

})


socket.on('server:loadMessages', async arrayMessages => {
    messages.innerHTML = ''
    arrayMessages.forEach(data => {
        messages.innerHTML += `
        <p>${data.user}: ${data.message}</p>
        `
    })
})*/

const socket = io() // conexión con socket.io

//accedo a mis elementos
const messagesForm = document.getElementById('messages-form')
const messageBox = document.getElementById('message')
const chat = document.getElementById('chat')
const usernames = document.getElementById('usernames')

const user = usernames.textContent

// envío mensaje al servidor
messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('client:sendMessage', {
        msg: messageBox.value,
        user: user
    })
    messageBox.value = ''
})


// Función para agregar un mensaje al chat
const addMessage = (user, msg) => {
  const div = document.createElement('div')
  div.classList.add('msg-area', 'mb-2')
  div.innerHTML = `<p class="msg"><b>${user}:</b> ${msg}</p>`
  chat.appendChild(div)
}

// Recibir mensajes previos del servidor
socket.on('server:loadMessages', (data) => {
  data.forEach((mensaje) => {
    addMessage(mensaje.user, mensaje.message)
  })
})

// Recibir un nuevo mensaje del servidor
socket.on('server:newMessage', (data) => {
    addMessage(data.user, data.msg)
})

