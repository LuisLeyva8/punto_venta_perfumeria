// app/js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginContainer = document.getElementById("loginContainer");
    const appContainer = document.getElementById("appContainer");
  
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
  
      // Aquí puedes conectar con backend Java (temporalmente validación simple)
      if (user === "admin" && pass === "1234") {
        loginContainer.classList.add("hidden");
        appContainer.classList.remove("hidden");
        mostrarPantalla("ventas");
      } else {
        document.getElementById("loginMessage").textContent = "Credenciales incorrectas";
      }
    });
  });
  
  function mostrarPantalla(nombre) {
    fetch(`views/${nombre}.html`)
      .then(res => res.text())
      .then(html => {
        document.getElementById("contenido").innerHTML = html;
  
        const scriptId = "pantalla-script";
        const oldScript = document.getElementById(scriptId);
        if (oldScript) oldScript.remove();
  
        const script = document.createElement("script");
        script.src = `js/${nombre}.js`;
        script.id = scriptId;
        document.body.appendChild(script);
      });
  }
  

  // Mostrar/ocultar menú en móvil
document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("hidden");
  });
  