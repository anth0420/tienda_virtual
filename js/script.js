// Agrega esto en script.js

document.addEventListener('DOMContentLoaded', function() {
    // Función para actualizar la cantidad de productos en el carrito
    function updateCartCount() {
        // Obtener elementos del carrito desde el Local Storage
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Obtener la cantidad total de productos en el carrito
        let totalCount = cartItems.reduce((count, item) => count + item.Cantidad, 0);

        // Actualizar el contador de productos en la página principal
        const cartCountSpan = document.getElementById("cart-count");
        cartCountSpan.textContent = totalCount;
    }

    // Llamar a la función para actualizar el contador al cargar la página
    updateCartCount();

    // Función para obtener productos desde la API y renderizarlos
    function getAndRenderProducts() {
        // Obtener productos desde la API
        fetch('http://localhost:8000/productos')
            .then(response => response.json())
            .then(data => {
                let productsContainer = document.getElementById("products-container");

                data.forEach(product => {
                    const productDiv = document.createElement('div');
                    
                    const imagenApiUrl = `http://localhost:8000/productos/${product.ProductoID}/imagen`;

                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <h2>${product.Nombre}</h2>
                        <p>${product.Descripcion}</p>
                        <p class="price">$${product.Precio.toFixed(2)}</p>
                        <img src="${imagenApiUrl}" alt="${product.Nombre}" class="product-image">
                        <button class="add-to-cart-button" data-product='${JSON.stringify(product)}'>Agregar al Carrito</button>
                    `;

                    // Asociar la función addToCart al evento click del botón
                    const addToCartButton = productDiv.querySelector('.add-to-cart-button');
                    addToCartButton.addEventListener('click', addToCart);

                    productsContainer.appendChild(productDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para manejar el evento de agregar al carrito
    function addToCart(event) {
        // Obtener el carrito del localStorage o un array vacío si no existe
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
        // Obtener la información del producto desde el atributo data-product del botón
        const productData = JSON.parse(event.target.dataset.product);
        const productId = productData.ProductoID; // Obtener el ID del producto
    
        // Verificar si el producto ya está en el carrito
        const existingItemIndex = cartItems.findIndex(item => item.ProductoID === productId);
    
        if (existingItemIndex !== -1) {
            // Si ya está en el carrito, incrementar la cantidad
            cartItems[existingItemIndex].Cantidad += 1;
        } else {
            // Si no está en el carrito, agregarlo
            cartItems.push({ ...productData, Cantidad: 1 }); // Incluimos la cantidad inicial
        }
    
        // Agregar clase de animación al botón
        event.target.classList.add('animate__animated', 'animate__rubberBand');
    
        // Actualizar el carrito en el localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
    
        // Actualizar el contador de productos en el carrito
        updateCartCount();
    
        // Obtener la posición del botón "Agregar al Carrito"
        const buttonPosition = event.target.getBoundingClientRect();
    
        // Obtener la posición del carrito
        const cartPosition = document.getElementById("cart").getBoundingClientRect();
    
        // Calcular la diferencia entre las posiciones
        const deltaX = cartPosition.left - buttonPosition.left;
        const deltaY = cartPosition.top - buttonPosition.top;
    
        // Animar el producto moviéndolo hacia el carrito
        event.target.style.transition = "transform 0.5s ease";
        event.target.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    
        // Eliminar el producto después de la animación
        setTimeout(() => {
            event.target.remove();
        }, 25);
    }
    

    // Llamar a la función para obtener y renderizar productos al cargar la página
    getAndRenderProducts();
});


