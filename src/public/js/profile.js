
const fileInput = document.getElementById('file')
const previewImage = document.getElementById('preview-image')

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]

    if (file) {
        const reader = new FileReader()

        reader.onload = (event) => {
            // Actualiza la vista previa con la imagen seleccionada
            previewImage.src = event.target.result
        }

        // Lee el archivo como una URL de datos (data URL)
        reader.readAsDataURL(file)
    } else {
        // Si no se selecciona ningún archivo, muestra la imagen predeterminada
        previewImage.src = '/img/profile-default.jpg'
    }
})
