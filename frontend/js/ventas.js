
  const inputCodigo = document.getElementById('codigo');
  const botonAgregar = document.getElementById('agregarProducto');
  const tablaListaVenta = document.getElementById('lista-venta');

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
  
  async function agregarProductoATabla() {
    const inputCodigo = document.getElementById('codigo');
    const codigo = inputCodigo.value.trim();
    if (codigo === '') return;
  
    const producto = await buscarProducto(codigo);
    if (!producto) return;
  
    const tabla = document.getElementById('lista-venta'); // <-- ahora directo al tbody
  
    // Buscar si ya existe una fila con el mismo código
    const filas = tabla.getElementsByTagName('tr');
    let encontrado = false;
  
    for (let fila of filas) {
      const codigoEnFila = fila.cells[0].textContent;
      if (codigoEnFila === producto.codigo_barras) {
        // Producto ya existe, aumentar cantidad
        let cantidadActual = parseInt(fila.cells[3].textContent);
        cantidadActual += 1;
        fila.cells[3].textContent = cantidadActual;
  
        // Actualizar importe
        const precio = parseFloat(producto.precio_venta);
        fila.cells[4].textContent = `$${(precio * cantidadActual).toFixed(2)}`;
  
        encontrado = true;
        break;
      }
    }
  
    if (!encontrado) {
      // Producto no existe, agregar nueva fila
      const nuevaFila = document.createElement('tr');
      nuevaFila.innerHTML = `
  <td>${producto.codigo_barras}</td>
  <td>${producto.descripcion}</td>
  <td>$${producto.precio_venta.toFixed(2)}</td>
  <td>
    <button class="btn-cantidad" onclick="cambiarCantidad(this, -1)">-</button>
    <span class="cantidad">1</span>
    <button class="btn-cantidad" onclick="cambiarCantidad(this, 1)">+</button>
  </td>
  <td>$${producto.precio_venta.toFixed(2)}</td>
  <td>${producto.cantidad}</td>
`;
      tabla.appendChild(nuevaFila);
    }
  
    inputCodigo.value = '';
    inputCodigo.focus();
  }
  
  function cambiarCantidad(boton, cambio) {
    const fila = boton.closest('tr');
    const spanCantidad = fila.querySelector('.cantidad');
    let cantidadActual = parseInt(spanCantidad.textContent);
  
    cantidadActual += cambio;
  
    if (cantidadActual < 1) {
      cantidadActual = 1; // No permitir cantidades menores a 1
    }
  
    spanCantidad.textContent = cantidadActual;
  
    // Actualizar el importe
    const precioTexto = fila.cells[2].textContent.replace('$', '');
    const precio = parseFloat(precioTexto);
    fila.cells[4].textContent = `$${(precio * cantidadActual).toFixed(2)}`;
  }
  
  

  botonAgregar.addEventListener('click', agregarProductoATabla, true);

  inputCodigo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          agregarProductoATabla();
      }
  });