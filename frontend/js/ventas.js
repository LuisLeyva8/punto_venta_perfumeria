const inputCodigo = document.getElementById('codigo');
const botonAgregar = document.getElementById('agregarProducto');
const tablaListaVenta = document.getElementById('lista-venta');

// Buscar producto
async function buscarProducto(codigo) {
  try {
    const respuesta = await fetch(`http://127.0.0.1:3000/buscar-producto/${codigo}`);
    const producto = await respuesta.json();
    return producto;
  } catch (error) {
    console.error("Error al buscar el producto:", error);
    return null;
  }
}

// Agregar producto normal (ENTER o botón verde)
async function agregarProductoATabla() {
  const codigo = inputCodigo.value.trim();
  if (codigo === '') return;

  const producto = await buscarProducto(codigo);
  if (!producto) return;

  agregarOActualizarProducto(producto, 1);

  inputCodigo.value = '';
  inputCodigo.focus();
}

// Abrir el modal INS
function abrirModalINS() {
  document.getElementById('modalINS').style.display = 'block';
}

// Cerrar el modal INS
function cerrarModalINS() {
  document.getElementById('modalINS').style.display = 'none';
  document.getElementById('codigoINS').value = '';
  document.getElementById('cantidadINS').value = 1;
}

// Confirmar carga por INS
async function confirmarINS() {
  const codigo = document.getElementById('codigoINS').value.trim();
  const cantidad = parseInt(document.getElementById('cantidadINS').value.trim(), 10);

  if (codigo === '' || isNaN(cantidad) || cantidad <= 0) {
    alert('Por favor ingresa un código válido y una cantidad mayor a 0.');
    return;
  }

  const producto = await buscarProducto(codigo);
  if (!producto) return;

  agregarOActualizarProducto(producto, cantidad);

  cerrarModalINS();
}

