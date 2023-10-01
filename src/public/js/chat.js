const socket = io() // conexión con socket.io

//accedo a mis elementos
const messagesForm = document.getElementById('messages-form')
const messageBox = document.getElementById('message')
const chat = document.getElementById('chat')
const usernames = document.getElementById('usernames')

//const user = usernames.textContent

// envío mensaje al servidor
messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('client:sendMessage', {
        msg: messageBox.value,
        //user: user
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
  data.forEach((msg) => {
    addMessage(msg.user, msg.message)
  })

})

// Recibir un nuevo mensaje del servidor
socket.on('server:newMessage', (data) => {
    addMessage(data.user, data.msg)
})

