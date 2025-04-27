console.log("Clientes cargado");

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = `
    <li>Juan Pérez</li>
    <li>Lucía Gómez</li>
    <li>Carlos Ruiz</li>
  `;
});