// Agrega o actualiza cantidad en tabla
function agregarOActualizarProducto(producto, cantidadAgregar) {
  const filas = tablaListaVenta.getElementsByTagName('tr');
  let encontrado = false;

  for (let fila of filas) {
    const codigoEnFila = fila.cells[0].textContent;
    if (codigoEnFila === producto.codigo_barras) {
      // Ya existe ➔ actualizar cantidad
      const spanCantidad = fila.querySelector('.cantidad');
      let cantidadActual = parseInt(spanCantidad.textContent);
      cantidadActual += cantidadAgregar;
      spanCantidad.textContent = cantidadActual;

      // Actualizar Importe
      const precio = parseFloat(producto.precio_venta);
      fila.cells[4].textContent = `$${(precio * cantidadActual).toFixed(2)}`;

      // Validar existencia
      validarExistencia(fila, cantidadActual, producto.cantidad);

      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    // Producto nuevo ➔ crear fila
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
      <td>${producto.codigo_barras}</td>
      <td>${producto.descripcion}</td>
      <td>$${producto.precio_venta.toFixed(2)}</td>
      <td>
        <button class="btn-cantidad" onclick="cambiarCantidad(this, -1)">-</button>
        <span class="cantidad">${cantidadAgregar}</span>
        <button class="btn-cantidad" onclick="cambiarCantidad(this, 1)">+</button>
      </td>
      <td>$${(producto.precio_venta * cantidadAgregar).toFixed(2)}</td>
      <td>${producto.cantidad}</td>
    `;
    tablaListaVenta.appendChild(nuevaFila);

    // Validar existencia al crear
    validarExistencia(nuevaFila, cantidadAgregar, producto.cantidad);
  }
}

// Cambiar cantidad manualmente con botones + y -
function cambiarCantidad(boton, cambio) {
  const fila = boton.closest('tr');
  const spanCantidad = fila.querySelector('.cantidad');
  let cantidadActual = parseInt(spanCantidad.textContent);

  cantidadActual += cambio;
  if (cantidadActual < 1) cantidadActual = 1;

  spanCantidad.textContent = cantidadActual;

  const precioTexto = fila.cells[2].textContent.replace('$', '');
  const precio = parseFloat(precioTexto);

  fila.cells[4].textContent = `$${(precio * cantidadActual).toFixed(2)}`;

  const existencia = parseFloat(fila.cells[5].textContent);
  validarExistencia(fila, cantidadActual, existencia);
}

// Validar existencia y marcar en rojo si se pasa
function validarExistencia(fila, cantidad, existencia) {
  const celdaExistencia = fila.cells[5];
  if (cantidad > existencia) {
    celdaExistencia.style.backgroundColor = 'red';
    celdaExistencia.style.color = 'white';
  } else {
    celdaExistencia.style.backgroundColor = '';
    celdaExistencia.style.color = '';
  }
}

// Listeners
botonAgregar.addEventListener('click', agregarProductoATabla, true);

inputCodigo.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    agregarProductoATabla();
  }
});







// Abrir el modal Producto Común
function abrirModalComun() {
  document.getElementById('modalComun').style.display = 'block';
}

// Cerrar el modal Producto Común
function cerrarModalComun() {
  document.getElementById('modalComun').style.display = 'none';
  document.getElementById('descripcionComun').value = '';
  document.getElementById('cantidadComun').value = 1;
  document.getElementById('precioComun').value = 0.00;
}

// Confirmar carga Producto Común
function confirmarComun() {
  const descripcion = document.getElementById('descripcionComun').value.trim();
  const cantidad = parseInt(document.getElementById('cantidadComun').value.trim(), 10);
  const precio = parseFloat(document.getElementById('precioComun').value.trim());

  if (descripcion === '' || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio < 0) {
    alert('Por favor llena todos los campos correctamente.');
    return;
  }

  // Crear objeto producto artificial
  const productoComun = {
    codigo_barras: '0',
    descripcion: descripcion,
    precio_venta: precio,
    cantidad: 'ilim' // Existencia infinita
  };

  agregarOActualizarProducto(productoComun, cantidad);

  cerrarModalComun();
}








let productoSeleccionado = null;
let filaSeleccionada = null; // NUEVA VARIABLE

function abrirModalBuscar() {
  document.getElementById('modalBuscar').style.display = 'block';
  document.getElementById('inputBuscarDescripcion').value = '';
  document.getElementById('tablaResultadosBuscar').querySelector('tbody').innerHTML = '';
  productoSeleccionado = null;
}

function cerrarModalBuscar() {
  document.getElementById('modalBuscar').style.display = 'none';
}
// Buscar productos mientras escribe
async function buscarProductosPorDescripcion() {
  const texto = document.getElementById('inputBuscarDescripcion').value.trim();
  if (texto.length === 0) {
    document.getElementById('tablaResultadosBuscar').querySelector('tbody').innerHTML = '';
    productoSeleccionado = null;
    filaSeleccionada = null;
    return;
  }

  try {
    const respuesta = await fetch(`http://127.0.0.1:3000/buscar-descripcion/${texto}`);
    const productos = await respuesta.json();
    
    const tbody = document.getElementById('tablaResultadosBuscar').querySelector('tbody');
    tbody.innerHTML = '';

    productos.forEach(producto => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${producto.descripcion}</td>
        <td>$${producto.precio_venta.toFixed(2)}</td>
        <td>${producto.departamento || '-'}</td>
      `;

      fila.onclick = () => seleccionarProductoBusqueda(fila, producto);

      tbody.appendChild(fila);
    });

    productoSeleccionado = null;
    filaSeleccionada = null;
  } catch (error) {
    console.error('Error al buscar descripción:', error);
  }
}

// Nueva función para seleccionar un producto
function seleccionarProductoBusqueda(fila, producto) {
  if (filaSeleccionada) {
    filaSeleccionada.style.backgroundColor = '';
  }

  fila.style.backgroundColor = '#b3d7ff'; // Resalta la fila
  filaSeleccionada = fila;
  productoSeleccionado = producto;
}

// Aceptar producto seleccionado
function aceptarProductoBusqueda() {
  if (!productoSeleccionado) {
    alert('Selecciona un producto primero.');
    return;
  }

  agregarOActualizarProducto(productoSeleccionado, 1);
  cerrarModalBuscar();
}

// Permitir seleccionar filas en la tabla de ventas
tablaListaVenta.addEventListener('click', function(event) {
  const fila = event.target.closest('tr');
  if (fila) {
    fila.classList.toggle('seleccionado');
  }
});

let modoMayoreo = false; // 🌟 Estado global: false = precio normal, true = mayoreo

async function aplicarMayoreo() {
  const filas = tablaListaVenta.getElementsByTagName('tr');
  const filasSeleccionadas = Array.from(filas).filter(fila => fila.classList.contains('seleccionado'));
  const filasATrabajar = filasSeleccionadas.length > 0 ? filasSeleccionadas : filas;

  for (let fila of filasATrabajar) {
    const codigo = fila.cells[0].textContent.trim();
    if (codigo === '0') continue; // No aplicar mayoreo a productos comunes

    const precioCell = fila.cells[2];
    const importeCell = fila.cells[4];
    const spanCantidad = fila.querySelector('.cantidad');
    const cantidad = parseInt(spanCantidad.textContent);

    if (!fila.dataset.precioOriginal) {
      // Guardar precio original solo una vez
      const precioActualTexto = precioCell.textContent.replace('$', '');
      fila.dataset.precioOriginal = parseFloat(precioActualTexto);
    }

    if (modoMayoreo) {
      // 🔵 Modo normal (quitar descuento)
      const precioOriginal = parseFloat(fila.dataset.precioOriginal);
      precioCell.innerHTML = `$${precioOriginal.toFixed(2)}`;
      importeCell.textContent = `$${(precioOriginal * cantidad).toFixed(2)}`;
      fila.classList.remove('descuento-mayoreo');

    } else {
      // 🟢 Modo mayoreo (aplicar descuento)
      try {
        const respuesta = await fetch(`http://127.0.0.1:3000/buscar-mayoreo/${codigo}`);
        const producto = await respuesta.json();

        if (producto.error || producto.precio_mayoreo === null) {
          console.warn(`Producto ${codigo} no tiene precio mayoreo.`);
          continue;
        }

        const precioMayoreo = parseFloat(producto.precio_mayoreo);

        precioCell.innerHTML = `
          <div>$${precioMayoreo.toFixed(2)}</div>
          <small style="color: gray; text-decoration: line-through;">$${parseFloat(fila.dataset.precioOriginal).toFixed(2)}</small>
        `;
        importeCell.textContent = `$${(precioMayoreo * cantidad).toFixed(2)}`;
        fila.classList.add('descuento-mayoreo');

      } catch (error) {
        console.error(`Error buscando precio mayoreo para ${codigo}:`, error);
      }
    }
  }

  modoMayoreo = !modoMayoreo; // 🌟 Cambiar estado después de aplicar
}

