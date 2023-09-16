import { loadProducts, onNewProduct, onSelectedProduct } from "./socket.js"
import { appendProd, fillForm, onHandleSubmit, renderProducts } from "./ui.js"


// P R O D U C T S 

const formProduct = document.getElementById('formProduct')

onNewProduct(appendProd) // sumo el nuevo producto agregado recientemente
loadProducts(renderProducts) // cargo y muestro mi listado de productos
onSelectedProduct(fillForm) // relleno el formulario con la data del producto a actualizar

formProduct.addEventListener('submit', onHandleSubmit)


