const nombreNegocio = localStorage.getItem('nombreNegocio');
const logoNegocio = localStorage.getItem('logoNegocio');

// Clicks del menú lateral
document.querySelectorAll(".menu-lateral .item").forEach(btn => {
  btn.addEventListener("click", () => {
    const pantalla = btn.dataset.pantalla;
    if (pantalla) mostrarPantalla(pantalla);
  });
});

// Clicks del menú móvil
document.querySelectorAll(".footer-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const pantalla = btn.dataset.pantalla;
    if (pantalla) mostrarPantalla(pantalla);
  });
});

// Mostrar pantalla inicial
mostrarPantalla("inicio");



function mostrarPantalla(nombre) {
  const contenedor = document.querySelector(".content");

  // Cargar el HTML desde views/
  fetch(`views/${nombre}.html`)
    .then(res => res.text())
    .then(html => {
      contenedor.innerHTML = html;

      // Marcar como activo en el menú lateral
      document.querySelectorAll(".menu-lateral .item").forEach(btn => btn.classList.remove("active"));
      const btnLateral = document.querySelector(`.menu-lateral .item[data-pantalla='${nombre}']`);
      if (btnLateral) btnLateral.classList.add("active");

      // Marcar como activo en el menú inferior
      document.querySelectorAll(".footer-nav button").forEach(btn => btn.classList.remove("active"));
      const btnInferior = document.querySelector(`.footer-nav button[data-pantalla='${nombre}']`);
      if (btnInferior) btnInferior.classList.add("active");

      // Eliminar JS anterior si existe
      const scriptAnterior = document.getElementById("pantalla-script");
      if (scriptAnterior) scriptAnterior.remove();

      // Cargar nuevo JS de la pantalla
      const script = document.createElement("script");
      script.src = `js/${nombre}.js`;
      script.id = "pantalla-script";
      document.body.appendChild(script);
    })
    .catch(() => {
      contenedor.innerHTML = "<p>Error al cargar la vista.</p>";
    });
}

// Eventos de clic



// Escucha clicks del menú lateral y del menú inferior
document.querySelectorAll("[data-pantalla]").forEach(btn => {
  btn.addEventListener("click", () => {
    const pantalla = btn.dataset.pantalla;
    if (pantalla) cargarPantalla(pantalla);
  });
});

// Función única para cargar pantalla y su JS
function cargarPantalla(nombre) {
  const contenedor = document.getElementById("pantalla-container") || document.querySelector(".content");

  // Cargar el HTML desde views/
  fetch(`views/${nombre}.html`)
    .then(res => res.text())
    .then(html => {
      contenedor.innerHTML = html;

      // Quitar scripts viejos
      const scriptAnterior = document.getElementById("pantalla-script");
      if (scriptAnterior) scriptAnterior.remove();

      // Cargar nuevo script de la pantalla
      const nuevoScript = document.createElement("script");
      nuevoScript.src = `js/${nombre}.js`;
      nuevoScript.id = "pantalla-script";
      document.body.appendChild(nuevoScript);

      // Actualizar menú lateral activo
      document.querySelectorAll(".menu-lateral .item").forEach(btn => btn.classList.remove("active"));
      const btnLateral = document.querySelector(`.menu-lateral .item[data-pantalla='${nombre}']`);
      if (btnLateral) btnLateral.classList.add("active");

      // Actualizar menú inferior activo
      document.querySelectorAll(".footer-nav button").forEach(btn => btn.classList.remove("active"));
      const btnInferior = document.querySelector(`.footer-nav button[data-pantalla='${nombre}']`);
      if (btnInferior) btnInferior.classList.add("active");
    })
    .catch(err => {
      console.error("❌ Error al cargar la pantalla:", err);
      contenedor.innerHTML = "<p>Error al cargar la vista.</p>";
    });
}

// Al iniciar, carga inicio
cargarPantalla("inicio");

// Cargar nombre y logo del negocio si existen

if (nombreNegocio) {
  const nombreElemento = document.getElementById('nombreNegocioSidebar');
  if (nombreElemento) nombreElemento.textContent = nombreNegocio;
}

if (logoNegocio) {
  const logoElemento = document.getElementById('logoNegocioSidebar');
  if (logoElemento) logoElemento.src = logoNegocio;
}
