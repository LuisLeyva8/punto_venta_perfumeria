const nombreNegocioInicio = localStorage.getItem('nombreNegocio');
const logoNegocioInicio = localStorage.getItem('logoNegocio');

if (nombreNegocioInicio) {
  document.getElementById('nombreNegocioInicio').textContent = nombreNegocioInicio;
}

if (logoNegocioInicio) {
  document.getElementById('logoNegocioInicio').src = logoNegocioInicio;
}
