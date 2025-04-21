document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
  
    // Simulación de validación (puedes reemplazarlo con fetch a un backend real)
    if (username === "admin" && password === "1234") {
      message.style.color = "green";
      message.textContent = "Inicio de sesión exitoso";
      // Redireccionar o hacer otra acción
    } else {
      message.style.color = "red";
      message.textContent = "Usuario o contraseña incorrectos";
    }
  });
  