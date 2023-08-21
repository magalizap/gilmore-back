const socket = io()

const formProduct = document.getElementById('formProduct')
console.log(formProduct)
//formulario para añadir nuevos productos y mostrarlos en tiempo real
formProduct.addEventListener('submit', (e) => {
  e.preventDefault()
  const prodsIterator = new FormData(e.target) // transformaun obj html en un obj iterator
  const prod = Object.fromEntries(prodsIterator) //transformade un obj iterator a un obj simple {}
  console.log(prod)
  socket.emit('newProduct', prod)
})



//logica para recibir y pintar los productos 
const products = document.getElementById('products')

socket.on('allProducts', async arrayProducts => {
    products.innerHTML = ''
    const productsHTML = arrayProducts.map(prod =>
      `
      <div class="card card-body rounded-0 mb-2">
        <div class="d-flex justify-content-between">
            <h1 class="h3 card-title">${prod.title}</h1>
            <div>
                <button class="btn btn-danger" data-id="${prod._id}">eliminar</button>
                <a href='/api/products/${prod._id}' class="btn btn-primary submit">actualizar</a>
            </div>
        </div>
        <p>${prod.description}</p>
      </div>
      `
    ).join('');
    products.innerHTML = productsHTML
    socket.on('saveProduct', newProd => {
      arrayProducts.push(newProd)
      console.log(arrayProducts)
      products.innerHTML += `
      <div class="card card-body rounded-0 mb-2">
        <div class="d-flex justify-content-between">
            <h1 class="h3 card-title">${newProd.title}</h1>
            <div>
                <button class="btn btn-danger" data-id="${newProd._id}>eliminar</button>
                <a href='/api/products/${prod._id}' class="btn btn-primary submit">actualizar</a>
            </div>
        </div>
        <p>${newProd.description}</p>
      </div>`
    })

})



