import { servicesProduct } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

function createCard(name, precio, imagen, id) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <div class="img-container">
            <img class="img-cont" src="${imagen}" alt="${name}">
        </div>
        <div class="card-container--info">
            <p>${name}</p>
            <div class="card-container--value">
                <p>$ ${precio}</p>
                <button class="delete-button" data-del="${id}">
                    <img src="./imagenes/🦆 icon _trash 2_trash.png" alt="eliminar"/>
                </button>
            </div>
        </div>
    `;

    const deleteButton = card.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
        try {
            await servicesProduct.deleteProduct(id);
            card.remove();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    });

    return card;
}

const render = async () => {
    try {
        const listProducts = await servicesProduct.productList();
        const fragment = document.createDocumentFragment();

        listProducts.forEach(product => {
            const card = createCard(product.name, product.precio, product.imagen, product.id);
            fragment.appendChild(card);
        });

        productContainer.appendChild(fragment);
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
    }
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value.trim();
    const precio = document.querySelector("[data-precio]").value.trim();
    const imagen = document.querySelector("[data-image]").value.trim();

    if (!name || !precio || !imagen) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        const newProduct = await servicesProduct.createProduct(name, precio, imagen);
        const newCard = createCard(newProduct.name, newProduct.precio, newProduct.imagen, newProduct.id);
        productContainer.appendChild(newCard);
    } catch (error) {
        console.error("Error al crear el producto:", error);
    }
});

render();
