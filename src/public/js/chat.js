
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

// envío mensaje al servidor
messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('client:sendMessage', messageBox.value)
    messageBox.value = ''
})

//recibo respuesta del servidor
socket.on('server:newMessage', async (data) => {
    const div = document.createElement('div')
    div.classList.add('msg-area', 'mb-2')
    div.innerHTML = `<p class=msg><b>${data.user}:</b> ${data.msg}</p>`
    chat.appendChild(div)
})

