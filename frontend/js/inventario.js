console.log("Inventario cargado");

(function () {
const codigoInput = document.getElementById('codigoProducto');
const descripcionInput = document.getElementById('descripcionProducto');
const cantidadActualInput = document.getElementById('cantidadActual');
const cantidadAgregarInput = document.getElementById('cantidadAgregar');
const form = document.querySelector('.form-inventario');

// Buscar producto al salir del campo de código
codigoInput.addEventListener('blur', () => {
  const codigo = codigoInput.value.trim();
  if (codigo === '') return;

  fetch(`http://127.0.0.1:3000/producto/${codigo}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        descripcionInput.value = '-';
        cantidadActualInput.value = '0';
      } else {
        descripcionInput.value = data.descripcion;
        cantidadActualInput.value = data.cantidad;
      }
    })
    .catch(error => {
      console.error('Error al obtener producto:', error);
      alert('Error al buscar el producto.');
    });
});

// Enviar formulario para actualizar inventario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const codigo = codigoInput.value.trim();
  const cantidadAgregar = parseFloat(cantidadAgregarInput.value);

  if (!codigo || isNaN(cantidadAgregar) || cantidadAgregar <= 0) {
    alert('Ingresa un código válido y una cantidad mayor a cero.');
    return;
  }

  fetch('http://127.0.0.1:3000/actualizar_inventario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      codigo: codigo,
      cantidad: cantidadAgregar
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ok') {
      alert(data.mensaje);
      const cantidadActual = parseFloat(cantidadActualInput.value);
      cantidadActualInput.value = (cantidadActual + cantidadAgregar).toFixed(2);
      cantidadAgregarInput.value = '';
    } else {
      alert(data.error || 'Error al actualizar inventario.');
    }
  })
  .catch(error => {
    console.error('Error al enviar actualización:', error);
    alert('Error al conectar con el servidor.');
  });
});
})();