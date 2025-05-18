console.log("Corte cargado");


function actualizar() {
  fetch('http://127.0.0.1:3000/corte_entradas?usuario=admin')
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      const entrada = data.entrada_dinero;
      const salida = data.salida_dinero;
      const inicial = data.dinero_inicial;
      const ventasEfectivo = data.ventas_efectivo;
      const ventasTarjeta = data.ventas_tarjeta;
      const pagosProveedores = data.pagos_proveedores;
      const totalEnCaja = data.total_en_caja;
      const totalCalculado = data.total_calculado;
      const diferencia = data.diferencia_total;
      const pagosClientes = data.pagos_clientes || 0;
      const ganancia = data.ganancias || 0;

      // Cálculos visuales
      const totalEntradas = (entrada + inicial - salida).toFixed(2);
      const totalEntradaSalida = (entrada - salida).toFixed(2);

      const bloques = document.querySelectorAll('.grid-corte .bloque');

      // 🔹 Bloque 1: Entradas de efectivo
      bloques[0].querySelectorAll('strong')[0].textContent = `$${entrada.toFixed(2)}`;
      bloques[0].querySelectorAll('strong')[1].textContent = `$${salida.toFixed(2)}`;
      bloques[0].querySelectorAll('strong')[2].textContent = `$${inicial.toFixed(2)}`;
      bloques[0].querySelector('.total strong').textContent = `$${totalEntradas}`;

      // 🔹 Bloque 2: Dinero en caja
      bloques[1].querySelectorAll('strong')[0].textContent = `+ $${ventasEfectivo.toFixed(2)}`;
      bloques[1].querySelectorAll('strong')[1].textContent = `+ $${ventasTarjeta.toFixed(2)}`;
      bloques[1].querySelectorAll('strong')[2].textContent = `${totalEntradaSalida >= 0 ? '+' : '-'} $${Math.abs(totalEntradaSalida).toFixed(2)}`;
      bloques[1].querySelectorAll('strong')[3].textContent = `- $${pagosProveedores.toFixed(2)}`;
      bloques[1].querySelector('.total strong').textContent = `$${totalCalculado.toFixed(2)}`;

      const totalContado = (ventasEfectivo + ventasTarjeta).toFixed(2);

      bloques[2].querySelectorAll('strong')[0].textContent = `$${ventasEfectivo.toFixed(2)}`;
      bloques[2].querySelectorAll('strong')[1].textContent = `$${ventasTarjeta.toFixed(2)}`;
      bloques[2].querySelector('.total strong').textContent = `$${totalContado}`;

      // 🔹 Mostrar resumen final
      document.getElementById('pagos-clientes').textContent = `$${pagosClientes.toFixed(2)}`;
      document.getElementById('pagos-proveedores').textContent = `$${pagosProveedores.toFixed(2)}`;
      document.getElementById('ventas-totales').textContent = `$${(ventasEfectivo + ventasTarjeta).toFixed(2)}`;
      document.getElementById('ganancia-dia').textContent = `$${ganancia.toFixed(2)}`;

      // ✅ Validar si hay diferencia en caja
      if (Math.abs(diferencia) > 0.009) {
        console.warn(`⚠️ Diferencia en caja: $${diferencia.toFixed(2)}`);
        alert(`⚠️ ¡Atención! Diferencia detectada entre total registrado ($${totalEnCaja.toFixed(2)}) y total calculado ($${totalCalculado.toFixed(2)}).\nDiferencia: $${diferencia.toFixed(2)}`);
      } else {
        console.log("✅ Total en caja validado correctamente.");
      }
    })
    .catch(err => {
      console.error("❌ Error al cargar entradas de corte:", err);
      alert("Error al cargar las entradas de efectivo.");
    });

  // 🔹 Gráfica de ventas por departamento
  fetch('http://127.0.0.1:3000/ventas_por_departamento')
    .then(response => {
      if (!response.ok) throw new Error("Respuesta no válida del servidor");
      return response.json();
    })
    .then(data => {
      console.log("Datos recibidos:", data);
      const etiquetas = data.map(item => item.departamento || 'Sin Departamento');
      const valores = data.map(item => item.total_ventas);

      const ctx = document.getElementById('graficaDepartamentos');
      if (!ctx) {
        console.error("No se encontró el canvas con id 'graficaDepartamentos'");
        return;
      }

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: etiquetas,
          datasets: [{
            label: 'Ventas $',
            data: valores,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar la gráfica de ventas por departamento:", error);
    });
}
