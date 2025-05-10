
cargarPantalla("inicio");
// Función única para cargar pantalla y su JS
function cargarPantalla(nombre) {
  const contenedor = document.getElementById("pantalla-container") || document.querySelector(".content");

  // Cargar el HTML desde views/
  fetch(`views/${nombre}.html`)
    .then(res => res.text())
    .then(html => {
      contenedor.innerHTML = html;

      // Eliminar script anterior si existe
      const scriptAnterior = document.getElementById("pantalla-script");
      if (scriptAnterior) scriptAnterior.remove();

      // Solo cargar JS si existe para la pantalla
    

      // SIEMPRE intentar cargar el js correspondiente a la pantalla
      const nuevoScript = document.createElement("script");
      nuevoScript.src = `js/${nombre}.js`;  // 🔥 Aquí usa dinámicamente el nombre
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

// Clicks del menú lateral
document.querySelectorAll(".menu-lateral .item").forEach(btn => {
  btn.addEventListener("click", () => {
    const pantalla = btn.dataset.pantalla;
    if (pantalla) cargarPantalla(pantalla);
  });
});

// Clicks del menú móvil (footer)
document.querySelectorAll(".footer-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const pantalla = btn.dataset.pantalla;
    if (pantalla) cargarPantalla(pantalla);
  });
});

// Al iniciar, carga "inicio"
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
