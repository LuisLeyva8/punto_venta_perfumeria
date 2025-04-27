// frontend/js/config-negocio.js

// Función para aplicar la configuración guardada
document.addEventListener('DOMContentLoaded', () => {
    aplicarConfiguracionNegocio();
  });
  
  function aplicarConfiguracionNegocio() {
    const config = JSON.parse(localStorage.getItem('configNegocio'));
    if (!config) return;
  
    // Aplicar colores
    document.documentElement.style.setProperty('--color-bg', config.colorFondo || '#f9fafb');
    document.documentElement.style.setProperty('--color-text', config.colorTexto || '#111827');
    document.documentElement.style.setProperty('--color-primary', config.colorPrimario || '#000000');
    document.documentElement.style.setProperty('--color-accent', config.colorPrimario || '#10b981');
  
    // Aplicar nombre del negocio
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
      logoElement.innerHTML = '';
      if (config.logoBase64) {
        const img = document.createElement('img');
        img.src = config.logoBase64;
        img.alt = 'Logo';
        img.style.height = '40px';
        img.style.borderRadius = '8px';
        logoElement.appendChild(img);
      }
      if (config.nombreNegocio) {
        const spanNombre = document.createElement('strong');
        spanNombre.style.marginLeft = '8px';
        spanNombre.textContent = config.nombreNegocio;
        logoElement.appendChild(spanNombre);
      }
    }
  }
  
  // Si estás en config-negocio.html y se guarda el formulario:
  const formConfigNegocio = document.getElementById('form-config-negocio');
  if (formConfigNegocio) {
    formConfigNegocio.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const nombreNegocio = document.getElementById('nombreNegocio').value.trim();
      const colorPrimario = document.getElementById('colorPrimario').value;
      const colorFondo = document.getElementById('colorFondo').value;
      const colorTexto = document.getElementById('colorTexto').value;
  
      const logoInput = document.getElementById('logoNegocio');
  
      const config = {
        nombreNegocio,
        colorPrimario,
        colorFondo,
        colorTexto,
      };
  
      // Leer logo si se subió
      if (logoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
          config.logoBase64 = event.target.result;
          localStorage.setItem('configNegocio', JSON.stringify(config));
          alert('Configuración guardada correctamente!');
          location.reload();
        };
        reader.readAsDataURL(logoInput.files[0]);
      } else {
        // Si no hay nuevo logo
        localStorage.setItem('configNegocio', JSON.stringify(config));
        alert('Configuración guardada correctamente!');
        location.reload();
      }
    });
  }
  