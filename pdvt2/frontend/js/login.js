// login.js - Lógica de validación básica de inicio de sesión

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
  
    // Usuario fijo para pruebas (puedes reemplazarlo por verificación de base de datos o API)
    const usuarioDemo = {
      username: "admin",
      password: "1234",
      nombre: "Administrador",
      rol: "Gerente"
    };
  
    if (usuario === usuarioDemo.username && contrasena === usuarioDemo.password) {
      // Guardar sesión simulada
      localStorage.setItem('usuarioActivo', JSON.stringify({
        nombre: usuarioDemo.nombre,
        rol: usuarioDemo.rol,
        username: usuarioDemo.username
      }));
  
      // Redirigir al sistema principal
      window.location.href = 'index.html';
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  });
  