document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-config-negocio');
    const nombreNegocioInput = document.getElementById('nombreNegocio');
    const logoInput = document.getElementById('logoNegocio');
    const previewLogo = document.getElementById('previewLogo');
    const colorPrimarioInput = document.getElementById('colorPrimario');
    const colorFondoInput = document.getElementById('colorFondo');
    const colorTextoInput = document.getElementById('colorTexto');
  
    // Cargar valores guardados si existen
    const nombreGuardado = localStorage.getItem('nombreNegocio');
    const logoGuardado = localStorage.getItem('logoNegocio');
    const colorPrimarioGuardado = localStorage.getItem('colorPrimario');
    const colorFondoGuardado = localStorage.getItem('colorFondo');
    const colorTextoGuardado = localStorage.getItem('colorTexto');
  
    if (nombreGuardado) nombreNegocioInput.value = nombreGuardado;
    if (colorPrimarioGuardado) colorPrimarioInput.value = colorPrimarioGuardado;
    if (colorFondoGuardado) colorFondoInput.value = colorFondoGuardado;
    if (colorTextoGuardado) colorTextoInput.value = colorTextoGuardado;
    if (logoGuardado) {
      previewLogo.innerHTML = `<img src="${logoGuardado}" alt="Logo" style="max-width:100px; border-radius:10px;">`;
    }
  
    // Evento al cambiar logo para previsualizarlo
    logoInput.addEventListener('change', function () {
      const file = logoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewLogo.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width:100px; border-radius:10px;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Evento guardar cambios
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const nombreNegocio = nombreNegocioInput.value;
      const colorPrimario = colorPrimarioInput.value;
      const colorFondo = colorFondoInput.value;
      const colorTexto = colorTextoInput.value;
  
      localStorage.setItem('nombreNegocio', nombreNegocio);
      localStorage.setItem('colorPrimario', colorPrimario);
      localStorage.setItem('colorFondo', colorFondo);
      localStorage.setItem('colorTexto', colorTexto);
  
      // Logo
      const file = logoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          localStorage.setItem('logoNegocio', e.target.result);
          actualizarVista();
        };
        reader.readAsDataURL(file);
      } else {
        actualizarVista();
      }
    });
  
    function actualizarVista() {
      // Cambiar valores CSS dinámicamente
      document.documentElement.style.setProperty('--color-primary', localStorage.getItem('colorPrimario'));
      document.documentElement.style.setProperty('--color-bg', localStorage.getItem('colorFondo'));
      document.documentElement.style.setProperty('--color-text', localStorage.getItem('colorTexto'));
  
      // Cambiar nombre y logo en el sidebar si existen
      const nombreElement = document.getElementById('nombreNegocioSidebar');
      const logoElement = document.getElementById('logoNegocioSidebar');
  
      if (nombreElement) nombreElement.textContent = localStorage.getItem('nombreNegocio') || 'Negocio';
      if (logoElement) logoElement.src = localStorage.getItem('logoNegocio') || '';
  
      alert('✅ ¡Cambios guardados correctamente!');
    }
});
  