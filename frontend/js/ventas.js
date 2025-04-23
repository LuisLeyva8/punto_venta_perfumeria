console.log("Ventas cargado");

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input[type='text']");
  const tabla = document.getElementById("listaProductos");

  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const codigo = input.value.trim();
      if (codigo) {
        const row = `<tr>
          <td>${codigo}</td>
          <td>Producto Demo</td>
          <td>$10.00</td>
          <td>1</td>
          <td>$10.00</td>
          <td>20</td>
        </tr>`;
        tabla.insertAdjacentHTML("beforeend", row);
        input.value = "";
      }
    }
  });
});