// Al hacer click fuera de la tabla, limpiar selección
document.addEventListener('click', function(event) {
  const tabla = document.getElementById('lista-venta');
  const esClickDentroDeTabla = tabla.contains(event.target);

  if (!esClickDentroDeTabla) {
    limpiarSeleccionTabla();
  }
});

// Función para limpiar todas las filas seleccionadas
function limpiarSeleccionTabla() {
  const filas = tablaListaVenta.getElementsByTagName('tr');
  for (let fila of filas) {
    fila.classList.remove('seleccionado');
  }
}


function eliminarArticuloSeleccionado() {
  const tbody = document.getElementById("lista-venta");
  const filas = Array.from(tbody.querySelectorAll("tr.seleccionado"));
  let algunaFilaEliminada = false;

  const productos = tickets[currentTicket].productos;

  filas.forEach(fila => {
    const codigo = fila.cells[0].textContent.trim();
    // Eliminar del arreglo de productos del ticket actual
    const index = productos.findIndex(p => p.codigo === codigo);
    if (index !== -1) {
      productos.splice(index, 1);
      algunaFilaEliminada = true;
    }
  });

  if (!algunaFilaEliminada) {
    alert("Selecciona un producto primero para eliminar.");
    return;
  }

  renderTicket(); // 🔁 vuelve a renderizar la tabla sin los eliminados
}


