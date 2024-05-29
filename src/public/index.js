const socket = io();

socket.on("products",  (products) => {

try {
    console.log("recibido evento -products- ");
    const productCard = products.map((product) => {
        return `
                    <div class="card">
                        <h2 class="product-name">${product.title}<h2>
                        <p class="price-stock">$${product.price}</p>
                        <p class="price-stock">Stock: ${product.stock}</p>
                        <button class="product-delete-btn" data-id="${product.id}">Eliminate Product</button>
                    </div>
                `;
        }).join(' ');

        document.getElementById("card-container").innerHTML = productCard;
        document.querySelectorAll(".product-delete-btn").forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                eliminarProducto(productId);
            });
        });
    } catch (error) {
        console.error(error);
    }
});

const eliminarProducto =  (id) => {
    console.log("evento deleteProduct enviado");
    socket.emit("deleteProduct", id);
}


document.getElementById("addProductForm").addEventListener("submit", (event) => {
    event.preventDefault(); 
    const newProduct = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        price: parseFloat(document.getElementById("price").value),
        stock: parseInt(document.getElementById("stock").value, 10)
    }

    socket.emit("newProduct", newProduct);
    document.getElementById("addProductForm").reset();
});




