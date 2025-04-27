
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
document.querySelectorAll("[data-pantalla]").forEach(btn => {
  btn.addEventListener("click", () => {
    const pantalla = btn.dataset.pantalla;
    if (pantalla) mostrarPantalla(pantalla);
  });
});

// Mostrar por defecto
mostrarPantalla("inicio");


function cargarPantalla(nombre) {
  fetch(`views/${nombre}.html`)
    .then(res => res.text())
    .then(html => {
      const contenedor = document.getElementById('pantalla-container');
      if (contenedor) {
        contenedor.innerHTML = html;

        // Cargar el script correspondiente
        const script = document.getElementById("pantalla-script");
        if (script) script.remove();

        const nuevoScript = document.createElement("script");
        nuevoScript.src = `js/${nombre}.js`;
        nuevoScript.id = "pantalla-script";
        document.body.appendChild(nuevoScript);
      }
    })
    .catch(err => {
      console.error("❌ Error al cargar la pantalla:", err);
    });
}