// Función para mostrar/ocultar mensaje cuando tabla esté vacía
function actualizarEstadoTabla() {
  const tbody = document.getElementById('lista-venta');
  const mensajeVacio = document.getElementById('mensajeVacio');
  const hayFilas = tbody.querySelector('tr') !== null;

  if (hayFilas) {
    mensajeVacio.style.display = 'none';
  } else {
    mensajeVacio.style.display = 'block';
  }
}

let usuarioActual = "admin"; // Usuario actual por defecto
let tipoMovimiento = ""; // "entrada" o "salida"
let dineroActual = 0;

async function abrirModalCaja(tipo) {
  tipoMovimiento = tipo;
  document.getElementById("tituloModalCaja").textContent = tipo === "entrada" ? "Entrada de Dinero" : "Salida de Dinero";
  document.getElementById("cantidadCaja").value = "";
  document.getElementById("mensajeCaja").textContent = "";

  try {
    const respuesta = await fetch(`http://127.0.0.1:3000/dinero-en-caja?usuario=${usuarioActual}`);
    const data = await respuesta.json();
    dineroActual = data.total_en_caja;

    document.getElementById("dineroActualCaja").textContent = `Dinero actual en caja: $${dineroActual.toFixed(2)}`;
    document.getElementById("modalCaja").style.display = "flex";
  } catch (error) {
    console.error("Error al obtener dinero en caja:", error);
    document.getElementById("mensajeCaja").textContent = "Error al obtener dinero actual.";
    document.getElementById("modalCaja").style.display = "flex";
  }
}

function cerrarModalCaja() {
  document.getElementById("modalCaja").style.display = "none";
}

async function confirmarMovimientoCaja() {
  const cantidad = parseFloat(document.getElementById("cantidadCaja").value);

  if (isNaN(cantidad) || cantidad <= 0) {
    document.getElementById("mensajeCaja").textContent = "Ingrese una cantidad válida.";
    return;
  }

  if (tipoMovimiento === "salida" && cantidad > dineroActual) {
    document.getElementById("mensajeCaja").textContent = "No hay suficiente dinero en caja.";
    return;
  }

  const ruta = tipoMovimiento === "entrada"
    ? "http://127.0.0.1:3000/entrada"
    : "http://127.0.0.1:3000/salida";

  try {
    const respuesta = await fetch(ruta, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: cantidad, usuario: usuarioActual })
    });

    const data = await respuesta.json();

    document.getElementById("mensajeCaja").style.color = "green";
    document.getElementById("mensajeCaja").textContent = data.mensaje;
    setTimeout(cerrarModalCaja, 1500);
  } catch (error) {
    console.error("Error al confirmar movimiento:", error);
    document.getElementById("mensajeCaja").style.color = "red";
    document.getElementById("mensajeCaja").textContent = "Error al registrar el movimiento.";
  }
}


let tickets = [];
let currentTicket = 0;
let ticketCounter = 1; // No se reinicia, asegura numeración continua


function addTicket() {
  const ticket = {
    numero: ticketCounter++,
    productos: []
  };

  tickets.push(ticket);
  const index = tickets.length - 1;

  const tab = document.createElement("div");
  tab.className = "ticket-tab";
  tab.innerHTML = `
    <button onclick="switchTicket(${index})" class="tab-button">Ticket ${ticket.numero}</button>
    <span class="close-tab" onclick="cerrarTicket(${index}, event)">×</span>
  `;
  document.getElementById("ticket-tabs").appendChild(tab);

  switchTicket(index);
}

