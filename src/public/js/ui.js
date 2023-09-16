import { saveProduct, deleteProduct, getProductById, updateProduct } from './socket.js'

//listado de productos
const products = document.getElementById('products')

//información del producto
const title = document.getElementById('title')
const category = document.getElementById('category')
const price = document.getElementById('price')
const stock = document.getElementById('stock')
const description = document.getElementById('description')
const thumbnail = document.getElementById('thumbnail')

let saveId = ''

const prodUI = (prod) => {
  const div = document.createElement('div')
  div.innerHTML = `
  <div class="card card-body rounded-0 mb-2">
    <div class="d-flex justify-content-between">
      <h1 class="h3 card-title">${prod.title}</h1>
        <div>
          <button class="btn btn-danger delete" data-id="${prod._id}">eliminar</button>
           <button class="btn btn-dark update" data-id="${prod._id}">actualizar</button>
        </div>
    </div>
    <p>${prod.description}</p>
  </div>`

  const btnDelete = div.querySelector('.delete')
  const btnUpdate = div.querySelector('.update')

  btnDelete.addEventListener('click', e => deleteProduct(btnDelete.dataset.id))
  btnUpdate.addEventListener('click', e => getProductById(btnUpdate.dataset.id))

  return div
}

export const renderProducts = (arrayProds) => {
  products.innerHTML = ''
  arrayProds.forEach(prod => products.append(prodUI(prod)))
}

export const fillForm = (prod) => {

  title.value = prod.title,
  category.value = prod.category
  price.value = prod.price,
  stock.value = prod.stock,
  description.value = prod.description,
  thumbnail.value = prod.thumbnail

  saveId = prod._id
}

export const onHandleSubmit = (e) => {
    e.preventDefault()
    const file = thumbnail.files[0]

    if(file){
      const formData = new FormData()
      formData.append('products', file)
      fetch('/realtimeproducts/upload', {
        method: 'POST',
        body: formData
      })
      .then((res) => res.text())

    }

    if(saveId){
      updateProduct(
        saveId, 
        title.value,
        category.value,
        price.value,
        stock.value,
        description.value,
        thumbnail.value
      )
    }else{
      saveProduct(
        title.value,
        category.value,
        price.value,
        stock.value,
        description.value,
        thumbnail.value
      )
    }
    formProduct.reset()
}

export const appendProd = (prod) => {
  products.append(prodUI(prod))
}

