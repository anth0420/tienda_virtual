document.addEventListener('DOMContentLoaded', function() {  
    // Obtener elementos del carrito desde el Local Storage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para renderizar los elementos del carrito
    function renderCartItems() {
        const cartItemsContainer = document.getElementById("cart-items-container");
        cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual

        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <h2>${item.Nombre}</h2>
                <p class="price">$${item.Precio.toFixed(2)}</p>
                <p>Cantidad: ${item.Cantidad}</p>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Actualizar el total del carrito
        updateCartTotal();
    }

    // Función para actualizar el total del carrito
    function updateCartTotal() {
        const cartTotalSpan = document.getElementById("cart-total");
        const cartTotal = cartItems.reduce((total, item) => total + item.Precio * item.Cantidad, 0);
        cartTotalSpan.textContent = cartTotal.toFixed(2);

        // Actualizar el contador de productos en el carrito
        const cartCountSpan = document.getElementById("cart-count");
        const totalCount = cartItems.reduce((count, item) => count + item.Cantidad, 0);
        cartCountSpan.textContent = totalCount;
    }

    // Llamar a la función de renderizado inicial
    renderCartItems();

    // Evento para realizar el pago
// Evento para realizar el pago
    const checkoutButton = document.getElementById("checkout");
    checkoutButton.addEventListener('click', function() {
        // Calcular el total del carrito
        const cartTotal = cartItems.reduce((total, item) => total + item.Precio * item.Cantidad, 0);

        if (cartTotal > 0) {
            // Pago válido, mostrar mensaje y realizar acciones
            alert('¡Pago realizado con éxito! Gracias por su compra.');
            // Puedes agregar aquí la lógica adicional para el pago y la limpieza del carrito
            localStorage.removeItem('cart');
            cartItems.length = 0; // Limpiar el array
            renderCartItems(); // Volver a renderizar el carrito después de la compra
        } else {
            // Total es cero, mostrar mensaje o realizar otras acciones según sea necesario
            alert('No hay productos en el carrito para realizar el pago.');
        }

    });
});
