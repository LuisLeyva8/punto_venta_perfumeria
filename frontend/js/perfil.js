// perfil.js - Script de perfil de usuario

document.addEventListener('DOMContentLoaded', () => {
    const datos = JSON.parse(localStorage.getItem('usuarioActivo')) || {};
    document.getElementById('nombreUsuario').textContent = datos.nombre || '-';
    document.getElementById('usuarioLogin').textContent = datos.username || '-';
    document.getElementById('rolUsuario').textContent = datos.rol || '-';
  
    // Foto de perfil (cargada desde localStorage o default)
    const fotoGuardada = localStorage.getItem('fotoPerfil');
    if (fotoGuardada) {
      document.getElementById('imagenPerfil').src = fotoGuardada;
    }
  
    // Subir foto de perfil
    document.getElementById('archivoPerfil').addEventListener('change', (e) => {
      const archivo = e.target.files[0];
      if (archivo) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64 = event.target.result;
          document.getElementById('imagenPerfil').src = base64;
          localStorage.setItem('fotoPerfil', base64);
        };
        reader.readAsDataURL(archivo);
      }
    });
  
    // Cambiar contraseña (simulado)
    document.getElementById('btnCambiarClave').addEventListener('click', () => {
      const nuevaClave = document.getElementById('nuevaClave').value.trim();
      if (nuevaClave.length < 4) {
        alert('La nueva contraseña debe tener al menos 4 caracteres.');
        return;
      }
      // Simulado: en un sistema real, enviar al backend
      alert('Contraseña actualizada correctamente.');
      document.getElementById('nuevaClave').value = '';
    });
  
    // Cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('fotoPerfil');
      window.location.href = 'login.html';
    });
  });
  