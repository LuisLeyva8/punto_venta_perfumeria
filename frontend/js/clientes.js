
function previewFoto(event) {
  const input = event.target;
  const preview = document.getElementById("fotoPreview");

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = "/static/frontend/img/default-profile.png";
  }
}

function abrirModalCliente() {
  document.getElementById("formCliente").reset();
  document.getElementById("modalCliente").style.display = "flex";
   establecerFechaDeHoy();
}

function cerrarModalCliente() {
  document.getElementById("modalCliente").style.display = "none";
}

document.getElementById("buscadorClientes").addEventListener("input", function() {
  renderizarClientes(this.value);
});


document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fechaRegistro").value = hoy;
});

document.getElementById("formCliente").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nombre", document.getElementById("nombreCliente").value);
  formData.append("telefono", document.getElementById("telefonoCliente").value);
  formData.append("correo", document.getElementById("correoCliente").value);
  formData.append("descuento", document.getElementById("descuentoCliente").value);
  formData.append("monto_minimo_mensual", document.getElementById("montoMinimoCliente").value);

  const archivoFoto = document.getElementById("fotoCliente").files[0];
  if (archivoFoto) {
    formData.append("foto", archivoFoto);
  }

  try {
    const res = await fetch("http://127.0.0.1:3000/clientes", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      cerrarModalCliente();
      cargarClientes(); // si tienes esta función que recarga desde el backend
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
});



let clientes = [];

async function cargarClientes() {
  try {
    const res = await fetch("http://127.0.0.1:3000/clientes");
    if (!res.ok) throw new Error("No se pudo cargar la lista de clientes");

    clientes = await res.json();
    renderizarClientes();
  } catch (err) {
    console.error("Error al cargar clientes:", err);
  }
}

function renderizarClientes(filtro = "") {
  const tbody = document.getElementById("listadoClientes");
  tbody.innerHTML = "";

  clientes
    .filter(c => {
      const texto = `${c.nombre_completo} ${c.telefono}`.toLowerCase();
      return texto.includes(filtro.toLowerCase());
    })
    .forEach((c, index) => {
      const descuento = parseFloat(c.descuento || 0).toFixed(2);
      const saldo = parseFloat(c.saldo_actual || 0).toFixed(2);
      const minimo = parseFloat(c.monto_minimo_mensual || 0).toFixed(2);
      const suscripcion = c.suscripcion_activa ? "✅" : "❌";

      let fecha = "—";
      if (c.fecha_ultima_compra) {
        const dateObj = new Date(c.fecha_ultima_compra);
        fecha = new Intl.DateTimeFormat('es-MX').format(dateObj);
      }

      const srcImg = c.foto
        ? `data:image/png;base64,${c.foto}`
        : "/static/frontend/img/default-profile.png";

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${srcImg}" alt="Foto" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
        <td>${index + 1}</td>
        <td>${c.nombre_completo}</td>
        <td>${c.telefono || "—"}</td>
        <td>${descuento}%</td>
        <td>$${saldo}</td>
        <td>${suscripcion}</td>
        <td>$${minimo}</td>
        <td>${fecha}</td>
      `;
      tbody.appendChild(fila);
    });
}




// Ejecutar inmediatamente después de cargar el JS (porque el HTML ya está insertado)
(() => {
  const hoy = new Date().toISOString().split("T")[0];
  const fechaInput = document.getElementById("fechaRegistro");
  if (fechaInput) fechaInput.value = hoy;
  console.log("funciona")
  cargarClientes();
})();

function establecerFechaDeHoy() {
  const inputFecha = document.getElementById("fechaRegistro");
  if (inputFecha) {
    const hoy = new Date().toISOString().split("T")[0];
    inputFecha.value = hoy;
  } else {
    console.warn("No se encontró el input con id fechaRegistro");
  }
}

