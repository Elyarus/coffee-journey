let carrito = [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    console.log(carrito);
    alert(`Agregaste "${nombre}" al carrito.`);
}