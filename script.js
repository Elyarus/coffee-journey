// Declaramos carrito y lo cargamos desde localStorage o creamos uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Contenedor donde se van a renderizar los productos
const productosContainer = document.querySelector(".productos-container");

// Contador del carrito (podés agregar un span en tu header para mostrarlo)
const contadorCarrito = document.createElement("span");
contadorCarrito.id = "contador-carrito";
contadorCarrito.style.marginLeft = "10px";
contadorCarrito.style.fontWeight = "bold";
document.querySelector("nav ul").appendChild(contadorCarrito);

function actualizarContador() {
  const totalProductos = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  contadorCarrito.textContent =
    totalProductos > 0 ? `Carrito: ${totalProductos}` : "";
}
const carritoSection = document.getElementById("carrito");
const carritoProductosDiv = document.getElementById("carrito-productos");
const carritoTotalP = document.getElementById("carrito-total");
const botonVaciar = document.getElementById("vaciar-carrito");

// Función para mostrar el carrito
function mostrarCarrito() {
  carritoProductosDiv.innerHTML = "";

  if (carrito.length === 0) {
    carritoProductosDiv.innerHTML = "<p>El carrito está vacío.</p>";
    carritoTotalP.textContent = "";
    return;
  }

  carrito.forEach((producto, index) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto-carrito");
    productoDiv.style.border = "1px solid #b67b5b";
    productoDiv.style.padding = "10px";
    productoDiv.style.marginBottom = "10px";
    productoDiv.style.display = "flex";
    productoDiv.style.justifyContent = "space-between";
    productoDiv.style.alignItems = "center";

    productoDiv.innerHTML = `
      <div>
        <strong>${producto.title}</strong><br/>
        Precio unitario: $${producto.price.toFixed(2)}<br/>
        Cantidad: <input type="number" min="1" value="${
          producto.cantidad
        }" style="width: 50px;" />
      </div>
      <button>Eliminar</button>
    `;

    // Cambiar cantidad
    const inputCantidad = productoDiv.querySelector("input");
    inputCantidad.addEventListener("change", (e) => {
      const nuevaCantidad = parseInt(e.target.value);
      if (nuevaCantidad >= 1) {
        carrito[index].cantidad = nuevaCantidad;
        guardarActualizar();
      } else {
        e.target.value = carrito[index].cantidad;
      }
    });

    // Botón eliminar
    const botonEliminar = productoDiv.querySelector("button");
    botonEliminar.addEventListener("click", () => {
      carrito.splice(index, 1);
      guardarActualizar();
      mostrarCarrito();
      actualizarContador();
    });

    carritoProductosDiv.appendChild(productoDiv);
  });

  // Mostrar total
  const total = carrito.reduce(
    (acc, producto) => acc + producto.price * producto.cantidad,
    0
  );
  carritoTotalP.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para guardar carrito en localStorage y actualizar contador
function guardarActualizar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarCarrito();
}

// Vaciar carrito
botonVaciar.addEventListener("click", () => {
  carrito = [];
  guardarActualizar();
});

// Mostrar carrito al cargar la página
mostrarCarrito();

// Función para renderizar productos desde la API
async function cargarProductos() {
  try {
    const respuesta = await fetch("cafes.json");
    const productos = await respuesta.json();

    productosContainer.innerHTML = ""; // Limpiar container antes de agregar

    productos.forEach((producto) => {
      const card = document.createElement("div");
      card.classList.add("producto");

      card.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}" />
        <h3>${producto.title}</h3>
        <p>Precio: $${producto.price}</p>
        <button>Agregar al carrito</button>
      `;

      // Agregar evento click al botón para agregar al carrito
      const boton = card.querySelector("button");
      boton.addEventListener("click", () => agregarAlCarrito(producto));

      productosContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productosContainer.innerHTML =
      "<p>No se pudieron cargar los productos.</p>";
  }
}

// Función para agregar producto al carrito
function agregarAlCarrito(producto) {
  const productoEnCarrito = carrito.find((p) => p.id === producto.id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  mostrarCarrito();
  alert(`Agregaste "${producto.title}" al carrito.`);
}
// Seleccionamos el formulario
const formulario = document.querySelector(".formulario-contacto");

formulario.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir envío automático para validar

  const nombre = formulario.nombre.value.trim();
  const email = formulario.email.value.trim();
  const mensaje = formulario.mensaje.value.trim();

  // Regex simple para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let errores = [];

  if (nombre === "") {
    errores.push("El nombre es obligatorio.");
  }

  if (email === "") {
    errores.push("El correo electrónico es obligatorio.");
  } else if (!emailRegex.test(email)) {
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  if (mensaje === "") {
    errores.push("El mensaje es obligatorio.");
  }

  if (errores.length > 0) {
    alert(errores.join("\n"));
    return; // No enviar formulario
  }

  // Si pasa validación, enviar el formulario con Formspree
  formulario.submit();
});

// Inicialización
cargarProductos();
actualizarContador();
