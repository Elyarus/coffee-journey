"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Declaramos carrito y lo cargamos desde localStorage o creamos uno vacío
var carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Contenedor donde se van a renderizar los productos

var productosContainer = document.querySelector(".productos-container"); // Contador del carrito (podés agregar un span en tu header para mostrarlo)

var contadorCarrito = document.createElement("span");
contadorCarrito.id = "contador-carrito";
contadorCarrito.style.marginLeft = "10px";
contadorCarrito.style.fontWeight = "bold";
document.querySelector("nav ul").appendChild(contadorCarrito);

function actualizarContador() {
  var totalProductos = carrito.reduce(function (acc, producto) {
    return acc + producto.cantidad;
  }, 0);
  contadorCarrito.textContent = totalProductos > 0 ? "Carrito: ".concat(totalProductos) : "";
}

var carritoSection = document.getElementById("carrito");
var carritoProductosDiv = document.getElementById("carrito-productos");
var carritoTotalP = document.getElementById("carrito-total");
var botonVaciar = document.getElementById("vaciar-carrito"); // Función para mostrar el carrito

function mostrarCarrito() {
  carritoProductosDiv.innerHTML = "";

  if (carrito.length === 0) {
    carritoProductosDiv.innerHTML = "<p>El carrito está vacío.</p>";
    carritoTotalP.textContent = "";
    return;
  }

  carrito.forEach(function (producto, index) {
    var productoDiv = document.createElement("div");
    productoDiv.classList.add("producto-carrito");
    productoDiv.style.border = "1px solid #b67b5b";
    productoDiv.style.padding = "10px";
    productoDiv.style.marginBottom = "10px";
    productoDiv.style.display = "flex";
    productoDiv.style.justifyContent = "space-between";
    productoDiv.style.alignItems = "center";
    productoDiv.innerHTML = "\n      <div>\n        <strong>".concat(producto.title, "</strong><br/>\n        Precio unitario: $").concat(producto.price.toFixed(2), "<br/>\n        Cantidad: <input type=\"number\" min=\"1\" value=\"").concat(producto.cantidad, "\" style=\"width: 50px;\" />\n      </div>\n      <button>Eliminar</button>\n    "); // Cambiar cantidad

    var inputCantidad = productoDiv.querySelector("input");
    inputCantidad.addEventListener("change", function (e) {
      var nuevaCantidad = parseInt(e.target.value);

      if (nuevaCantidad >= 1) {
        carrito[index].cantidad = nuevaCantidad;
        guardarActualizar();
      } else {
        e.target.value = carrito[index].cantidad;
      }
    }); // Botón eliminar

    var botonEliminar = productoDiv.querySelector("button");
    botonEliminar.addEventListener("click", function () {
      carrito.splice(index, 1);
      guardarActualizar();
      mostrarCarrito();
      actualizarContador();
    });
    carritoProductosDiv.appendChild(productoDiv);
  }); // Mostrar total

  var total = carrito.reduce(function (acc, producto) {
    return acc + producto.price * producto.cantidad;
  }, 0);
  carritoTotalP.textContent = "Total: $".concat(total.toFixed(2));
} // Función para guardar carrito en localStorage y actualizar contador


function guardarActualizar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarCarrito();
} // Vaciar carrito


botonVaciar.addEventListener("click", function () {
  carrito = [];
  guardarActualizar();
}); // Mostrar carrito al cargar la página

mostrarCarrito(); // Función para renderizar productos desde la API

function cargarProductos() {
  var respuesta, productos;
  return regeneratorRuntime.async(function cargarProductos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("cafes.json"));

        case 3:
          respuesta = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(respuesta.json());

        case 6:
          productos = _context.sent;
          productosContainer.innerHTML = ""; // Limpiar container antes de agregar

          productos.forEach(function (producto) {
            var card = document.createElement("div");
            card.classList.add("producto");
            card.innerHTML = "\n        <img src=\"".concat(producto.image, "\" alt=\"").concat(producto.title, "\" />\n        <h3>").concat(producto.title, "</h3>\n        <p>Precio: $").concat(producto.price, "</p>\n        <button>Agregar al carrito</button>\n      "); // Agregar evento click al botón para agregar al carrito

            var boton = card.querySelector("button");
            boton.addEventListener("click", function () {
              return agregarAlCarrito(producto);
            });
            productosContainer.appendChild(card);
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error("Error al cargar productos:", _context.t0);
          productosContainer.innerHTML = "<p>No se pudieron cargar los productos.</p>";

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
} // Función para agregar producto al carrito


function agregarAlCarrito(producto) {
  var productoEnCarrito = carrito.find(function (p) {
    return p.id === producto.id;
  });

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push(_objectSpread({}, producto, {
      cantidad: 1
    }));
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarCarrito();
  alert("Agregaste \"".concat(producto.title, "\" al carrito."));
} // Inicialización


cargarProductos();
actualizarContador();
//# sourceMappingURL=script.dev.js.map
