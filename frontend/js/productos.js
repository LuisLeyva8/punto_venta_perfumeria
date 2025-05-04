document.getElementById('formProducto').addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipoVenta = document.querySelector('input[name="tipoVenta"]:checked').value;
  let tipoProducto = 'normal';
  let unidad = 'pz';

  if (tipoVenta === 'granel') {
    const unidadGranelSelect = document.getElementById('unidadGranel');
    const unidadGranel = unidadGranelSelect ? unidadGranelSelect.value : 'ml'; // valor por defecto seguro
  
    unidad = unidadGranel;
    tipoProducto = unidadGranel === 'ml' ? 'liquido' : 'granel_solido';
  }
  

  const usaInventario = document.getElementById('usaInventario').checked;

  const producto = {
    codigo: document.getElementById('codigo').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),
    tipoVenta,
    tipoProducto,
    unidad,
    precioCosto: parseFloat(document.getElementById('precioCosto').value) || 0,
    precioVenta: parseFloat(document.getElementById('precioVenta').value) || 0,
    precioMayoreo: parseFloat(document.getElementById('precioMayoreo').value) || 0,
    departamento: document.getElementById('departamento').value || null,
    cantidad: usaInventario ? parseFloat(document.getElementById('cantidad').value) || 0 : 0,
    minimo: usaInventario ? parseFloat(document.getElementById('minimo').value) || 0 : 0,
    codigoKit: document.getElementById('esParteDeKit').checked 
  ? document.getElementById('buscarKit').value.trim() 
  : null

  };

  try {
    const response = await fetch('http://127.0.0.1:3000/producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error('Error al enviar producto:', error);
    alert('Error al conectar con el servidor.');
  }
});

const radiosTipoVenta = document.querySelectorAll('input[name="tipoVenta"]');
const divOpcionesGranel = document.getElementById('opcionesGranel');
const checkboxParteDeKit = document.getElementById('esParteDeKit');
const divSeleccionKit = document.getElementById('seleccionKit');

radiosTipoVenta.forEach(radio => {
  radio.addEventListener('change', () => {
    divOpcionesGranel.style.display = (radio.value === 'granel' && radio.checked) ? 'block' : 'none';
  });
});

checkboxParteDeKit.addEventListener('change', () => {
  divSeleccionKit.style.display = checkboxParteDeKit.checked ? 'block' : 'none';
});









document.getElementById('esParteDeKit').addEventListener('change', function () {
  document.getElementById('seleccionKit').style.display = this.checked ? 'block' : 'none';
});

document.getElementById('btnNuevoKit').addEventListener('click', () => {
  document.getElementById('modalKit').style.display = 'flex';
});

document.getElementById('cerrarModalKit').addEventListener('click', () => {
  document.getElementById('modalKit').style.display = 'none';
});

document.getElementById('guardarKit').addEventListener('click', async () => {
  const codigo = document.getElementById('codigoNuevoKit').value.trim();
  const nombre = document.getElementById('nombreNuevoKit').value.trim();

  if (!codigo || !nombre) {
    alert('Código y nombre son obligatorios');
    return;
  }

  const res = await fetch('http://127.0.0.1:3000/kits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo, nombre })
  });

  const data = await res.json();
  alert(data.message);
  if (res.ok) {
    document.getElementById('modalKit').style.display = 'none';
    document.getElementById('buscarKit').value = codigo;
    document.getElementById('resultadosKit').innerHTML = `<em>Seleccionado: ${codigo}</em>`;
  }
});

document.getElementById('buscarKit').addEventListener('input', async (e) => {
  const termino = e.target.value.trim();
  if (termino.length < 2) {
    document.getElementById('resultadosKit').innerHTML = '';
    return;
  }

  const res = await fetch(`http://127.0.0.1:3000/kits?buscar=${encodeURIComponent(termino)}`);
  const kits = await res.json();

  const contenedor = document.getElementById('resultadosKit');
  contenedor.innerHTML = kits.map(kit => `
    <div class="opcion-kit" data-codigo="${kit.codigo}">
      <strong>${kit.codigo}</strong> - ${kit.nombre}
    </div>
  `).join('');

  document.querySelectorAll('.opcion-kit').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('buscarKit').value = el.dataset.codigo;
      contenedor.innerHTML = `<em>Seleccionado: ${el.dataset.codigo}</em>`;
    });
  });
});
