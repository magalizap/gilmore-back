const socket = io()

const products = document.getElementById('products')


/*
const formProduct = document.getElementById('formProduct')
console.log(formProduct)

formProduct.addEventListener('submit', (e) => {
  e.preventDefault()
  const prodsIterator = new FormData(e.target) // transformaun obj html en un obj iterator
  const prod = Object.fromEntries(prodsIterator) //transformade un obj iterator a un obj simple {}
  socket.emit('newProduct', {prod})
})*/



//logica para recibir y pintar los productos 
socket.on('getProducts', async arrayProducts => {
    products.innerHTML = ''
    const productsHTML = arrayProducts.map(prod => `
      <div class="card" style="width: 18rem;">
          <img src="/img/image.jpg" class="card-img-top" alt="img">
          <div class="card-body">
              <h5 class="card-title">${prod.title}</h5>
              <p>Precio: $${prod.price}</p>
              <a href='/api/products/${prod._id}' class="btn btn-primary submit">Detalle del producto</a>
          </div>
      </div>`
    ).join('');

    products.innerHTML = productsHTML


})





