document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
  
    const usuarioDemo = {
      username: "admin",
      password: "1234",
      nombre: "Administrador",
      rol: "Gerente"
    };
  
    if (usuario === usuarioDemo.username && contrasena === usuarioDemo.password) {
      // Guardar sesión
      localStorage.setItem('usuarioActivo', JSON.stringify({
        nombre: usuarioDemo.nombre,
        rol: usuarioDemo.rol,
        username: usuarioDemo.username
      }));
  
      // Redirigir al sistema principal
      window.location.replace('index.html');  // Usar replace para no volver atrás
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  });
  