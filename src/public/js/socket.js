const socket = io()

// P R O D U C T S 

export const loadProducts = (prod) => {
    socket.on('server:loadProducts', prod)
}

export const saveProduct = (title, category, price, stock, description, thumbnail) => {
    socket.emit('client:newProduct', {
        title, 
        category, 
        price, 
        stock, 
        description, 
        thumbnail
    })
}

export const onNewProduct = (prod) => {
    socket.on('server:newProduct', prod)
}

export const deleteProduct = (id) => {
    socket.emit('client:deleteProduct', id)
}

export const getProductById = (id) => {
    socket.emit('client:getProduct', id)
}

export const onSelectedProduct = (prod) => {
    socket.on('server:selectedProduct', prod)
}

export const updateProduct = (id, title, category, price, stock, description, thumbnail) => {
    socket.emit('client:updateProduct', {
        _id: id,
        title, 
        category, 
        price, 
        stock, 
        description, 
        thumbnail
    })
}