function switchTicket(index) {
  currentTicket = index;
  renderTicket();

  const ticket = tickets[index];
  const titulo = document.getElementById("titulo-ticket");
  if (titulo) {
    titulo.textContent = `VENTA DE PRODUCTOS - Ticket ${ticket.numero}`;
  }

  document.querySelectorAll(".tab-button").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}



function switchTicket(index) {
  currentTicket = index;
  renderTicket();

  const ticket = tickets[index];
  document.getElementById("titulo-ticket").textContent = `VENTA DE PRODUCTOS - Ticket ${ticket.numero}`;

  document.querySelectorAll(".tab-button").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}




function renderTicket() {
  const lista = document.getElementById("lista-venta");
  lista.innerHTML = "";

  const productos = tickets[currentTicket].productos;

  if (productos.length === 0) {
    document.getElementById("mensajeVacio").style.display = "block";
  } else {
    document.getElementById("mensajeVacio").style.display = "none";
    productos.forEach(prod => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${prod.codigo}</td>
        <td>${prod.descripcion}</td>
        <td>$${prod.precio.toFixed(2)}</td>
        <td>
          <button class="btn-cantidad" onclick="cambiarCantidadDesdeFila(this, -1)">-</button>
          <span class="cantidad">${prod.cantidad}</span>
          <button class="btn-cantidad" onclick="cambiarCantidadDesdeFila(this, 1)">+</button>
        </td>
        <td>$${(prod.precio * prod.cantidad).toFixed(2)}</td>
        <td>${prod.existencia}</td>
      `;
      lista.appendChild(row);

      validarExistencia(row, prod.cantidad, prod.existencia);
    });
  }
}

function agregarProductoAlTicket(prod) {
  tickets[currentTicket].push(prod);
  renderTicket();
}

function cerrarTicket(index, e) {
  e.stopPropagation();

  if (tickets.length === 1) {
    tickets[0].productos = [];
    renderTicket();
    return;
  }

  tickets.splice(index, 1);

  const tabsContainer = document.getElementById("ticket-tabs");
  tabsContainer.innerHTML = `<button onclick="addTicket()">+ Nuevo Ticket</button>`;
  tickets.forEach((ticket, i) => {
    const tab = document.createElement("div");
    tab.className = "ticket-tab";
    tab.innerHTML = `
      <button onclick="switchTicket(${i})" class="tab-button">Ticket ${ticket.numero}</button>
      <span class="close-tab" onclick="cerrarTicket(${i}, event)">×</span>
    `;
    tabsContainer.appendChild(tab);
  });

  currentTicket = Math.max(0, index - 1);
  switchTicket(currentTicket);
}

























function agregarOActualizarProducto(producto, cantidadAgregar) {
  const ticket = tickets[currentTicket];
  const productos = ticket.productos;
  let encontrado = false;

  for (let i = 0; i < productos.length; i++) {
    if (productos[i].codigo === producto.codigo_barras) {
      productos[i].cantidad += cantidadAgregar;
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    productos.push({
      codigo: producto.codigo_barras,
      descripcion: producto.descripcion,
      precio: parseFloat(producto.precio_venta),
      cantidad: cantidadAgregar,
      existencia: producto.cantidad
    });
  }

  renderTicket();
}

function cambiarCantidadDesdeFila(boton, cambio) {
  const fila = boton.closest("tr");
  const codigo = fila.cells[0].textContent.trim();
  const productos = tickets[currentTicket].productos;
  const producto = productos.find(p => p.codigo === codigo);
  if (!producto) return;

  producto.cantidad += cambio;
  if (producto.cantidad < 1) producto.cantidad = 1;

  renderTicket();
}

window.addEventListener("load", () => {
  addTicket(); // este se encarga de crear y mostrar Ticket 1 correctamente
  console.log("Ticket 1 generado al cargar.");
});


