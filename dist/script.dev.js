"use strict";

var carrito = [];

function agregarAlCarrito(nombre, precio) {
  carrito.push({
    nombre: nombre,
    precio: precio
  });
  console.log(carrito);
  alert("Agregaste \"".concat(nombre, "\" al carrito."));
}
//# sourceMappingURL=script.dev.js.map
