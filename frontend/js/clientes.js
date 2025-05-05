let clientes = [];

function abrirModalCliente() {
  document.getElementById("formCliente").reset();
  document.getElementById("modalCliente").style.display = "flex";
}

function cerrarModalCliente() {
  document.getElementById("modalCliente").style.display = "none";
}

document.getElementById("formCliente").addEventListener("submit", function(e) {
  e.preventDefault();

  const nuevo = {
    tipo: document.getElementById("tipoCliente").value,
    nombre: document.getElementById("nombreCliente").value,
    apellido: document.getElementById("apellidoCliente").value,
    telefono: document.getElementById("telefonoCliente").value,
    correo: document.getElementById("correoCliente").value,
    descuento: document.getElementById("descuentoCliente").value
  };

  clientes.push(nuevo);
  cerrarModalCliente();
  renderizarClientes();
});

// 🔍 Buscador en tiempo real
document.getElementById("buscadorClientes").addEventListener("input", function() {
  renderizarClientes(this.value);
});

function renderizarClientes(filtro = "") {
  const tbody = document.getElementById("listadoClientes");
  tbody.innerHTML = "";

  clientes
    .filter(c => {
      const texto = `${c.nombre} ${c.apellido} ${c.tipo} ${c.telefono}`.toLowerCase();
      return texto.includes(filtro.toLowerCase());
    })
    .forEach((c, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${c.nombre} ${c.apellido}</td>
        <td>${c.tipo}</td>
        <td>${c.telefono}</td>
      `;
      tbody.appendChild(fila);
    });
}
