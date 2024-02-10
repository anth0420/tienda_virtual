document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('add-product-form');

    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const imagen = document.getElementById('imagen').files[0];

        if (precio < 0) {
            alert('El precio no puede ser negativo.');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('imagen', imagen);

        try {
            const response = await fetch('http://localhost:8000/productos/', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                addProductForm.reset();
            } else {
                alert('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar el producto');
        }
    });
});
